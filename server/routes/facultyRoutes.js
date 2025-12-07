const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');

// CRUD
router.get('/', facultyController.getAllFaculty);
router.post('/', facultyController.createFaculty);
router.put('/:id', facultyController.updateFaculty);
router.delete('/:id', facultyController.deleteFaculty);

// Login
router.post('/login', facultyController.loginFaculty);

router.get('/:id/subjects', facultyController.getFacultySubjects);
router.put('/:id/subjects', facultyController.updateFacultySubjects);

module.exports = router;
