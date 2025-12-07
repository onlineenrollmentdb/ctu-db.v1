// controllers/programsController.js
const db = require("../db");

/* -------------------------------------------------------------------------- */
/*                      🏫 DEPARTMENTS + PROGRAMS HANDLERS                    */
/* -------------------------------------------------------------------------- */

// ✅ Get all departments and their programs
exports.getDepartmentsWithPrograms = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT
                d.department_id,
                d.department_code,
                d.department_name,
                p.program_id,
                p.program_code,
                p.program_name
            FROM departments d
            LEFT JOIN programs p ON d.department_id = p.department_id
            ORDER BY d.department_name, p.program_name
        `);

        // Group programs under departments
        const departments = rows.reduce((acc, row) => {
            let dept = acc.find(d => d.department_id === row.department_id);
            if (!dept) {
                dept = {
                    department_id: row.department_id,
                    department_code: row.department_code,
                    department_name: row.department_name,
                    programs: []
                };
                acc.push(dept);
            }

            if (row.program_id) {
                dept.programs.push({
                    program_id: row.program_id,
                    program_code: row.program_code,
                    program_name: row.program_name
                });
            }

            return acc;
        }, []);

        res.json(departments);
    } catch (error) {
        console.error("Get departments with programs error:", error);
        res.status(500).json({ error: "Failed to fetch departments and programs" });
    }
};

// ✅ Get all programs (flat list)
exports.getPrograms = async (req, res) => {
    try {
        const [programs] = await db.execute(`
            SELECT program_id, program_code, program_name, department_id
            FROM programs
            ORDER BY program_name
        `);

        res.json(programs);
    } catch (error) {
        console.error("Get programs error:", error);
        res.status(500).json({ error: "Failed to fetch programs" });
    }
};

// ✅ Get all departments (without programs)
exports.getDepartments = async (req, res) => {
    try {
        const [departments] = await db.execute(`
            SELECT department_id, department_code, department_name
            FROM departments
            ORDER BY department_name
        `);

        res.json(departments);
    } catch (error) {
        console.error("Get departments error:", error);
        res.status(500).json({ error: "Failed to fetch departments" });
    }
};
// ✅ Add a new Program
exports.addProgram = async (req, res) => {
    try {
        const { program_code, program_name, department_id } = req.body;

        if (!program_code || !program_name || !department_id) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const [duplicate] = await db.execute(
            `SELECT program_id FROM programs WHERE program_code = ?`,
            [program_code]
        );

        if (duplicate.length > 0) {
            return res.status(400).json({ error: "Program code already exists." });
        }

        await db.execute(
            `INSERT INTO programs (program_code, program_name, department_id) VALUES (?, ?, ?)`,
            [program_code, program_name, department_id]
        );

        res.json({ message: "Program added successfully" });
    } catch (error) {
        console.error("Add program error:", error);
        res.status(500).json({ error: "Failed to add program" });
    }
};

// --------------------
// Get max section for a given program and year
// --------------------
exports.getMaxSection = async (req, res) => {
  const { program_code, year_level } = req.params;

  try {
    const [rows] = await db.execute(
      `SELECT MAX(CAST(section AS UNSIGNED)) AS max_section
       FROM students
       WHERE program_code = ? AND year_level = ?`,
      [program_code, year_level]
    );

    if (rows.length === 0 || !rows[0].max_section) {
      return res.json({ max_section: 1 }); // fallback to 1
    }

    res.json({ max_section: rows[0].max_section });
  } catch (err) {
    console.error("Error fetching max section:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
