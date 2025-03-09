const express = require('express');

const userRoutes = require('./userRoutes');
const campaignRoutes = require('./campaignRoutes');
const reportRoutes = require('./reportRoutes');
const taskRoutes = require('./taskRoutes');

const router = express.Router();

router.use('/user', userRoutes);
router.use('/campaign', campaignRoutes);
router.use('/report', reportRoutes);
router.use('/task', taskRoutes);

module.exports = router;
