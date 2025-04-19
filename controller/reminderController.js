const redis = require('../config/redisConfig');
const { Reminder, User } = require('../database/models');

// This function adds a reminder to the Redis cache and the database
const addReminder = async (req, res) => {
    try {
        const { user_id, reminder_text } = req.body;

        // Validate input
        if (!user_id || !reminder_text) {
            return res
                .status(400)
                .json({ message: 'All fields are required!' });
        }

        // Create reminder object to save in cache
        const reminderData = {
            user_id,
            reminder_text,
        };

        // Save to Redis cache
        await redis.set(
            `reminder_${user_id}`,
            JSON.stringify(reminderData),
            'EX',
            3600
        ); // Cache for 1 hour

        res.status(200).json({
            message: 'Reminder cached successfully!',
            reminder: reminderData,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error saving reminder to cache',
            error: error.message,
        });
    }
};

// This function retrieves a reminder from the Redis cache
const getReminderFromCache = async (req, res) => {
    try {
        const { user_id } = req.params;
        const cacheKey = `reminder_${user_id}`;

        // Check if the data is in the cache
        const cachedData = await redis.get(cacheKey);
        if (!cachedData) {
            return res
                .status(404)
                .json({ message: 'Reminder not found in cache' });
        }

        res.status(200).json(JSON.parse(cachedData));
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving reminder from cache',
            error: error.message,
        });
    }
};

// This function retrieves all reminders from the database
const getAllReminders = async (req, res) => {
    try {
        const reminders = await Reminder.findAll({
            include: [{ model: User, as: 'user' }],
        });
        res.status(200).json(reminders);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching reminders',
            error: error.message,
        });
    }
};

// This function retrieves a specific reminder by ID from the database
const getReminderById = async (req, res) => {
    try {
        const { id } = req.params;
        const reminder = await Reminder.findOne({
            where: { reminder_id: id },
            include: [{ model: User, as: 'user' }],
        });
        if (!reminder) {
            return res.status(404).json({ message: 'Reminder not found' });
        }
        res.status(200).json(reminder);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching reminder',
            error: error.message,
        });
    }
};

// This function updates a reminder in the database
const updateReminder = async (req, res) => {
    try {
        const { id } = req.params;
        const { reminder_text } = req.body;

        const reminder = await Reminder.findByPk(id);
        if (!reminder) {
            return res.status(404).json({ message: 'Reminder not found' });
        }

        await reminder.update({ reminder_text });

        res.status(200).json(reminder);
    } catch (error) {
        res.status(500).json({
            message: 'Error updating reminder',
            error: error.message,
        });
    }
};

// This function deletes a reminder from the database
const deleteReminder = async (req, res) => {
    try {
        const { id } = req.params;
        const reminder = await Reminder.findByPk(id);
        if (!reminder) {
            return res.status(404).json({ message: 'Reminder not found' });
        }

        await reminder.destroy();
        res.status(200).json({ message: 'Reminder deleted successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting reminder',
            error: error.message,
        });
    }
};

// This function deletes a reminder from the Redis cache
const deleteReminderFromCache = async (req, res) => {
    try {
        const { user_id } = req.params;
        const cacheKey = `reminder_${user_id}`;

        // Delete from Redis cache
        await redis.del(cacheKey);

        res.status(200).json({ message: 'Reminder deleted from cache' });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting reminder from cache',
            error: error.message,
        });
    }
};

module.exports = {
    addReminder,
    getReminderFromCache,
    getAllReminders,
    getReminderById,
    updateReminder,
    deleteReminder,
    deleteReminderFromCache,
};
