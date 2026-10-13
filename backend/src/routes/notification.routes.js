const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.get('/my', authenticateToken, notificationController.getMyNotifications);
router.post('/send', authenticateToken, notificationController.sendNotification);

module.exports = router;
