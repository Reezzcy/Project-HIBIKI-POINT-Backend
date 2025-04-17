const redis = require('../config/redis');
const { Attachment, User } = require('../database/models');

const addAttachment = async (req, res) => {
    try {
        const { user_id, attachment_url } = req.body;

        // Validate input
        if (!user_id || !attachment_url) {
            return res
                .status(400)
                .json({ message: 'All fields are required!' });
        }

        // Create attachment object to save in cache
        const attachmentData = {
            user_id,
            attachment_url,
        };

        // Save to Redis cache
        await redis.set(
            `attachment_${user_id}`,
            JSON.stringify(attachmentData),
            'EX',
            3600
        ); // Cache for 1 hour

        res.status(200).json({
            message: 'Attachment cached successfully!',
            attachment: attachmentData,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error saving attachment to cache',
            error: error.message,
        });
    }
};

const getAttachmentFromCache = async (req, res) => {
    try {
        const { user_id } = req.params;
        const cacheKey = `attachment_${user_id}`;

        // Check if the data is in the cache
        const cachedData = await redis.get(cacheKey);
        if (!cachedData) {
            return res
                .status(404)
                .json({ message: 'Attachment not found in cache' });
        }

        res.status(200).json(JSON.parse(cachedData));
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving attachment from cache',
            error: error.message,
        });
    }
};

const deleteAttachmentFromCache = async (req, res) => {
    try {
        const { user_id } = req.params;
        const cacheKey = `attachment_${user_id}`;

        // Delete from Redis cache
        await redis.del(cacheKey);

        res.status(200).json({ message: 'Attachment deleted from cache' });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting attachment from cache',
            error: error.message,
        });
    }
};

const getAttachmentFromDb = async (req, res) => {
    try {
        const { user_id } = req.params;

        // Fetch attachment from the database
        const attachment = await Attachment.findOne({
            where: { user_id },
            include: User,
        });

        if (!attachment) {
            return res.status(404).json({ message: 'Attachment not found' });
        }

        res.status(200).json(attachment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateAttachmentInDb = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { attachment_url } = req.body;

        // Validate input
        if (!attachment_url) {
            return res
                .status(400)
                .json({ message: 'Attachment URL is required!' });
        }

        // Update attachment in the database
        const attachment = await Attachment.findOne({ where: { user_id } });
        if (!attachment) {
            return res.status(404).json({ message: 'Attachment not found' });
        }

        attachment.attachment_url = attachment_url;
        await attachment.save();

        res.status(200).json({
            message: 'Attachment updated successfully!',
            attachment,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteAttachmentFromDb = async (req, res) => {
    try {
        const { user_id } = req.params;

        // Delete attachment from the database
        const attachment = await Attachment.findOne({ where: { user_id } });
        if (!attachment) {
            return res.status(404).json({ message: 'Attachment not found' });
        }

        await attachment.destroy();

        res.status(200).json({ message: 'Attachment deleted successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addAttachment,
    getAttachmentFromCache,
    deleteAttachmentFromCache,
    getAttachmentFromDb,
    updateAttachmentInDb,
    deleteAttachmentFromDb,
};
