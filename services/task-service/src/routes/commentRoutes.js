const express = require('express');
const router = express.Router();

const {
    addComment,
    getCommentsByTaskId,
    updateComment,
    deleteComment,
    getCommentById,
    getAllComments,
} = require('../controllers/commentController');

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: API for managing comments on tasks
 */
router.post('/', addComment);

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: A list of comments
 */
router.get('/', getAllComments);

/**
 * @swagger
 * /comments/{comment_id}:
 *   get:
 *     summary: Get a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: comment_id
 *         required: true
 *         description: The ID of the comment to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A comment object
 */
router.get('/:comment_id', getCommentById);

/**
 * @swagger
 * /comments/task/{task_id}:
 *   get:
 *     summary: Get comments by task ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: task_id
 *         required: true
 *         description: The ID of the task to retrieve comments for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of comments for the specified task
 */
router.get('/task/:task_id', getCommentsByTaskId);

/**
 * @swagger
 * /comments/{comment_id}:
 *   put:
 *     summary: Update a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: comment_id
 *         required: true
 *         description: The ID of the comment to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated comment object
 */
router.put('/:comment_id', updateComment);

/**
 * @swagger
 * /comments/{comment_id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: comment_id
 *         required: true
 *         description: The ID of the comment to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 */
router.delete('/:comment_id', deleteComment);

module.exports = router;
