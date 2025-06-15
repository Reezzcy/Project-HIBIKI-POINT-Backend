// const redis = require('../config/redis');
// const moment = require('moment-timezone');
const { Notification } = require('../models/notification');

const getNotificationsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        const notifications = await Notification.findAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']],
        });

        if (!notifications.length) {
            return res
                .status(404)
                .json({ message: 'No notifications found for this user.' });
        }

        res.status(200).json(notifications);
    } catch (error) {
        console.error(
            '[Notification Service] Error fetching notifications by user ID:',
            error
        );
        res.status(500).json({
            message: 'Error retrieving notifications.',
            error: error.message,
        });
    }
};

module.exports = {
    getNotificationsByUserId,
};
