const express = require('express');
const router = express.Router();

const {
    addLogActivity,
    getLogActivityFromCache,
    deleteLogActivityFromCache,
    getAllLogActivities,
    getLogActivityById,
    updateLogActivity,
    deleteLogActivity,
} = require('../controller/logActivityController');

// Create a new log activity
router.post('/log-activities', addLogActivity);
// Get all log activities
router.get('/log-activities', getAllLogActivities);
// Get a log activity by ID
router.get('/log-activities/:id', getLogActivityById);
// Update a log activity
router.put('/log-activities/:id', updateLogActivity);
// Delete a log activity
router.delete('/log-activities/:id', deleteLogActivity);
// Get log activity from cache
router.get('/log-activities/cache/:id', getLogActivityFromCache);
// Delete log activity from cache
router.delete('/log-activities/cache/:id', deleteLogActivityFromCache);

module.exports = router;
