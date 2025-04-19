const redis = require('../config/redis');
const moment = require('moment-timezone');
const { User } = require('../database/models');
const { Notification } = require('../database/models');

// Function to add a notification to the cache and database
const addNotification = async (req, res) => {
    try {
        const { user_id, notification_type, notification_message } = req.body;

        // Validate input
        if (!user_id || !notification_type || !notification_message) {
            return res
                .status(400)
                .json({ message: 'All fields are required!' });
        }

        // Create notification object to save in cache
        const notificationData = {
            user_id,
            notification_type,
            notification_message,
            created_at: moment()
                .tz('Asia/Jakarta')
                .format('YYYY-MM-DD HH:mm:ss'),
        };

        // Save to Redis cache
        await redis.set(
            `notification_${user_id}`,
            JSON.stringify(notificationData),
            'EX',
            3600
        ); // Cache for 1 hour

        res.status(200).json({
            message: 'Notification cached successfully!',
            notification: notificationData,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error saving notification to cache',
            error: error.message,
        });
    }
};

// Function to retrieve a notification from the cache
const getNotificationFromCache = async (req, res) => {
    try {
        const { user_id } = req.params;
        const cacheKey = `notification_${user_id}`;

        // Check if the data is in the cache
        const cachedData = await redis.get(cacheKey);
        if (!cachedData) {
            return res
                .status(404)
                .json({ message: 'Notification not found in cache' });
        }

        res.status(200).json(JSON.parse(cachedData));
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving notification from cache',
            error: error.message,
        });
    }
};

