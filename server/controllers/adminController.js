const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const db = require("../db");
const dayjs = require("dayjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { sendNotification } = require("../helpers/notificationHelper");
const { fetchAllStudents } = require("../helpers/studentHelpers");
const sgMail = require('@sendgrid/mail');
require("dotenv").config();


/* -------------------------------------------------------------------------- */
/*                             🧠 AUTHENTICATION + 2FA                         */
/* -------------------------------------------------------------------------- */

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// --------------------
// Step 1: Login → send 2FA code
// --------------------
exports.login = async (req, res) => {
  try {
    const { id, password } = req.body;

    const [rows] = await db.execute(
      "SELECT * FROM admin WHERE admin_id = ?",
      [id]
    );

    if (!rows.length) return res.status(401).json({ error: "Invalid credentials" });

    const admin = rows[0];

    const isMatch = await bcrypt.compare(password, admin.admin_pass);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    // 🔥 If 2FA DISABLED → Direct login
    if (admin.is_2fa_enabled === 0) {
      const token = jwt.sign(
        { admin_id: admin.admin_id, admin_user: admin.admin_user },
        process.env.JWT_SECRET,
        { expiresIn: "12h" }
      );

      return res.json({
        message: "Login successful (2FA disabled)",
        token,
        admin: { id: admin.admin_id, username: admin.admin_user },
      });
    }

    // 🔐 If 2FA ENABLED → Generate code
    const code = crypto.randomInt(100000, 999999).toString();

    await db.execute(
      "UPDATE admin SET two_fa_code = ?, two_fa_expires = DATE_ADD(UTC_TIMESTAMP(), INTERVAL 5 MINUTE) WHERE admin_id = ?",
      [code, admin.admin_id]
    );

    const msg = {
      to: admin.email,
      from: process.env.EMAIL_FROM,
      subject: "🔐 Admin 2FA Code - Online Enrollment",
      html: `<h2>Your Login Verification Code</h2><h1>${code}</h1><p>This code expires in 5 minutes.</p>`
    };

    await sgMail.send(msg);

    res.json({
      require2FA: true,
      message: "A verification code has been sent to your email",
      admin_id: admin.admin_id,
    });

  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ error: "Failed to login" });
  }
};


