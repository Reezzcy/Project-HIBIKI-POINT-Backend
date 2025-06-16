const express = require('express');
const router = express.Router();
const { extractUserFromHeader } = require('../middleware/extractUser');

const {
    postTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    getTasksByCampaignId,
    getTasksByAssignee,
    getTasksByCreator,
    getTasksByStatus,
} = require('../controllers/taskController');

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: API for managing tasks in campaigns
 */
router.post('/', extractUserFromHeader, postTask);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: A list of tasks
 */
router.get('/', getAllTasks);

/**
 * @swagger
 * /tasks/{task_id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: task_id
 *         required: true
 *         description: The ID of the task to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A task object
 */
router.get('/:task_id', getTaskById);

/**
 * @swagger
 * /tasks/campaign/{campaign_id}:
 *   get:
 *     summary: Get tasks by campaign ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: campaign_id
 *         required: true
 *         description: The ID of the campaign to retrieve tasks for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of tasks for the specified campaign
 */
router.get('/campaign/:campaign_id', getTasksByCampaignId);

/**
 * @swagger
 * /tasks/{task_id}:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: task_id
 *         required: true
 *         description: The ID of the task to update
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The updated task object
 */
router.put('/:task_id', extractUserFromHeader, updateTask);

/**
 * @swagger
 * /tasks/{task_id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: task_id
 *         required: true
 *         description: The ID of the task to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A message confirming deletion
 */
router.delete('/:task_id', extractUserFromHeader, deleteTask);

/**
 * @swagger
 * /tasks/assignee/{user_id}:
 *   get:
 *     summary: Get tasks by assignee ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: The ID of the user assigned to the tasks
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of tasks assigned to the specified user
 */
router.get('/assignee/:user_id', getTasksByAssignee);

/**
 * @swagger
 * /tasks/creator/{creator_id}:
 *   get:
 *     summary: Get tasks by creator ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: creator_id
 *         required: true
 *         description: The ID of the user who created the tasks
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of tasks created by the specified user
 */
router.get('/creator/:creator_id', getTasksByCreator);

/**
 * @swagger
 * /tasks/status/{status}:
 *   get:
 *     summary: Get tasks by status
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         description: The status of the tasks to retrieve (e.g., 'open', 'in-progress', 'completed')
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of tasks with the specified status
 */
router.get('/status/:status', getTasksByStatus);

module.exports = router;
