const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

router.get('/profile', authenticateToken, studentController.getProfile);
router.put('/profile', authenticateToken, studentController.updateProfile);
router.post('/cgpa', authenticateToken, studentController.addSemesterCgpa);
router.get('/', authenticateToken, authorizeRoles('coordinator', 'admin'), studentController.getAllStudents);

module.exports = router;
