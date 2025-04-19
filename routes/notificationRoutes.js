const express = require('express');
const router = express.Router();

const {
    addNotification,
    getNotificationFromCache,
    deleteNotificationFromCache,
    getAllNotifications,
    getNotificationById,
    updateNotification,
    deleteNotification,
} = require('../controller/notificationController');

// Create a new notification
router.post('/notifications', addNotification);

// Get all notifications
router.get('/notifications', getAllNotifications);

// Get a notification by ID
router.get('/notifications/:id', getNotificationById);

// Update a notification
router.put('/notifications/:id', updateNotification);

// Delete a notification
router.delete('/notifications/:id', deleteNotification);

// Get notification from cache
router.get('/notifications/cache/:id', getNotificationFromCache);

// Delete notification from cache
router.delete('/notifications/cache/:id', deleteNotificationFromCache);

module.exports = router;
