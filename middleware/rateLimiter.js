const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: 'terlalu banyak permintaan, coba lagi setelah 15 menit',
    standardHeaders: true,
    legacyHeaders: false
});

const loginLimiter = rateLimit({
    windowMs: 5* 60 * 1000,
    max: 5,
    message: 'Terlalu banyak percobaan login, coba lagi setelah 5 menit.'
});

module.exports = {
    apiLimiter,
    loginLimiter
};