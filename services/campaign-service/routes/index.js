const express = require('express');

const { apiLimiter } = require('../../../gateway/middleware/rateLimiter');
const { apiThrottle } = require('../../../gateway/middleware/throttling');

const campaignRoutes = require('./campaignRoutes');
const reportRoutes = require('./reportRoutes');

const router = express.Router();

router.use('/campaign', apiThrottle, apiLimiter, campaignRoutes);
router.use('/report', apiThrottle, apiLimiter, reportRoutes);

module.exports = router;