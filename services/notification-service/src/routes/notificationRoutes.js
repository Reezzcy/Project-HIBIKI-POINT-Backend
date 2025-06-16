const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

const { getNotificationsByUserId } = notificationController;

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: API for managing notifications
 */
router.get('/:userId', getNotificationsByUserId);

module.exports = router;
