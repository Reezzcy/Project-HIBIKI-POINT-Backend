const express = require('express');

const userRoutes = require('./userRoutes');
const campaignRoutes = require('./campaignRoutes');

const router = express.Router();

router.use('/user', userRoutes);
router.use('/campaign', campaignRoutes);

module.exports = router;