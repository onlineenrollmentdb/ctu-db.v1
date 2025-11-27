const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { updateStudentYearLevel } = require('./academicController');
const settingsService = require('./settingsController'); // or correct path

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '1d';

// 🔹 Verification codes memory
let verificationCodes = {};
setInterval(() => {
    try {
        const now = Date.now();
        for (const [student_id, data] of Object.entries(verificationCodes)) {
            if (data.expires < now) delete verificationCodes[student_id];
        }
    } catch (err) {
        console.error('Verification cleanup error:', err);
    }
}, 10 * 60 * 1000); // every 10 min

// ====================================
// LOGIN
// ====================================
exports.login = async (req, res) => {
    const { student_id, password } = req.body;
    if (!student_id || !password) return res.status(400).json({ error: 'Student ID and password are required' });

    try {
        const [rows] = await db.execute(
            `SELECT s.*, p.program_code, p.program_name
             FROM students s
             LEFT JOIN programs p ON s.program_id = p.program_id
             WHERE s.student_id = ?`,
            [student_id]
        );

        if (!rows.length) return res.status(401).json({ error: 'Invalid student ID' });

        const student = rows[0];
        if (!student.is_approved) return res.status(403).json({ error: 'Account not yet activated' });

        const match = await bcrypt.compare(password, student.password);
        if (!match) return res.status(401).json({ error: 'Incorrect password' });

        const token = jwt.sign({ student_id: student.student_id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        const { password: _, ...studentData } = student;

        // 🔹 Hybrid enrollment: create if not exists
        await createEnrollmentIfNotExists(student.student_id);

        // 🔹 Update year level for this student (hybrid)
        await updateStudentYearLevel(student.student_id);

        res.json({ message: 'Login successful', student: studentData, token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// ====================================
// STEP 1: Check Student ID & Send Code
// ====================================
exports.checkStudent = async (req, res) => {
    try {
        const { student_id } = req.body;
        if (!student_id) return res.status(400).json({ error: 'Student ID is required.' });

        const [rows] = await db.execute('SELECT * FROM students WHERE student_id = ?', [student_id]);
        if (!rows.length) return res.status(404).json({ error: 'Invalid student ID.' });

        const student = rows[0];
        if (!student.email) return res.status(400).json({ error: 'No email associated with this student ID.' });
        if (student.is_approved === 1) return res.status(400).json({ error: 'Student already approved.' });

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = Date.now() + 5 * 60 * 1000; // 5 min
        verificationCodes[student_id] = { code, expires };

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });

        await transporter.sendMail({
            from: `"CTU Enrollment System" <${process.env.EMAIL_USER}>`,
            to: student.email,
            subject: 'CTU Verification Code',
            text: `Hello ${student.first_name},\n\nYour verification code is: ${code}\n\nThis code will expire in 5 minutes.\n\n- CTU Registrar`
        });

        res.json({ message: 'Verification code sent.' });
    } catch (err) {
        console.error('checkStudent error:', err);
        res.status(500).json({ error: 'Server error while verifying student.' });
    }
};

// ====================================
// STEP 2: Verify Code & Set Password
// ====================================
exports.verifyCodeAndSetPassword = async (req, res) => {
    try {
        const { student_id, code, password, confirmPassword } = req.body;
        if (!student_id || !code || !password || !confirmPassword)
            return res.status(400).json({ error: 'All fields are required.' });
        if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match.' });

        const [rows] = await db.execute('SELECT * FROM students WHERE student_id = ?', [student_id]);
        if (!rows.length) return res.status(404).json({ error: 'Invalid student ID.' });

        const storedCode = verificationCodes[student_id];
        if (!storedCode) return res.status(400).json({ error: 'No verification code found.' });
        if (Date.now() > storedCode.expires) {
            delete verificationCodes[student_id];
            return res.status(400).json({ error: 'Verification code expired.' });
        }
        if (storedCode.code !== code) return res.status(400).json({ error: 'Invalid verification code.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute('UPDATE students SET password = ?, is_approved = 1 WHERE student_id = ?', [hashedPassword, student_id]);
        delete verificationCodes[student_id];

        res.json({ message: 'Password set successfully. Account now active.' });
    } catch (err) {
        console.error('verifyCodeAndSetPassword error:', err);
        res.status(500).json({ error: 'Server error during verification.' });
    }
};

// 🔹 Create enrollment for current semester if not exists
const createEnrollmentIfNotExists = async (studentId) => {
    try {
        const settings = await settingsService.getSettingsInternal(); // dynamic semester
        const currentYear = settings.current_academic_year;
        const currentSem = settings.current_semester;

        if (!currentYear || !currentSem || currentSem === 'Break') {
            console.warn(`Cannot create enrollment: invalid semester/year`, { currentYear, currentSem });
            return;
        }

        const [existing] = await db.execute(
            `SELECT * FROM enrollments WHERE student_id = ? AND academic_year = ? AND semester = ?`,
            [studentId, currentYear, currentSem]
        );

        if (existing.length === 0) {
            await db.execute(
                `INSERT INTO enrollments (student_id, academic_year, semester, enrollment_status)
                  VALUES (?, ?, ?, ?)`,
                [studentId, currentYear, currentSem, 0]
            );
            console.log(`✅ Enrollment created for student ${studentId} for ${currentSem} ${currentYear}`);
        }
    } catch (err) {
        console.error(`Failed to create enrollment for student ${studentId}:`, err);
    }
};

