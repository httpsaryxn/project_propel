const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const studentRoutes = require('./student.routes');
const companyRoutes = require('./company.routes');
const applicationRoutes = require('./application.routes');
const offerRoutes = require('./offer.routes');
const resultRoutes = require('./result.routes');
const notificationRoutes = require('./notification.routes');
const analyticsRoutes = require('./analytics.routes');
const visitRoutes = require('./visit.routes');

router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/companies', companyRoutes);
router.use('/applications', applicationRoutes);
router.use('/offers', offerRoutes);
router.use('/results', resultRoutes);
router.use('/notifications', notificationRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/company-visits', visitRoutes);

module.exports = router;
