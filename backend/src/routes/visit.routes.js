const express = require('express');
const router = express.Router();
const visitController = require('../controllers/visit.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.get('/', authenticateToken, visitController.getAllVisits);
router.post('/', authenticateToken, visitController.scheduleVisit);

module.exports = router;
