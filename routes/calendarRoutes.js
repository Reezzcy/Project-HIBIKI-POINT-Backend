const express = require('express');
const router = express.Router();
const calendarController = require('../controller/calendarController');

// Define routes for calendar-related operations
router.get('/login', calendarController.login);
// Redirect to Google OAuth2 login
router.get('/oauth2callback', calendarController.oauthCallback);
// Get the list of calendars
router.post('/event', calendarController.addEvent);

module.exports = router;
