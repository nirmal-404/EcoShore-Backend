const express = require('express');
const beachRoutes = require('./beach.routes');
const wasteRecordRoutes = require('./wasteRecord.routes');
const analyticsRoutes = require('./analytics.routes');
const carbonConfigRoutes = require('./carbonConfig.routes');
const agentRoutes = require('./agent.routes');
const organizerRequestRoutes = require('./organizerRequest.routes');
const chatRoutes = require('./chat.routes');
const communityContentRoutes = require('./communityContent.routes');
const eventRoutes = require('./event.routes');
const authRoutes = require("./auth.routes");

const router = express.Router();

/**
 * API Routes
 * All routes are prefixed with /api
 */
app.use('/auth', authRoutes);
router.use('/beaches', beachRoutes);
router.use('/waste-records', wasteRecordRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/carbon-config', carbonConfigRoutes);
router.use('/agents', agentRoutes);
app.use('/organizer-requests', organizerRequestRoutes);
app.use('/chat', chatRoutes);
app.use('/community', communityContentRoutes);
app.use('/events', eventRoutes);

module.exports = router;
