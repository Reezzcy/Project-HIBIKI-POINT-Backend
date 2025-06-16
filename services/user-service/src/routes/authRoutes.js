const express = require('express');

const {
    register,
    login,
    tokenChecker,
    googleLogin,
    googleCallback,
} = require('../controllers/authController');

const { authenticateJWT } = require('../middleware/authenticate');

const router = express.Router();

/**
 * @swagger
 *  auth/register:
 *   post:
 *     summary: User registration
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/token:
 *   get:
 *     summary: Check token validity
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 */
router.get('/token', authenticateJWT, tokenChecker);

/**
 * @swagger
 * /auth/google/login:
 *   post:
 *     summary: Initiate Google login
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Redirects to Google for authentication
 */
router.post('/google/login', googleLogin);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google authentication callback
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully authenticated with Google
 */
router.get('/google/callback', googleCallback);

module.exports = router;
