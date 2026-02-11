/**
 * Routes Index - Interface Layer (HTTP)
 * Central export for all HTTP routes
 */
const express = require('express');
const authRoutes = require('./auth.routes');

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = router;
