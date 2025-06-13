const express = require('express');

const {
    register,
    login,
    tokenChecker,
    googleLogin,
    googleCallback,
} = require('../controller/authController');

const { authenticateJWT } = require('../middleware/authenticate');

const router = express.Router();

// Register Account
router.post('/register', register);
// Login Account
router.post('/login', login);
// Check Token
router.get('/token', authenticateJWT, tokenChecker);
// Login with Google
router.post('/google/login', googleLogin);
// Google Login Callback
router.get('/google/callback', googleCallback);

module.exports = router;
