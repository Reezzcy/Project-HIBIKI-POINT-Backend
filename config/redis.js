require('dotenv').config();
const Redis = require('ioredis');

// Buat koneksi ke Redis 
const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    db: process.env.REDIS_DB,
})

// Cek koneksi
redis.on('connect', () => {
    console.log('Connected to Redis');
});

redis.on('error', (err) => {
    console.log('Redis Error', err);
});

module.exports = redis;