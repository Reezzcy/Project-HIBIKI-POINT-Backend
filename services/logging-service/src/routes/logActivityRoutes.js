const express = require('express');
const router = express.Router();

const {
    getLogActivity,
    getLogActivityFromDb,
    getLogActivityById,
    getAllLogActivities,
} = require('../controllers/logActivityController');

/**
 * @swagger
 * tags:
 *   name: LogActivities
 *   description: API for managing log activities
 */
router.get('/log-activities', getAllLogActivities);

/**
 * @swagger
 * /log-activities:
 *   get:
 *     summary: Get all log activities
 *     tags: [LogActivities]
 *     responses:
 *       200:
 *         description: A list of log activities
 */
router.get('/log-activities/:id', getLogActivityById);

/**
 * @swagger
 * /log-activities/db/{user_id}:
 *   get:
 *     summary: Get log activities from the database by user ID
 *     tags: [LogActivities]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: The ID of the user to retrieve log activities for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of log activities for the specified user
 */
router.get('/log-activities/db/:user_id', getLogActivityFromDb);

/**
 * @swagger
 * /log-activities/user/{user_id}:
 *   get:
 *     summary: Get log activities by user ID
 *     tags: [LogActivities]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: The ID of the user to retrieve log activities for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of log activities for the specified user
 */
router.get('/log-activities/user/:user_id', getLogActivity);

module.exports = router;
