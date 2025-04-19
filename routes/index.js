const express = require('express');

const { apiLimiter, loginLimiter } = require('../middleware/rateLimiter');
const { apiThrottle } = require('../middleware/throttling');

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const campaignRoutes = require('./campaignRoutes');
const reportRoutes = require('./reportRoutes');
const taskRoutes = require('./taskRoutes');
const cacheRoutes = require('./cacheRoutes');
const attachmentRoutes = require('./attachmentRoutes');
const notificationRoutes = require('./notificationRoutes');
const reminderRoutes = require('./reminderRoutes');
const logActivityRoutes = require('./logActivityRoutes');
const calendarRoutes = require('./calendarRoutes');
const commentRoutes = require('./commentRoutes');

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
// Middleware to limit API requests for attachment routes
router.use('/attachment', apiLimiter, attachmentRoutes);
// Middleware to limit API requests for notification routes
router.use('/notification', apiLimiter, notificationRoutes);
// Middleware to limit API requests for reminder routes
router.use('/reminder', apiLimiter, reminderRoutes);
// Middleware to limit API requests for log activity routes
router.use('/logActivity', apiLimiter, logActivityRoutes);
// Middleware to limit API requests for calendar routes
router.use('/calendar', apiLimiter, calendarRoutes);
// Middleware to limit API requests for comment routes
router.use('/comment', apiLimiter, commentRoutes);

module.exports = router;
