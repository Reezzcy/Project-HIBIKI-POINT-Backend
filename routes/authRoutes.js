const express = require('express');

const {
    register,
    login,
    tokenChecker
} = require('../controller/authController');

const { authenticateJWT } = require('../middleware/authenticate'); 

const router = express.Router();

// Register Account
router.post('/register', register);
// Login Account
router.post('/login', authenticateJWT, login);
// Check Token
router.get('/token', authenticateJWT, tokenChecker);

module.exports = router;