const redis = require('../config/redis');
const { Comment, User } = require('../database/models');

// This function handles adding a comment and caching it in Redis
const addComment = async (req, res) => {
    try {
        const { user_id, comment_text } = req.body;

        // Validate input
        if (!user_id || !comment_text) {
            return res
                .status(400)
                .json({ message: 'All fields are required!' });
        }

        // Create comment object to save in cache
        const commentData = {
            user_id,
            comment_text,
        };

        saveLog = await saveLogActivity({
            user_id: user_id,
            action: 'add_comment',
            details: `Comment added: ${comment_text}`,
        });

        // Save to Redis cache
        await redis.set(
            `comment_${user_id}`,
            JSON.stringify(commentData),
            'EX',
            3600
        ); // Cache for 1 hour

        res.status(200).json({
            message: 'Comment cached successfully!',
            comment: commentData,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error saving comment to cache',
            error: error.message,
        });
    }
};

// This function retrieves a comment from Redis cache
const getCommentFromCache = async (req, res) => {
    try {
        const { user_id } = req.params;
        const cacheKey = `comment_${user_id}`;

        // Check if the data is in the cache
        const cachedData = await redis.get(cacheKey);
        if (!cachedData) {
            return res
                .status(404)
                .json({ message: 'Comment not found in cache' });
        }

        res.status(200).json(JSON.parse(cachedData));
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving comment from cache',
            error: error.message,
        });
    }
};

// This function deletes a comment from Redis cache
const deleteCommentFromCache = async (req, res) => {
    try {
        const { user_id } = req.params;

        // Delete from Redis cache
        const result = await redis.del(`comment_${user_id}`);
        if (result === 1) {
            res.status(200).json({
                message: 'Comment deleted from cache successfully!',
            });
        } else {
            res.status(404).json({ message: 'Comment not found in cache' });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting comment from cache',
            error: error.message,
        });
    }
};

// This function retrieves all comments from the database
const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.findAll({
            include: {
                model: User,
                attributes: ['user_id', 'name'],
            },
        });

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// This function retrieves a comment by its ID from the database
const getCommentById = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findOne({
            where: { comment_id: id },
            include: {
                model: User,
                attributes: ['user_id', 'name'],
            },
        });

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// This function updates a comment in the database
const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, comment_text } = req.body;

        const comment = await Comment.findByPk(id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        await comment.update({ user_id, comment_text });

        saveLog = await saveLogActivity({
            user_id: user_id,
            action: 'update_comment',
            details: `Comment updated: ${comment_text}`,
        });

        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// This function deletes a comment from the database
const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findByPk(id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        await comment.destroy();

        saveLog = await saveLogActivity({
            user_id: comment.user_id,
            action: 'delete_comment',
            details: `Comment deleted with ID: ${id}`,
        });

        res.status(200).json({ message: 'Comment deleted successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addComment,
    getCommentFromCache,
    deleteCommentFromCache,
    getAllComments,
    getCommentById,
    updateComment,
    deleteComment,
};
