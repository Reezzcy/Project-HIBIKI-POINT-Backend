const redis = require('../config/redis');
const { LogActivity } = require('../database/models');
const { Op } = require('sequelize');
const moment = require('moment-timezone');

const addLogActivity = async (req, res) => {
    try {
        const { user_id, activity_type, description } = req.body;

        // Validate input
        if (!user_id || !activity_type || !description) {
            return res
                .status(400)
                .json({ message: 'All fields are required!' });
        }

        // Create log activity object to save in cache
        const logActivityData = {
            user_id,
            activity_type,
            description,
            created_at: moment()
                .tz('Asia/Kolkata')
                .format('YYYY-MM-DD HH:mm:ss'),
        };

        // Save to Redis cache
        await redis.set(
            `log_activity_${user_id}`,
            JSON.stringify(logActivityData),
            'EX',
            3600
        ); // Cache for 1 hour

        res.status(200).json({
            message: 'Log activity cached successfully!',
            log_activity: logActivityData,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error saving log activity to cache',
            error: error.message,
        });
    }
};

const getLogActivityFromCache = async (req, res) => {
    try {
        const { user_id } = req.params;
        const cacheKey = `log_activity_${user_id}`;

        // Check if the data is in the cache
        const cachedData = await redis.get(cacheKey);
        if (!cachedData) {
            return res
                .status(404)
                .json({ message: 'Log activity not found in cache' });
        }

        res.status(200).json(JSON.parse(cachedData));
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving log activity from cache',
            error: error.message,
        });
    }
};

const getLogActivity = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { start_date, end_date } = req.query;

        // Validate input
        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required!' });
        }

        // Fetch log activities from the database
        const whereClause = {
            user_id: user_id,
            ...(start_date &&
                end_date && {
                    created_at: {
                        [Op.between]: [
                            moment(start_date).toDate(),
                            moment(end_date).toDate(),
                        ],
                    },
                }),
        };

        const logActivities = await LogActivity.findAll({
            where: whereClause,
            order: [['created_at', 'DESC']],
        });

        if (logActivities.length === 0) {
            return res.status(404).json({ message: 'No log activities found' });
        }

        res.status(200).json(logActivities);
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving log activities',
            error: error.message,
        });
    }
};

const deleteLogActivityFromCache = async (req, res) => {
    try {
        const { user_id } = req.params;
        const cacheKey = `log_activity_${user_id}`;

        // Delete from Redis cache
        await redis.del(cacheKey);

        res.status(200).json({ message: 'Log activity deleted from cache' });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting log activity from cache',
            error: error.message,
        });
    }
};

const getLogActivityFromDb = async (req, res) => {
    try {
        const { user_id } = req.params;

        // Fetch log activity from the database
        const logActivity = await LogActivity.findOne({
            where: { user_id },
        });

        if (!logActivity) {
            return res.status(404).json({ message: 'Log activity not found' });
        }

        res.status(200).json(logActivity);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteLogActivityFromDb = async (req, res) => {
    try {
        const { user_id } = req.params;

        // Delete log activity from the database
        const deleted = await LogActivity.destroy({
            where: { user_id },
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Log activity not found' });
        }

        res.status(200).json({ message: 'Log activity deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateLogActivity = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { activity_type, description } = req.body;

        // Validate input
        if (!activity_type || !description) {
            return res
                .status(400)
                .json({ message: 'All fields are required!' });
        }

        // Update log activity in the database
        const logActivity = await LogActivity.findOne({
            where: { user_id },
        });

        if (!logActivity) {
            return res.status(404).json({ message: 'Log activity not found' });
        }

        await logActivity.update({ activity_type, description });

        res.status(200).json(logActivity);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getLogActivityById = async (req, res) => {
    try {
        const { id } = req.params;

        const logActivity = await LogActivity.findOne({
            where: { log_activity_id: id },
        });

        if (!logActivity) {
            return res.status(404).json({ message: 'Log activity not found' });
        }

        res.status(200).json(logActivity);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllLogActivities = async (req, res) => {
    try {
        const logActivities = await LogActivity.findAll({
            order: [['created_at', 'DESC']],
        });

        if (logActivities.length === 0) {
            return res.status(404).json({ message: 'No log activities found' });
        }

        res.status(200).json(logActivities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteAllLogActivities = async (req, res) => {
    try {
        await LogActivity.destroy({ where: {}, truncate: true });
        res.status(200).json({
            message: 'All log activities deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteLogActivityById = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await LogActivity.destroy({
            where: { log_activity_id: id },
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Log activity not found' });
        }

        res.status(200).json({ message: 'Log activity deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteLogActivityByUserId = async (req, res) => {
    try {
        const { user_id } = req.params;

        const deleted = await LogActivity.destroy({
            where: { user_id },
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Log activity not found' });
        }

        res.status(200).json({ message: 'Log activity deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteLogActivityByDate = async (req, res) => {
    try {
        const { start_date, end_date } = req.query;

        // Validate input
        if (!start_date || !end_date) {
            return res
                .status(400)
                .json({ message: 'Start date and end date are required!' });
        }

        // Delete log activities from the database
        const deleted = await LogActivity.destroy({
            where: {
                created_at: {
                    [Op.between]: [
                        moment(start_date).toDate(),
                        moment(end_date).toDate(),
                    ],
                },
            },
        });

        if (!deleted) {
            return res.status(404).json({ message: 'No log activities found' });
        }

        res.status(200).json({
            message: 'Log activities deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addLogActivity,
    getLogActivityFromCache,
    getLogActivity,
    deleteLogActivityFromCache,
    getLogActivityFromDb,
    deleteLogActivityFromDb,
    updateLogActivity,
    getLogActivityById,
    getAllLogActivities,
    deleteAllLogActivities,
    deleteLogActivityById,
    deleteLogActivityByUserId,
    deleteLogActivityByDate,
};
