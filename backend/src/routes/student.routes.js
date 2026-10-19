const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const studentController = require('../controllers/student.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

// Configure Multer for Resume Uploads (memoryStorage for Supabase Cloud & Local storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only .pdf, .doc, and .docx formats are permitted'));
    }
  }
});

router.get('/profile', authenticateToken, studentController.getProfile);
router.put('/profile', authenticateToken, studentController.updateProfile);
router.put('/academic-criteria', authenticateToken, studentController.updateAcademicCriteria);
router.post('/upload-resume', authenticateToken, upload.single('resume'), studentController.uploadResume);
router.post('/cgpa', authenticateToken, studentController.addSemesterCgpa);
router.get('/', authenticateToken, authorizeRoles('coordinator', 'admin'), studentController.getAllStudents);

module.exports = router;
