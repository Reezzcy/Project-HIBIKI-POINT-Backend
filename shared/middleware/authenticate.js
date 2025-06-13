const jwt = require('jsonwebtoken');
const { User } = require('../database/models');

// Middleware to authenticate JWT tokens
const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    // Check if the token is provided in the Authorization header
    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    // Verify the token and extract user information
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.id);

        // Check if the user exists in the database
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

module.exports = { authenticateJWT };