// Function to retrieve a notification from the database
const getNotification = async (req, res) => {
    try {
        const { user_id } = req.params;
        const notifications = await Notification.findAll({
            where: { user_id },
            order: [['created_at', 'DESC']],
        });

        if (!notifications.length) {
            return res.status(404).json({ message: 'No notifications found' });
        }

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to delete a notification from the cache
const deleteNotificationFromCache = async (req, res) => {
    try {
        const { user_id } = req.params;

        // Delete from Redis cache
        const result = await redis.del(`notification_${user_id}`);
        if (result === 1) {
            res.status(200).json({
                message: 'Notification deleted from cache successfully!',
            });
        } else {
            res.status(404).json({
                message: 'Notification not found in cache',
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting notification from cache',
            error: error.message,
        });
    }
};

// Function to retrieve all notifications from the database
const getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            include: {
                model: User,
                attributes: ['user_id', 'name', 'email'],
            },
            order: [['created_at', 'DESC']],
        });

        if (!notifications.length) {
            return res.status(404).json({ message: 'No notifications found' });
        }

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to retrieve a notification by ID from the database
const getNotificationById = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await Notification.findOne({
            where: { notification_id: id },
            include: {
                model: User,
                attributes: ['user_id', 'name', 'email'],
            },
        });

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to update a notification in the database
const updateNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const { notification_type, notification_message } = req.body;

        const notification = await Notification.findByPk(id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        await notification.update({ notification_type, notification_message });

        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to delete a notification from the database
const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await Notification.findByPk(id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        await notification.destroy();

        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to send a notification via email, push notification, WhatsApp, and SMS
const sendNotification = async (req, res) => {
    try {
        const { user_id, notification_type, notification_message } = req.body;

        // Validate input
        if (!user_id || !notification_type || !notification_message) {
            return res
                .status(400)
                .json({ message: 'All fields are required!' });
        }

        // Send email notification
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        await sendEmail(user.email, notification_message);

        // Send push notification
        await sendPushNotification(user.device_token, notification_message);

        // Send WhatsApp message
        await sendWhatsAppMessage(user.phone_number, notification_message);

        // Send SMS
        await sendSMS(user.phone_number, notification_message);

        res.status(200).json({ message: 'Notification sent successfully!' });
    } catch (error) {
        res.status(500).json({
            message: 'Error sending notification',
            error: error.message,
        });
    }
};

// Function to retrieve notifications by type from the database
const getNotificationByType = async (req, res) => {
    try {
        const { notification_type } = req.params;

        const notifications = await Notification.findAll({
            where: { notification_type },
            include: {
                model: User,
                attributes: ['user_id', 'name', 'email'],
            },
            order: [['created_at', 'DESC']],
        });

        if (!notifications.length) {
            return res.status(404).json({ message: 'No notifications found' });
        }

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to retrieve notifications by type without user details from the database
const getNotificationByTypeWithoutUser = async (req, res) => {
    try {
        const { notification_type } = req.params;

        const notifications = await Notification.findAll({
            where: { notification_type },
            order: [['created_at', 'DESC']],
        });

        if (!notifications.length) {
            return res.status(404).json({ message: 'No notifications found' });
        }

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to retrieve notifications by user ID from the database
const getNotificationByUserId = async (req, res) => {
    try {
        const { user_id } = req.params;

        const notifications = await Notification.findAll({
            where: { user_id },
            include: {
                model: User,
                attributes: ['user_id', 'name', 'email'],
            },
            order: [['created_at', 'DESC']],
        });

        if (!notifications.length) {
            return res.status(404).json({ message: 'No notifications found' });
        }

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to retrieve notifications by user ID without user details from the database
const getNotificationByUserIdWithoutUser = async (req, res) => {
    try {
        const { user_id } = req.params;

        const notifications = await Notification.findAll({
            where: { user_id },
            order: [['created_at', 'DESC']],
        });

        if (!notifications.length) {
            return res.status(404).json({ message: 'No notifications found' });
        }

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to retrieve notifications by date from the database
const getNotificationByDate = async (req, res) => {
    try {
        const { date } = req.params;

        const notifications = await Notification.findAll({
            where: {
                created_at: {
                    [Op.gte]: moment(date).startOf('day').toDate(),
                    [Op.lte]: moment(date).endOf('day').toDate(),
                },
            },
            include: {
                model: User,
                attributes: ['user_id', 'name', 'email'],
            },
            order: [['created_at', 'DESC']],
        });

        if (!notifications.length) {
            return res.status(404).json({ message: 'No notifications found' });
        }

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to retrieve notifications by date without user details from the database
const getNotificationByDateWithoutUser = async (req, res) => {
    try {
        const { date } = req.params;

        const notifications = await Notification.findAll({
            where: {
                created_at: {
                    [Op.gte]: moment(date).startOf('day').toDate(),
                    [Op.lte]: moment(date).endOf('day').toDate(),
                },
            },
            order: [['created_at', 'DESC']],
        });

        if (!notifications.length) {
            return res.status(404).json({ message: 'No notifications found' });
        }

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to retrieve notifications by date range from the database
const getNotificationByDateRange = async (req, res) => {
    try {
        const { start_date, end_date } = req.params;

        const notifications = await Notification.findAll({
            where: {
                created_at: {
                    [Op.gte]: moment(start_date).startOf('day').toDate(),
                    [Op.lte]: moment(end_date).endOf('day').toDate(),
                },
            },
            include: {
                model: User,
                attributes: ['user_id', 'name', 'email'],
            },
            order: [['created_at', 'DESC']],
        });

        if (!notifications.length) {
            return res.status(404).json({ message: 'No notifications found' });
        }

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to retrieve notifications by date range without user details from the database
const getNotificationByDateRangeWithoutUser = async (req, res) => {
    try {
        const { start_date, end_date } = req.params;

        const notifications = await Notification.findAll({
            where: {
                created_at: {
                    [Op.gte]: moment(start_date).startOf('day').toDate(),
                    [Op.lte]: moment(end_date).endOf('day').toDate(),
                },
            },
            order: [['created_at', 'DESC']],
        });

        if (!notifications.length) {
            return res.status(404).json({ message: 'No notifications found' });
        }

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to retrieve notifications by user ID and date from the database
const getNotificationByUserIdAndDate = async (req, res) => {
    try {
        const { user_id, date } = req.params;

        const notifications = await Notification.findAll({
            where: {
                user_id,
                created_at: {
                    [Op.gte]: moment(date).startOf('day').toDate(),
                    [Op.lte]: moment(date).endOf('day').toDate(),
                },
            },
            include: {
                model: User,
                attributes: ['user_id', 'name', 'email'],
            },
            order: [['created_at', 'DESC']],
        });

        if (!notifications.length) {
            return res.status(404).json({ message: 'No notifications found' });
        }

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to retrieve notifications by user ID and date range from the database
const getNotificationByUserIdAndDateRange = async (req, res) => {
    try {
        const { user_id, start_date, end_date } = req.params;

        const notifications = await Notification.findAll({
            where: {
                user_id,
                created_at: {
                    [Op.gte]: moment(start_date).startOf('day').toDate(),
                    [Op.lte]: moment(end_date).endOf('day').toDate(),
                },
            },
            include: {
                model: User,
                attributes: ['user_id', 'name', 'email'],
            },
            order: [['created_at', 'DESC']],
        });

        if (!notifications.length) {
            return res.status(404).json({ message: 'No notifications found' });
        }

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to retrieve notifications by type and date from the database
const getNotificationByTypeAndDate = async (req, res) => {
    try {
        const { notification_type, date } = req.params;

        const notifications = await Notification.findAll({
            where: {
                notification_type,
                created_at: {
                    [Op.gte]: moment(date).startOf('day').toDate(),
                    [Op.lte]: moment(date).endOf('day').toDate(),
                },
            },
            include: {
                model: User,
                attributes: ['user_id', 'name', 'email'],
            },
            order: [['created_at', 'DESC']],
        });

        if (!notifications.length) {
            return res.status(404).json({ message: 'No notifications found' });
        }

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to retrieve notifications by type and date range from the database
const getNotificationByTypeAndDateRange = async (req, res) => {
    try {
        const { notification_type, start_date, end_date } = req.params;

        const notifications = await Notification.findAll({
            where: {
                notification_type,
                created_at: {
                    [Op.gte]: moment(start_date).startOf('day').toDate(),
                    [Op.lte]: moment(end_date).endOf('day').toDate(),
                },
            },
            include: {
                model: User,
                attributes: ['user_id', 'name', 'email'],
            },
            order: [['created_at', 'DESC']],
        });

        if (!notifications.length) {
            return res.status(404).json({ message: 'No notifications found' });
        }

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to retrieve notifications by user ID and type from the database
const getNotificationByUserIdAndType = async (req, res) => {
    try {
        const { user_id, notification_type } = req.params;

        const notifications = await Notification.findAll({
            where: { user_id, notification_type },
            include: {
                model: User,
                attributes: ['user_id', 'name', 'email'],
            },
            order: [['created_at', 'DESC']],
        });

        if (!notifications.length) {
            return res.status(404).json({ message: 'No notifications found' });
        }

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to retrieve notifications by user ID and type without user details from the database
const getNotificationByUserIdAndTypeAndDate = async (req, res) => {
    try {
        const { user_id, notification_type, date } = req.params;

        const notifications = await Notification.findAll({
            where: {
                user_id,
                notification_type,
                created_at: {
                    [Op.gte]: moment(date).startOf('day').toDate(),
                    [Op.lte]: moment(date).endOf('day').toDate(),
                },
            },
            include: {
                model: User,
                attributes: ['user_id', 'name', 'email'],
            },
            order: [['created_at', 'DESC']],
        });

        if (!notifications.length) {
            return res.status(404).json({ message: 'No notifications found' });
        }

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to retrieve notifications by user ID and type and date range from the database
const getNotificationByUserIdAndTypeAndDateRange = async (req, res) => {
    try {
        const { user_id, notification_type, start_date, end_date } = req.params;

        const notifications = await Notification.findAll({
            where: {
                user_id,
                notification_type,
                created_at: {
                    [Op.gte]: moment(start_date).startOf('day').toDate(),
                    [Op.lte]: moment(end_date).endOf('day').toDate(),
                },
            },
            include: {
                model: User,
                attributes: ['user_id', 'name', 'email'],
            },
            order: [['created_at', 'DESC']],
        });

        if (!notifications.length) {
            return res.status(404).json({ message: 'No notifications found' });
        }

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to retrieve notifications by type and user ID and date from the database
const getNotificationByTypeAndUserIdAndDate = async (req, res) => {
    try {
        const { notification_type, user_id, date } = req.params;

        const notifications = await Notification.findAll({
            where: {
                notification_type,
                user_id,
                created_at: {
                    [Op.gte]: moment(date).startOf('day').toDate(),
                    [Op.lte]: moment(date).endOf('day').toDate(),
                },
            },
            include: {
                model: User,
                attributes: ['user_id', 'name', 'email'],
            },
            order: [['created_at', 'DESC']],
        });

        if (!notifications.length) {
            return res.status(404).json({ message: 'No notifications found' });
        }

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to retrieve notifications by type and user ID and date range from the database
const getNotificationByTypeAndUserIdAndDateRange = async (req, res) => {
    try {
        const { notification_type, user_id, start_date, end_date } = req.params;

        const notifications = await Notification.findAll({
            where: {
                notification_type,
                user_id,
                created_at: {
                    [Op.gte]: moment(start_date).startOf('day').toDate(),
                    [Op.lte]: moment(end_date).endOf('day').toDate(),
                },
            },
            include: {
                model: User,
                attributes: ['user_id', 'name', 'email'],
            },
            order: [['created_at', 'DESC']],
        });

        if (!notifications.length) {
            return res.status(404).json({ message: 'No notifications found' });
        }

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
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
};
