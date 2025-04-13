require('dotenv').config();
const Redis = require('ioredis');

// Buat koneksi ke Redis 
const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    db: process.env.REDIS_DB,
})

// Cek koneksi
redis.on('connect', () => console.log('Redis connected'));
redis.on('error', err => console.error('Redis error:', err));

module.exports = redis;