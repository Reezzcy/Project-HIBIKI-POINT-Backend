const { Comment, Task, UserTask } = require('../models');
const { publishEvent } = require('../publisher');

const addComment = async (req, res) => {
    try {
        const commenterId = req.user.id;
        const { task_id, comment_text } = req.body;

        const task = await Task.findByPk(task_id, {
            // Ambil ID semua partisipan tugas untuk notifikasi
            include: [{ model: UserTask, attributes: ['user_id'] }],
        });

        if (!task) {
            return res.status(404).json({
                status: 'fail',
                message: 'Task not found.',
                data: null,
            });
        }

        const newComment = await Comment.create({
            task_id,
            user_id: commenterId,
            comment_text,
        });

        // Kumpulkan semua ID yang perlu dinotifikasi
        const participantIds = task.UserTasks
            ? task.UserTasks.map((ut) => ut.user_id)
            : [];
        const allInvolvedIds = [
            ...new Set([...participantIds, task.assigned_to]),
        ];

        // Terbitkan Event
        if (typeof publishEvent === 'function') {
            publishEvent('comment.added', {
                commentId: newComment.comment_id,
                taskId: task_id,
                taskTitle: task.title,
                commenterId: commenterId,
                commentText: comment_text,
                notifyUserIds: allInvolvedIds.filter(
                    (id) => id !== commenterId
                ),
            });
        } else {
            console.warn('publishEvent function is not defined.');
        }

        res.status(201).json({
            status: 'success',
            message: 'Comment added successfully.',
            data: newComment,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to add comment.',
            data: { details: error.message },
        });
    }
};

const getCommentsByTaskId = async (req, res) => {
    try {
        const { task_id } = req.params;
        const comments = await Comment.findAll({ where: { task_id } });

        if (!comments || comments.length === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'No comments found for this task.',
                data: null,
            });
        }

        res.status(200).json({
            status: 'success',
            message: `Comments for task ID ${task_id} retrieved successfully.`,
            data: comments,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve comments for the task.',
            data: { details: error.message },
        });
    }
};

const updateComment = async (req, res) => {
    try {
        const { comment_id } = req.params;
        const { comment_text } = req.body;

        const comment = await Comment.findByPk(comment_id);
        if (!comment) {
            return res.status(404).json({
                status: 'fail',
                message: 'Comment not found.',
                data: null,
            });
        }

        // Update komentar
        comment.comment_text = comment_text;
        await comment.save();

        // Terbitkan Event
        if (typeof publishEvent === 'function') {
            publishEvent('comment.updated', {
                commentId: comment_id,
                updatedText: comment_text,
            });
        } else {
            console.warn('publishEvent function is not defined.');
        }

        res.status(200).json({
            status: 'success',
            message: 'Comment updated successfully.',
            data: comment,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to update comment.',
            data: { details: error.message },
        });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { comment_id } = req.params;

        const comment = await Comment.findByPk(comment_id);
        if (!comment) {
            return res.status(404).json({
                status: 'fail',
                message: 'Comment not found.',
                data: null,
            });
        }

        // Hapus komentar
        await comment.destroy();

        // Terbitkan Event
        if (typeof publishEvent === 'function') {
            publishEvent('comment.deleted', {
                commentId: comment_id,
            });
        } else {
            console.warn('publishEvent function is not defined.');
        }

        res.status(200).json({
            status: 'success',
            message: 'Comment deleted successfully.',
            data: null, // No specific data to return on delete success
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to delete comment.',
            data: { details: error.message },
        });
    }
};

const getCommentById = async (req, res) => {
    try {
        const { comment_id } = req.params;

        const comment = await Comment.findByPk(comment_id);
        if (!comment) {
            return res.status(404).json({
                status: 'fail',
                message: 'Comment not found.',
                data: null,
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Comment retrieved successfully.',
            data: comment,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve comment.',
            data: { details: error.message },
        });
    }
};

const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.findAll();
        res.status(200).json({
            status: 'success',
            message: 'All comments retrieved successfully.',
            data: comments,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve all comments.',
            data: { details: error.message },
        });
    }
};

module.exports = {
    addComment,
    getCommentsByTaskId,
    updateComment,
    deleteComment,
    getCommentById,
    getAllComments,
};
