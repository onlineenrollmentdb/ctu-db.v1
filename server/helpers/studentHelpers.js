const db = require("../db");

exports.fetchAllStudents = async (academic_year = null, semester = null, includeProgram = true) => {
    const query = `
        SELECT
            s.student_id,
            s.first_name,
            s.middle_name,
            s.last_name,
            s.email,
            s.year_level,
            s.section,
            s.student_status,
            s.is_enrolled,
            s.is_approved,
            ${includeProgram ? `
            p.program_id,
            p.program_code,
            p.program_name,` : ''}
            e.enrollment_id,
            e.academic_year,
            e.semester,
            e.enrollment_status
        FROM students s
        ${includeProgram ? 'LEFT JOIN programs p ON s.program_id = p.program_id' : ''}
        LEFT JOIN (
            SELECT e1.*
            FROM enrollments e1
            INNER JOIN (
                SELECT student_id, MAX(enrollment_id) AS latest_enrollment_id
                FROM enrollments
                WHERE 1=1
                ${academic_year ? `AND academic_year = '${academic_year}'` : ''}
                ${semester ? `AND semester = '${semester}'` : ''}
                GROUP BY student_id
            ) latest ON e1.student_id = latest.student_id AND e1.enrollment_id = latest.latest_enrollment_id
        ) e ON e.student_id = s.student_id
        ORDER BY s.last_name, s.first_name
    `;

    const [rows] = await db.execute(query);
    return rows;
};

