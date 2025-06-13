const rateLimit = require('express-rate-limit');

// Middleware to limit the number of requests to the API
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: 'terlalu banyak permintaan, coba lagi setelah 15 menit',
    standardHeaders: true,
    legacyHeaders: false,
});

// Middleware to limit the number of login attempts
const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    message: 'Terlalu banyak percobaan login, coba lagi setelah 5 menit.',
});

module.exports = {
    apiLimiter,
    loginLimiter,
};
