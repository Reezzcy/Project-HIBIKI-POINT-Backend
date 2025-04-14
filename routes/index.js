const express = require('express');

const { 
    apiLimiter, 
    loginLimiter 
} = require('../middleware/rateLimiter');
const { apiThrottle } = require('../middleware/throttling');

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const campaignRoutes = require('./campaignRoutes');
const reportRoutes = require('./reportRoutes');
const taskRoutes = require('./taskRoutes');
const cacheRoutes = require('./cacheRoutes');

const router = express.Router();

router.use('/auth', apiThrottle, loginLimiter, authRoutes);
router.use('/user', apiLimiter, userRoutes);
router.use('/campaign', apiLimiter, campaignRoutes);
router.use('/report', apiLimiter, reportRoutes);
router.use('/task', apiLimiter, taskRoutes);
router.use('/cache', apiLimiter, cacheRoutes);

module.exports = router;
