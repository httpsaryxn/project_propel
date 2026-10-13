const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

router.get('/', authenticateToken, companyController.getAllCompanies);
router.get('/:id', authenticateToken, companyController.getCompanyById);
router.post('/', authenticateToken, authorizeRoles('coordinator', 'admin'), companyController.createCompany);
router.put('/:id', authenticateToken, authorizeRoles('coordinator', 'admin'), companyController.updateCompany);
router.delete('/:id', authenticateToken, authorizeRoles('coordinator', 'admin'), companyController.deleteCompany);

module.exports = router;
