const express = require('express');
const router = express.Router();

const {
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
} = require('../controller/logActivityController');

// Create a new log activity
router.post('/log-activities', addLogActivity);
// Get all log activities
router.get('/log-activities', getAllLogActivities);
// Get a log activity by ID
router.get('/log-activities/:id', getLogActivityById);
// Update a log activity
router.put('/log-activities/:id', updateLogActivity);
// Delete a log activity by ID
router.delete('/log-activities/:id', deleteLogActivityById);
// Get log activity from cache by user_id
router.get('/log-activities/cache/:user_id', getLogActivityFromCache);
// Delete log activity from cache by user_id
router.delete('/log-activities/cache/:user_id', deleteLogActivityFromCache);
// Get log activities by user_id and optional date range
router.get('/log-activities/user/:user_id', getLogActivity);
// Get log activity from database by user_id
router.get('/log-activities/db/:user_id', getLogActivityFromDb);
// Delete log activity from database by user_id
router.delete('/log-activities/db/:user_id', deleteLogActivityFromDb);
// Delete log activities by date range
router.delete('/log-activities/db/date', deleteLogActivityByDate);
// Delete all log activities from database
router.delete('/log-activities/db', deleteAllLogActivities);
// Delete log activity by user ID from database
router.delete('/log-activities/db/user/:user_id', deleteLogActivityByUserId);

module.exports = router;
