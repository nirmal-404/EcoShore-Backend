const express = require('express');
const beachRoutes = require('./beach.routes');
const wasteRecordRoutes = require('./wasteRecord.routes');
const analyticsRoutes = require('./analytics.routes');
const carbonConfigRoutes = require('./carbonConfig.routes');

const router = express.Router();

/**
 * API Routes
 * All routes are prefixed with /api
 */
router.use('/beaches', beachRoutes);
router.use('/waste-records', wasteRecordRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/carbon-config', carbonConfigRoutes);

module.exports = router;
