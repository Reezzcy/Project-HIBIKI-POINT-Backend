const express = require('express');
const router = express.Router();
const calendarController = require('../controller/calendarController');

router.get('/login', calendarController.login);
router.get('/oauth2callback', calendarController.oauthCallback);
router.post('/event', calendarController.addEvent);

module.exports = router;
