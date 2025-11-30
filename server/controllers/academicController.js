const db = require('../db');

// 🔹 Get Academic History with Subject Info
exports.getAcademicHistory = async (req, res) => {
  const { studentId } = req.params;

  if (!studentId) {
    return res.status(400).json({ error: "student_id is required" });
  }

  try {
    const [rows] = await db.execute(
      `
      SELECT
        ah.history_id,
        ah.student_id,
        ah.subject_section,
        ah.semester,
        ah.academic_year,
        ah.grade,
        ah.status,
        s.subject_code,
        s.subject_desc,
        s.units,
        s.lec_hours,
        s.lab_hours,
        s.year_level,
        s.program_id,
        p.prerequisites
      FROM academic_history ah
      LEFT JOIN subjects s ON ah.subject_section = s.subject_section
      LEFT JOIN (
        SELECT pr.subject_code,
               GROUP_CONCAT(DISTINCT
                 CASE
                   WHEN pr.year_standing_level IS NOT NULL THEN CONCAT(pr.year_standing_level, '_YEAR_STANDING')
                   ELSE sp.subject_code
                 END
                 ORDER BY pr.type, pr.prereq_subject_code
                 SEPARATOR ','
               ) AS prerequisites
        FROM prerequisites pr
        LEFT JOIN subjects sp ON pr.prereq_subject_code = sp.subject_code
        GROUP BY pr.subject_code
      ) p ON s.subject_code = p.subject_code
      WHERE ah.student_id = ?
      ORDER BY s.year_level, ah.semester, s.subject_code
      `,
      [studentId]
    );

    const formatted = rows.map(row => ({
      ...row,
      prerequisites: row.prerequisites
        ? row.prerequisites.split(',').map(p => {
            if (p.includes('_YEAR_STANDING')) {
              const level = Number(p.split('_')[0]);
              const suffix = ['st', 'nd', 'rd', 'th'];
              return { type: 'Pre', code: `${level}${suffix[level - 1]} Year Standing`, year_standing_level: level };
            }
            return { type: 'Pre', code: p, year_standing_level: null };
          })
        : []
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("❌ Error fetching academic history:", err);
    res.status(500).json({ error: "Failed to fetch academic history" });
  }
};



// 🔹 Helper: Map total credits to year level
const getYearLevel = (totalCredits) => {
    if (totalCredits >= 0 && totalCredits < 30) return 1;
    if (totalCredits >= 30 && totalCredits < 60) return 2;
    if (totalCredits >= 60 && totalCredits < 90) return 3;
    if (totalCredits >= 90) return 4;
};


// 🔹 Update all students (used for end-of-semester batch)
exports.updateAllStudentYearLevels = async () => {
    try {
        const [students] = await db.execute(`
            SELECT s.student_id, s.year_level, COALESCE(SUM(e.total_units),0) AS total_credits
            FROM students s
            LEFT JOIN enrollments e ON s.student_id = e.student_id AND e.enrollment_status = 2
            GROUP BY s.student_id, s.year_level
        `);

        const updates = students
            .map(s => {
                const newLevel = getYearLevel(s.total_credits);
                if (newLevel !== s.year_level) {
                    return db.execute(`UPDATE students SET year_level = ? WHERE student_id = ?`, [newLevel, s.student_id]);
                }
                return null;
            })
            .filter(Boolean);

        await Promise.all(updates);
        console.log(`✅ Updated ${updates.length} student(s) year levels.`);
    } catch (err) {
        console.error("Failed to update all student year levels:", err);
    }
};

// 🔹 Helper: Check if two dates are same day or next day
const isSameOrNextDay = (date1, date2) => {
    const diff = (new Date(date1) - new Date(date2)) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff < 2;
};

// 🔹 Auto trigger year-level update at semester end
exports.checkAndUpdateYearLevels = async () => {
    try {
        const [settingsRows] = await db.execute(`SELECT * FROM settings ORDER BY setting_id DESC LIMIT 1`);
        if (!settingsRows.length) return;

        const settings = settingsRows[0];
        const now = new Date();

        const firstSemEnd = new Date(settings.first_sem_end);
        const secondSemEnd = new Date(settings.second_sem_end);
        const summerEnd = new Date(settings.summer_end);

        if (isSameOrNextDay(now, firstSemEnd) || isSameOrNextDay(now, secondSemEnd) || isSameOrNextDay(now, summerEnd)) {
            console.log("Semester ended. Updating student year levels...");
            await exports.updateAllStudentYearLevels();
        }
    } catch (err) {
        console.error("Error checking semester end:", err);
    }
};
