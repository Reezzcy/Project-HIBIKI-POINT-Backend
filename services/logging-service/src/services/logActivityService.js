// const redis = require('../config/redis');
const { LogActivity } = require('../models/logActivity');

const saveLogActivity = async (logData) => {
    try {
        const { user_id, activity_type, activity_description } = logData;

        if (!user_id || !activity_type || !activity_description) {
            throw new Error(
                'user_id, activity_type, and activity_description are required!'
            );
        }

        const logActivityData = {
            user_id: user_id,
            activity_type: activity_type,
            activity_description: activity_description,
        };

        await LogActivity.create(logActivityData);

        // await redis.set(
        //     `log_activity_${user_id}_${Date.now()}`,
        //     JSON.stringify(logActivityData),
        //     'EX',
        //     3600
        // );

        console.log('Log activity cached successfully!');
        return logActivityData;
    } catch (error) {
        console.error('Error saving log activity to cache:', error.message);
        throw error;
    }
};

module.exports = { saveLogActivity };
