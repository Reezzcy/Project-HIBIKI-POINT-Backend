const slowDown = require('express-slow-down');

// Middleware to slow down the API requests
const apiThrottle = slowDown({
    windowMs: 15 * 60 * 1000,
    delayAfter: 5,
    delayMs: () => 500,
    message: 'terlalu banyak percobaan permintaan',
});

module.exports = {
    apiThrottle,
};
