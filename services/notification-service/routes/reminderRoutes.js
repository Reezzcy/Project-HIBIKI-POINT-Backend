const express = require('express');
const router = express.Router();

const {
    addReminder,
    getReminderFromCache,
    deleteReminderFromCache,
    getAllReminders,
    getReminderById,
    updateReminder,
    deleteReminder,
} = require('../controller/reminderController');

// Create a new reminder
router.post('/reminders', addReminder);
// Get all reminders
router.get('/reminders', getAllReminders);
// Get a reminder by ID
router.get('/reminders/:id', getReminderById);
// Update a reminder
router.put('/reminders/:id', updateReminder);
// Delete a reminder
router.delete('/reminders/:id', deleteReminder);
// Get reminder from cache
router.get('/reminders/cache/:id', getReminderFromCache);
// Delete reminder from cache
router.delete('/reminders/cache/:id', deleteReminderFromCache);

module.exports = router;