// --------------------
// Step 2: Verify 2FA
// --------------------
exports.verify2FA = async (req, res) => {
  try {
    const { admin_id, code } = req.body;

    if (!admin_id || !code)
      return res.status(400).json({ error: "Admin ID and code are required" });

    const [rows] = await db.execute(
      "SELECT * FROM admin WHERE admin_id = ? AND TRIM(two_fa_code) = ? AND two_fa_expires > UTC_TIMESTAMP()",
      [admin_id, code]
    );

    if (!rows.length)
      return res.status(401).json({ error: "Invalid or expired 2FA code" });

    const admin = rows[0];

    // Clear used 2FA
    await db.execute(
      "UPDATE admin SET two_fa_code = NULL, two_fa_expires = NULL WHERE admin_id = ?",
      [admin_id]
    );

    // Issue JWT
    const token = jwt.sign(
      { admin_id: admin.admin_id, admin_user: admin.admin_user },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.json({
      message: "2FA verified successfully",
      token,
      admin: { id: admin.admin_id, username: admin.admin_user }
    });
  } catch (err) {
    console.error("verify2FA error:", err);
    res.status(500).json({ error: "Failed to verify 2FA" });
  }
};

// --------------------
// Resend 2FA
// --------------------
exports.resend2FA = async (req, res) => {
  try {
    const { admin_id } = req.body;
    if (!admin_id) return res.status(400).json({ error: "Admin ID required" });

    // 1️⃣ Fetch admin
    const [rows] = await db.execute("SELECT * FROM admin WHERE admin_id = ?", [admin_id]);
    if (!rows.length) return res.status(404).json({ error: "Admin not found" });

    const admin = rows[0];

    // 2️⃣ Generate new 2FA code (6-digit)
    const code = crypto.randomInt(100000, 999999).toString();

    // 3️⃣ Save code & expiry (5 minutes)
    await db.execute(
      "UPDATE admin SET two_fa_code = ?, two_fa_expires = DATE_ADD(UTC_TIMESTAMP(), INTERVAL 5 MINUTE) WHERE admin_id = ?",
      [code, admin_id]
    );

    // 4️⃣ Send 2FA code via SendGrid
    const msg = {
      to: admin.email,
      from: process.env.EMAIL_FROM, // must be verified in SendGrid
      subject: "🔁 CTU Enrollment 2FA Code (Resent)",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2>Hello ${admin.admin_user}</h2>
          <p>Your new 2FA verification code is:</p>
          <h1 style="color: #1a73e8;">${code}</h1>
          <p>This code is valid for 5 minutes. Do not share it with anyone.</p>
          <hr/>
          <p style="font-size: 12px; color: #999;">CTU Enrollment &copy; ${new Date().getFullYear()}</p>
        </div>
      `
    };

    // Await sending email so we can catch errors
    await sgMail.send(msg);

    res.json({ message: "2FA code resent successfully" });

  } catch (err) {
    console.error("resend2FA error:", err.response?.body || err);
    res.status(500).json({ error: "Failed to resend 2FA code" });
  }
};

exports.updateTwoFAStatus = async (req, res) => {
  try {
    const { admin_id, is_2fa_enabled } = req.body;

    // Validate input
    if (admin_id === undefined || is_2fa_enabled === undefined) {
      return res.status(400).json({ error: "admin_id and is_2fa_enabled are required" });
    }

    await db.execute(
      "UPDATE admin SET is_2fa_enabled = ? WHERE admin_id = ?",
      [is_2fa_enabled ? 1 : 0, admin_id]
    );

    res.json({ message: `2FA ${is_2fa_enabled ? "Enabled" : "Disabled"} successfully` });
  } catch (err) {
    console.error("Update 2FA status error:", err);
    res.status(500).json({ error: "Failed to update 2FA setting" });
  }
};


exports.updateAdminAccount = async (req, res) => {
  try {
    const { admin_id, admin_user, new_password } = req.body;

    // Validate input
    if (!admin_id || !admin_user) {
      return res.status(400).json({ error: "admin_id and admin_user are required" });
    }

    let sql = `UPDATE admin SET admin_user = ?`;
    const values = [admin_user];

    if (new_password && new_password.trim() !== "") {
      const hashedPass = await bcrypt.hash(new_password, 10);
      sql += `, admin_pass = ?`;
      values.push(hashedPass);
    }

    sql += ` WHERE admin_id = ?`;
    values.push(admin_id);

    await db.execute(sql, values);

    res.json({ message: "Admin account updated successfully" });
  } catch (err) {
    console.error("Update admin account error:", err);
    res.status(500).json({ error: "Failed to update admin account" });
  }
};

exports.getAdminInfo = async (req, res) => {
  try {
    const { admin_id } = req.params;

    if (!admin_id) return res.status(400).json({ error: "Admin ID is required" });

    const [rows] = await db.execute(
      "SELECT admin_id, admin_user, is_2fa_enabled FROM admin WHERE admin_id = ?",
      [admin_id]
    );

    if (rows.length === 0) return res.status(404).json({ error: "Admin not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error("Get admin info error:", err);
    res.status(500).json({ error: "Failed to fetch admin info" });
  }
};


/* -------------------------------------------------------------------------- */
/*                             🎓 STUDENT HANDLERS                            */
/* -------------------------------------------------------------------------- */

exports.getAllStudents = async (req, res) => {
  try {
    const { academic_year, semester } = req.query;

    // Use the correct function
    const students = await fetchAllStudents(academic_year, semester);

    res.json(Array.isArray(students) ? students : []);
  } catch (err) {
    console.error("getAllStudents error:", err);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};


exports.getStudentSubjects = async (req, res) => {
  const { student_id } = req.params;
  const { academic_year, semester } = req.query; // 🔹 Expect from FE

  try {
    // 1️⃣ Require AY + Semester
    if (!academic_year || !semester) {
      return res.status(400).json({
        error: "academic_year and semester are required",
      });
    }

    // 2️⃣ Fetch specific enrollment
    const [enrollmentRows] = await db.execute(
      `
      SELECT *
      FROM enrollments
      WHERE student_id = ?
        AND academic_year = ?
        AND semester = ?
      ORDER BY enrollment_id DESC
      LIMIT 1
      `,
      [student_id, academic_year, semester]
    );

    if (enrollmentRows.length === 0) {
      return res.status(404).json({
        message: "No enrollment found for this student in the specified semester.",
      });
    }

    const enrollment = enrollmentRows[0];

    // 3️⃣ Fetch subjects from enrollment_subjects
    const [subjects] = await db.execute(
      `
      SELECT
        s.subject_code,
        s.subject_desc,
        s.units,
        es.subject_section
      FROM enrollment_subjects es
      JOIN subjects s ON es.subject_section = s.subject_section
      WHERE es.enrollment_id = ?
      `,
      [enrollment.enrollment_id]
    );

    res.json({
      academic_year: enrollment.academic_year,
      semester: enrollment.semester,
      status: enrollment.status,
      faculty_id: enrollment.faculty_id,
      enrollment_id: enrollment.enrollment_id,
      subjects,
    });
  } catch (error) {
    console.error("❌ Error fetching student subjects:", error);
    res.status(500).json({ error: "Failed to fetch student subjects" });
  }
};

/* -------------------------------------------------------------------------- */
/*                              ✅ APPROVAL FLOW                              */
/* -------------------------------------------------------------------------- */

exports.approveStudent = async (req, res) => {
	const { student_id } = req.params;
	const { academic_year, semester } = req.body;
	const adminId = req.admin?.admin_id || null;

	if (!academic_year || !semester)
		return res.status(400).json({ error: "Academic year and semester required" });

	try {
		await db.execute("UPDATE students SET is_approved = 1 WHERE student_id = ?", [student_id]);

		const [existing] = await db.execute(
			`SELECT enrollment_id FROM enrollments
			 WHERE student_id = ? AND academic_year = ? AND semester = ? LIMIT 1`,
			[student_id, academic_year, semester]
		);

		if (existing.length) {
			await db.execute(
				"UPDATE enrollments SET enrollment_status = 0 WHERE enrollment_id = ?",
				[existing[0].enrollment_id]
			);
		} else {
			await db.execute(
				"INSERT INTO enrollments (student_id, enrollment_status, academic_year, semester) VALUES (?, 0, ?, ?)",
				[student_id, academic_year, semester]
			);
		}

		const [[student]] = await db.execute(
			"SELECT email, first_name FROM students WHERE student_id = ?",
			[student_id]
		);

		await sendNotification({
			user_type: "student",
			user_id: student_id,
			title: "Enrollment Approved",
			message: `Hello ${student.first_name}, your enrollment has been approved. Please proceed to enroll.`,
			type: "enrollment",
			link: "/enroll",
			sender_id: adminId,
			email: student.email,
		});

		res.json({ message: "Student approved and notified successfully." });
	} catch (err) {
		console.error("approveStudent error:", err);
		res.status(500).json({ error: "Failed to approve student" });
	}
};

/* -------------------------------------------------------------------------- */
/*                          ✅ ENROLLMENT MANAGEMENT                          */
/* -------------------------------------------------------------------------- */

exports.confirmEnrollment = async (req, res) => {
    const { enrollment_id } = req.params;

    try {
        // Update enrollment status to 3
        await db.execute(
            "UPDATE enrollments SET enrollment_status = 3 WHERE enrollment_id = ?",
            [enrollment_id]
        );

        // Get student info
        const [[row]] = await db.execute(
            `SELECT s.email, s.student_id
             FROM enrollments e
             JOIN students s ON s.student_id = e.student_id
             WHERE e.enrollment_id = ?`,
            [enrollment_id]
        );

        // Mark student as enrolled
        await db.execute("UPDATE students SET is_enrolled = 1 WHERE student_id = ?", [
            row.student_id,
        ]);

        // Send notification
        await sendNotification({
            user_type: "student",
            user_id: row.student_id,
            title: "Enrollment Confirmed",
            message: "Your enrollment request has been confirmed.",
            type: "enrollment",
            link: "/enrollment",
            email: row.email,
        });

        res.json({ message: "Enrollment confirmed successfully." });
    } catch (err) {
        console.error("confirmEnrollment error:", err);
        res.status(500).json({ error: "Failed to confirm enrollment" });
    }
};

exports.revokeEnrollment = async (req, res) => {
    const { enrollment_id } = req.params;

    try {
        // Revoke enrollment status to 1
        await db.execute(
            "UPDATE enrollments SET enrollment_status = 1 WHERE enrollment_id = ?",
            [enrollment_id]
        );

        // Delete all subjects linked to this enrollment
        await db.execute(
            "DELETE FROM enrollment_subjects WHERE enrollment_id = ?",
            [enrollment_id]
        );

        // Get student info
        const [[row]] = await db.execute(
            `SELECT s.email, s.student_id
             FROM enrollments e
             JOIN students s ON s.student_id = e.student_id
             WHERE e.enrollment_id = ?`,
            [enrollment_id]
        );

        // Mark student as not enrolled
        await db.execute("UPDATE students SET is_enrolled = 0 WHERE student_id = ?", [
            row.student_id,
        ]);

        // Send notification
        await sendNotification({
            user_type: "student",
            user_id: row.student_id,
            title: "Enrollment Revoked",
            message: "Your enrollment has been revoked by the administrator.",
            type: "enrollment",
            link: "/enrollment",
            email: row.email,
        });

        res.json({ message: "Enrollment revoked successfully." });
    } catch (err) {
        console.error("revokeEnrollment error:", err);
        res.status(500).json({ error: "Failed to revoke enrollment" });
    }
};

/* -------------------------------------------------------------------------- */
/*                            ⚙️ STUDENT MANAGEMENT                           */
/* -------------------------------------------------------------------------- */

// Add a new student
exports.addStudent = async (req, res) => {
  try {
    const {
      first_name,
      middle_name,
      last_name,
      email,
      year_level,
      student_status,
      program_id,
      student_id, // optional
    } = req.body;

    // Convert numeric values
    const programIdNum = Number(program_id);

    // If student_id was provided, convert to number. If empty/null, leave it undefined → AUTO INCREMENT
    const studentIdNum = student_id ? Number(student_id) : undefined;

    const defaultPassword =
      "$2b$10$x279Jjm2PXHksVoNCsXkuugo8FNtvLaFXz9unnkb8XCkFcOMbjBle";

    // Insert student (student_id = NULL → triggers AUTO INCREMENT)
    const [result] = await db.execute(
      `
      INSERT INTO students
        (student_id, first_name, middle_name, last_name, email, year_level, student_status, program_id, password)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        studentIdNum ?? null, // null = auto increment
        first_name,
        middle_name || null,
        last_name,
        email,
        year_level,
        student_status,
        programIdNum,
        defaultPassword,
      ]
    );

    // Determine final student_id (either provided or auto-generated)
    const finalStudentId = studentIdNum ?? result.insertId;

    // Fetch inserted student
    const [rows] = await db.execute(
      `
      SELECT s.*, p.program_code
      FROM students s
      LEFT JOIN programs p ON s.program_id = p.program_id
      WHERE s.student_id = ?
      `,
      [finalStudentId]
    );

    res.json({
      message: "Student added successfully",
      student: rows[0],
    });
  } catch (err) {
    console.error("addStudent error:", err);
    res.status(500).json({ error: "Failed to add student" });
  }
};

