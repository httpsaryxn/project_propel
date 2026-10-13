const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

router.get('/eligible', authenticateToken, authorizeRoles('student'), applicationController.getEligibleCompanies);
router.post('/apply', authenticateToken, authorizeRoles('student'), applicationController.applyForCompany);
router.get('/my', authenticateToken, authorizeRoles('student'), applicationController.getMyApplications);
router.get('/company/:companyId', authenticateToken, authorizeRoles('coordinator', 'admin'), applicationController.getCompanyApplications);
router.patch('/:id/status', authenticateToken, authorizeRoles('coordinator', 'admin'), applicationController.updateStatus);
router.post('/bulk-status', authenticateToken, authorizeRoles('coordinator', 'admin'), applicationController.bulkUpdateStatus);

module.exports = router;
