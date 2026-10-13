const express = require('express');
const router = express.Router();
const resultController = require('../controllers/result.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

router.get('/my', authenticateToken, authorizeRoles('student'), resultController.getMyResults);
router.get('/company/:companyId', authenticateToken, authorizeRoles('coordinator', 'admin'), resultController.getCompanyResults);
router.post('/upload', authenticateToken, authorizeRoles('coordinator', 'admin'), resultController.uploadResults);

module.exports = router;
