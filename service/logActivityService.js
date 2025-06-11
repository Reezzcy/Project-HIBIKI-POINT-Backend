// Anda bisa letakkan ini di file terpisah, misal: services/logActivityService.js
const redis = require('../config/redis'); // Sesuaikan path ke koneksi redis Anda
const moment = require('moment-timezone');

const saveLogActivity = async (logData) => {
    try {
        const { user_id, activity_type, description } = logData;

        // 1. Validasi input
        if (!user_id || !activity_type || !description) {
            // Lemparkan error agar bisa ditangkap oleh pemanggil fungsi
            throw new Error(
                'user_id, activity_type, and description are required!'
            );
        }

        // 2. Buat objek log
        const logActivityData = {
            user_id,
            activity_type,
            description,
            created_at: moment()
                .tz('Asia/Jakarta')
                .format('YYYY-MM-DD HH:mm:ss'), // Menggunakan zona waktu Jakarta
        };

        // 3. Simpan ke Redis
        await redis.set(
            `log_activity_${user_id}_${Date.now()}`, // Gunakan key yang lebih unik
            JSON.stringify(logActivityData),
            'EX',
            3600
        );

        console.log('Log activity cached successfully!');
        return logActivityData; // Kembalikan data log jika diperlukan
    } catch (error) {
        console.error('Error saving log activity to cache:', error.message);
        // Lemparkan kembali error agar fungsi pemanggil tahu ada masalah
        throw error;
    }
};

// Export fungsi agar bisa diimpor di file lain
module.exports = { saveLogActivity };
