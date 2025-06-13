const express = require('express');
const router = express.Router();

const {
    addNotification,
    getNotificationFromCache,
    getNotification,
    deleteNotificationFromCache,
    getAllNotifications,
    getNotificationById,
    updateNotification,
    deleteNotification,
    sendNotification,
    getNotificationByType,
    getNotificationByTypeWithoutUser,
    getNotificationByUserId,
    getNotificationByUserIdWithoutUser,
    getNotificationByDate,
    getNotificationByDateWithoutUser,
    getNotificationByDateRange,
    getNotificationByDateRangeWithoutUser,
    getNotificationByUserIdAndDate,
    getNotificationByUserIdAndDateRange,
    getNotificationByTypeAndDate,
    getNotificationByTypeAndDateRange,
    getNotificationByUserIdAndType,
    getNotificationByUserIdAndTypeAndDate,
    getNotificationByUserIdAndTypeAndDateRange,
    getNotificationByTypeAndUserIdAndDate,
    getNotificationByTypeAndUserIdAndDateRange,
} = require('../controller/notificationController');

// Create a new notification
router.post('/notifications', addNotification);
// Get all notification
router.get('/notification', getNotification);
// Get all notifications with include
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
// Send notification
router.post('/notifications/send', sendNotification);
// Get notification by type
router.get('/notifications/type/:type', getNotificationByType);
// Get notification by type without user
router.get(
    '/notifications/type/withoutUser/:type',
    getNotificationByTypeWithoutUser
);
// Get notification by user ID
router.get('/notifications/user/:userId', getNotificationByUserId);
// Get notification by user ID without user
router.get(
    '/notifications/user/withoutUser/:userId',
    getNotificationByUserIdWithoutUser
);
// Get notification by date
router.get('/notifications/date/:date', getNotificationByDate);
// Get notification by date without user
router.get(
    '/notifications/date/withoutUser/:date',
    getNotificationByDateWithoutUser
);
// Get notification by date range
router.get(
    '/notifications/date/range/:startDate/:endDate',
    getNotificationByDateRange
);
// Get notification by date range without user
router.get(
    '/notifications/date/range/withoutUser/:startDate/:endDate',
    getNotificationByDateRangeWithoutUser
);
// Get notification by user ID and date
router.get(
    '/notifications/user/date/:userId/:date',
    getNotificationByUserIdAndDate
);
// Get notification by user ID and date range
router.get(
    '/notifications/user/date/range/:userId/:startDate/:endDate',
    getNotificationByUserIdAndDateRange
);
// Get notification by type and date
router.get(
    '/notifications/type/date/:type/:date',
    getNotificationByTypeAndDate
);
// Get notification by type and date range
router.get(
    '/notifications/type/date/range/:type/:startDate/:endDate',
    getNotificationByTypeAndDateRange
);
// Get notification by user ID and type
router.get(
    '/notifications/user/type/:userId/:type',
    getNotificationByUserIdAndType
);
// Get notification by user ID and type and date
router.get(
    '/notifications/user/type/date/:userId/:type/:date',
    getNotificationByUserIdAndTypeAndDate
);
// Get notification by user ID and type and date range
router.get(
    '/notifications/user/type/date/range/:userId/:type/:startDate/:endDate',
    getNotificationByUserIdAndTypeAndDateRange
);
// Get notification by type and user ID and date
router.get(
    '/notifications/type/user/date/:type/:userId/:date',
    getNotificationByTypeAndUserIdAndDate
);
// Get notification by type and user ID and date range
router.get(
    '/notifications/type/user/date/range/:type/:userId/:startDate/:endDate',
    getNotificationByTypeAndUserIdAndDateRange
);

module.exports = router;
