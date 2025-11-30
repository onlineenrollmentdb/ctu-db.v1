const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// --------------------
// 🔐 Admin Authentication + 2FA
// --------------------
router.post("/login", adminController.login);
router.post("/verify-2fa", adminController.verify2FA);
router.post("/resend-2fa", adminController.resend2FA);

// --------------------
// 🎓 Student Management
// --------------------
router.get("/students", adminController.getAllStudents);
router.get("/students/approved", adminController.getApprovedStudents);
router.get("/students/pending", adminController.getPendingStudents);
router.get("/students/:student_id/subjects", adminController.getStudentSubjects);
router.post("/students", adminController.addStudent); // ADD student
router.put("/students/:student_id", adminController.updateStudent);
router.delete("/students/:student_id", adminController.deleteStudent);

// --------------------
// ✅ Approval & Enrollment Flow
// --------------------
router.patch("/students/:student_id/approve", adminController.approveStudent);
router.get("/students/enrolled", adminController.getEnrolledStudents);
router.put("/enrollment/:enrollment_id/confirm", adminController.confirmEnrollment);
router.put("/enrollment/:enrollment_id/revoke", adminController.revokeEnrollment);

// --------------------
// 📦 CSV Export & Bulk Update
// --------------------
router.get("/enrollments/export", adminController.exportEnrolledStudentsCSV);
module.exports = router;
