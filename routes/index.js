const express = require('express');

const { 
    apiLimiter, 
    loginLimiter 
} = require('../middleware/rateLimiter');

const userRoutes = require('./userRoutes');
const campaignRoutes = require('./campaignRoutes');
const reportRoutes = require('./reportRoutes');
const taskRoutes = require('./taskRoutes');

const router = express.Router();

router.use('/user', apiLimiter, userRoutes);
router.use('/campaign', apiLimiter, campaignRoutes);
router.use('/report', apiLimiter, reportRoutes);
router.use('/task', apiLimiter, taskRoutes);

module.exports = router;
