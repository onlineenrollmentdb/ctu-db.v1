// routes/programsRoutes.js
const express = require("express");
const router = express.Router();
const programsController = require("../controllers/programsController");

// --------------------
// 🏫 Departments + Programs
// --------------------
router.get("/", programsController.getPrograms);
router.post("/add", programsController.addProgram);

router.get("/departments", programsController.getDepartments);
router.get("/departments-programs", programsController.getDepartmentsWithPrograms);
router.get("/departments/:program_code/:year_level/max-section", programsController.getMaxSection);

module.exports = router;
