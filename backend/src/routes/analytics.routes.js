const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

router.get('/overall', authenticateToken, authorizeRoles('coordinator', 'admin'), analyticsController.getOverallStats);
router.get('/company', authenticateToken, authorizeRoles('coordinator', 'admin'), analyticsController.getCompanyStats);

module.exports = router;
