const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const settingsService = require('./settingsController'); // or correct path
require('dotenv').config();

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


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
    if (!student_id)
      return res.status(400).json({ error: "Student ID is required." });

    const [rows] = await db.execute(
      "SELECT * FROM students WHERE student_id = ?",
      [student_id]
    );

    if (!rows.length)
      return res.status(404).json({ error: "Invalid student ID." });

    const student = rows[0];

    if (!student.email)
      return res.status(400).json({
        error: "No email associated with this student ID.",
      });

    if (student.is_approved === 1)
      return res.status(400).json({
        error: "Student already verified.",
      });

    // Generate 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 5 * 60 * 1000; // valid for 5 minutes
    verificationCodes[student_id] = { code, expires };

    // Send email via SendGrid
    const msg = {
      to: student.email,
      from: process.env.EMAIL_FROM,
      subject: "📘 CTU Student Verification Code",
      html: `
        <h3>Hello ${student.first_name},</h3>
        <p>Your CTU student verification code is:</p>
        <h1 style="letter-spacing: 4px;">${code}</h1>
        <p>This code will expire in <b>5 minutes</b>.</p>
        <br/>
        <p>– CTU Registrar</p>
      `,
    };

    await sgMail.send(msg);

    res.json({ message: `Verification code sent to your email: ${student.email} Please check (including spam folder). code will expire in 5 minutes.` });
  } catch (err) {
    console.error("checkStudent error:", err);
    res
      .status(500)
      .json({ error: "Server error while verifying student." });
  }
};

exports.verifyCode = async (req, res) => {
  try {
    const { student_id, code } = req.body;
    if (!student_id || !code) return res.status(400).json({ error: 'Student ID and code required.' });

    const storedCode = verificationCodes[student_id];
    if (!storedCode) return res.status(400).json({ error: 'No verification code found.' });
    if (Date.now() > storedCode.expires) {
      delete verificationCodes[student_id];
      return res.status(400).json({ error: 'Verification code expired.' });
    }
    if (storedCode.code !== code) return res.status(400).json({ error: 'Invalid/Expired verification code. Please try again.' });

    const token = jwt.sign({ student_id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.json({ message: 'Code verified', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during code verification.' });
  }
};
exports.setPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;
    if (!token || !password || !confirmPassword)
      return res.status(400).json({ error: 'All fields are required.' });
    if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match.' });

    // Validate password like your ResetPasswordPage
    const errors = [];
    if (password.length < 8) errors.push("At least 8 characters");
    if (!/[A-Z]/.test(password)) errors.push("At least one uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("At least one lowercase letter");
    if (!/\d/.test(password)) errors.push("At least one number");
    if (!/[\W_]/.test(password)) errors.push("At least one special character");
    if (errors.length) return res.status(400).json({ error: 'Password invalid', details: errors });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const student_id = decoded.student_id;

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute('UPDATE students SET password = ?, is_approved = 1 WHERE student_id = ?', [hashedPassword, student_id]);

    // Delete the verification code
    delete verificationCodes[student_id];

    res.json({ message: 'Password set successfully. Account now active.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during password setup.' });
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

