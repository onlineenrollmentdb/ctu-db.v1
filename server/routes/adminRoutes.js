const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");


// --------------------
// 🔐 Admin Authentication + 2FA
// --------------------
router.post("/login", adminController.login);
router.post("/verify-2fa", adminController.verify2FA);
router.post("/resend-2fa", adminController.resend2FA);
router.put("/twofa/update",adminController.updateTwoFAStatus);
router.put("/account/update", adminController.updateAdminAccount);


// --------------------
// 🎓 Student Management
// --------------------
router.get("/students", adminController.getAllStudents);
router.get("/students/:student_id/subjects", adminController.getStudentSubjects);
router.post("/students", adminController.addStudent); // ADD student
router.put("/students/:student_id", adminController.updateStudent);
router.delete("/students/:student_id", adminController.deleteStudent);

// --------------------
// ✅ Approval & Enrollment Flow
// --------------------
router.patch("/students/:student_id/approve", adminController.approveStudent);
router.put("/enrollment/:enrollment_id/confirm", adminController.confirmEnrollment);
router.put("/enrollment/:enrollment_id/revoke", adminController.revokeEnrollment);
module.exports = router;


router.get("/:admin_id", adminController.getAdminInfo);