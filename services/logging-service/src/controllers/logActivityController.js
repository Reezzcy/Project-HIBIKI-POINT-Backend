// const redis = require('../config/redis');
const { LogActivity } = require('../models/logActivity');
const { Op } = require('sequelize');
const moment = require('moment-timezone');

// const getLogActivityFromCache = async (req, res) => {
//     try {
//         const { user_id } = req.params;
//         const cacheKey = `log_activity_${user_id}`;

//         const cachedData = await redis.get(cacheKey);
//         if (!cachedData) {
//             return res
//                 .status(404)
//                 .json({ message: 'Log activity not found in cache' });
//         }

//         res.status(200).json(JSON.parse(cachedData));
//     } catch (error) {
//         res.status(500).json({
//             message: 'Error retrieving log activity from cache',
//             error: error.message,
//         });
//     }
// };

const getLogActivity = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { start_date, end_date } = req.query;

        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required!' });
        }

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

const getLogActivityFromDb = async (req, res) => {
    try {
        const { user_id } = req.params;

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

module.exports = {
    // getLogActivityFromCache,
    getLogActivity,
    getLogActivityFromDb,
    getLogActivityById,
    getAllLogActivities,
};