// Update an existing student
exports.updateStudent = async (req, res) => {
  try {
    const { student_id } = req.params;
    const {
      first_name,
      middle_name,
      last_name,
      email,
      year_level,
      section,        // <-- added section
      student_status,
      program_id,
    } = req.body;

    const studentIdNum = Number(student_id);
    const programIdNum = Number(program_id);

    const [result] = await db.execute(
      `UPDATE students
       SET first_name=?, middle_name=?, last_name=?, email=?, year_level=?, section=?, student_status=?, program_id=?
       WHERE student_id=?`,
      [first_name, middle_name || null, last_name, email, year_level, section, student_status, programIdNum, studentIdNum]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Return updated student
    const [rows] = await db.execute(
      `SELECT s.*, p.program_code
       FROM students s
       LEFT JOIN programs p ON s.program_id = p.program_id
       WHERE s.student_id = ?`,
      [studentIdNum]
    );

    res.json({ message: "Student updated successfully", student: rows[0] });
  } catch (err) {
    console.error("updateStudent error:", err);
    res.status(500).json({ error: "Failed to update student" });
  }
};


// Delete a student
exports.deleteStudent = async (req, res) => {
  try {
    const { student_id } = req.params;
    const studentIdNum = Number(student_id);

    const [result] = await db.execute(
      "DELETE FROM students WHERE student_id = ?",
      [studentIdNum]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("deleteStudent error:", err);
    res.status(500).json({ error: "Failed to delete student" });
  }
};





