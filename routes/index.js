const express = require('express');

const { apiLimiter, loginLimiter } = require('../middleware/rateLimiter');
const { apiThrottle } = require('../middleware/throttling');

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const campaignRoutes = require('./campaignRoutes');
const reportRoutes = require('./reportRoutes');
const taskRoutes = require('./taskRoutes');
const cacheRoutes = require('./cacheRoutes');

const router = express.Router();

// Middleware to throttle API requests
router.use('/auth', apiThrottle, loginLimiter, authRoutes);
// Middleware to limit API requests for other routes
router.use('/user', apiLimiter, userRoutes);
// Middleware to limit API requests for campaign, report, task, and cache routes
router.use('/campaign', apiLimiter, campaignRoutes);
// Middleware to limit API requests for report, task, and cache routes
router.use('/report', apiLimiter, reportRoutes);
// Middleware to limit API requests for task and cache routes
router.use('/task', apiLimiter, taskRoutes);
// Middleware to limit API requests for cache routes
router.use('/cache', apiLimiter, cacheRoutes);

module.exports = router;
