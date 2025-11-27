// helpers/studentHelpers.js
const db = require("../db");

// 🔹 Fetch all students with optional filters + correct academic year & semester
exports.fetchStudents = async (options = {}, academic_year = null, semester = null) => {
    const {
        onlyEnrolled = false,
        onlyApproved = false,
        onlyPending = false,
        includeProgram = true
    } = options;

    let query = `
        SELECT
            s.student_id,
            s.first_name,
            s.middle_name,
            s.last_name,
            s.email,
            s.year_level,
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
        ${includeProgram ? `LEFT JOIN programs p ON s.program_id = p.program_id` : ''}

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

        WHERE 1=1
    `;

    if (onlyEnrolled) query += ` AND s.is_enrolled = 1`;
    if (onlyApproved) query += ` AND s.is_approved = 1`;
    if (onlyPending) query += ` AND s.is_approved = 0`;

    query += ` ORDER BY s.last_name, s.first_name`;

    const [rows] = await db.execute(query);
    return rows;
};


// 🔹 Fetch enrolled students only
exports.fetchEnrolledStudents = async () => {
    const [rows] = await db.execute(`
        SELECT
            s.student_id,
            s.first_name,
            s.middle_name,
            s.last_name,
            s.email,
            s.profile_picture,
            s.year_level,
            s.section,
            s.student_status,
            s.is_enrolled,
            s.is_approved,
            p.program_code,
            p.program_name,
            e.enrollment_id,
            e.academic_year,
            e.semester,
            e.enrollment_status
        FROM enrollments e
        JOIN students s ON e.student_id = s.student_id
        JOIN programs p ON s.program_id = p.program_id
        WHERE e.enrollment_status = 2
    `);

    return rows;
};
