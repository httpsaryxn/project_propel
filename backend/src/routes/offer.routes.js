const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offer.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

router.get('/my', authenticateToken, authorizeRoles('student'), offerController.getMyOffers);
router.post('/respond', authenticateToken, authorizeRoles('student'), offerController.respondToOffer);

module.exports = router;
