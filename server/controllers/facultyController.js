const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '12h';

exports.getAllFaculty = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT f.*, d.department_name
      FROM faculties f
      LEFT JOIN departments d ON f.department_id = d.department_id
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching faculty:", error);
    res.status(500).json({ message: 'Error fetching faculty' });
  }
};


exports.createFaculty = async (req, res) => {
  try {
    const { first_name, last_name, email, department_id, role, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // check duplicate email
    const [existing] = await db.execute(
      "SELECT faculty_id FROM faculties WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      `INSERT INTO faculties (first_name, last_name, email, department_id, role, password)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, email, department_id || null, role || "grader", hashedPassword]
    );

    res.json({
      message: "Faculty created successfully",
      faculty_id: result.insertId
    });

  } catch (error) {
    console.error("Error creating faculty:", error);
    res.status(500).json({ error: "Failed to create faculty" });
  }
};

exports.updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, department_id, role, password } = req.body;

    let sql = `
      UPDATE faculties
      SET first_name=?, last_name=?, email=?, department_id=?, role=?
    `;
    const params = [first_name, last_name, email, department_id || null, role];

    // if password is included → update it
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      sql += `, password=?`;
      params.push(hashedPassword);
    }

    sql += ` WHERE faculty_id=?`;
    params.push(id);

    await db.execute(sql, params);

    res.json({ message: "Faculty updated successfully" });

  } catch (error) {
    console.error("Error updating faculty:", error);
    res.status(500).json({ error: "Failed to update faculty" });
  }
};

exports.deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute("DELETE FROM faculties WHERE faculty_id = ?", [id]);

    res.json({ message: "Faculty deleted successfully" });

  } catch (error) {
    console.error("Error deleting faculty:", error);
    res.status(500).json({ error: "Failed to delete faculty" });
  }
};


exports.loginFaculty = async (req, res) => {
  try {
    const { id, password } = req.body;

    // ✅ Fix: check id and password, NOT IDBFactory
    if (!id || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const [rows] = await db.execute(
      'SELECT * FROM faculties WHERE faculty_id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const faculty = rows[0];

    const match = await bcrypt.compare(password, faculty.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { faculty_id: faculty.faculty_id, email: faculty.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const { password: _, ...facultyData } = faculty;

    res.json({
      message: "Login successful",
      user: facultyData,
      token
    });

  } catch (err) {
    console.error("Faculty login error:", err);
    res.status(500).json({ error: "Failed to login" });
  }
};



// Get all subjects assigned to a faculty (with full subject details)
exports.getFacultySubjects = async (req, res) => {
  try {
    const { id } = req.params;

    // Join faculty_subjects with subjects table to get full details
    const [rows] = await db.execute(
      `SELECT fs.faculty_subject_id,
              fs.faculty_id,
              fs.subject_code,
              fs.year_level,
              fs.section,
              fs.academic_year,
              fs.semester,
              s.subject_section,
              s.subject_desc,
              s.units
       FROM faculty_subjects fs
       LEFT JOIN subjects s ON fs.subject_code = s.subject_code
       WHERE fs.faculty_id = ?`,
      [id]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching faculty subjects:", err);
    res.status(500).json({ error: "Failed to fetch faculty subjects" });
  }
};


// Assign subjects to a faculty
exports.updateFacultySubjects = async (req, res) => {
  try {
    const { id } = req.params;
    const { subjects } = req.body; // array of { subject_code, year_level, section, academic_year, semester }

    if (!Array.isArray(subjects)) {
      return res.status(400).json({ error: "Invalid subjects array" });
    }

    // Remove existing assignments
    await db.execute("DELETE FROM faculty_subjects WHERE faculty_id = ?", [id]);

    // Insert new assignments
    if (subjects.length > 0) {
      // Build placeholders dynamically for all rows
      const placeholders = subjects.map(() => "(?, ?, ?, ?, ?, ?)").join(", ");
      // Flatten values: [faculty_id, subject_code, year_level, section, academic_year, semester, ...]
      const values = subjects.flatMap((s) => [
        id,
        s.subject_code,
        s.year_level,
        s.section || null,
        s.academic_year || null,
        s.semester || null,
      ]);

      const sql = `INSERT INTO faculty_subjects (faculty_id, subject_code, year_level, section, academic_year, semester) VALUES ${placeholders}`;
      await db.execute(sql, values);
    }

    res.json({ message: "Faculty subjects updated successfully" });
  } catch (err) {
    console.error("Error updating faculty subjects:", err);
    res.status(500).json({ error: "Failed to update faculty subjects" });
  }
};


