require('dotenv').config({ path: '../../.env' });
const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');

const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB } = process.env;

async function initializeDatabase() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: MYSQL_HOST || 'localhost',
            user: MYSQL_USER,
            password: MYSQL_PASSWORD,
        });

        const [rows] = await connection.execute(
            `SHOW DATABASES LIKE '${MYSQL_DB}'`
        );

        if (rows.length === 0) {
            console.log(
                `Database '${MYSQL_DB}' tidak ditemukan. Membuat database...`
            );
            await connection.execute(
                `CREATE DATABASE IF NOT EXISTS \`${MYSQL_DB}\``
            );
            console.log(`Database '${MYSQL_DB}' berhasil dibuat.`);
        }

        console.log('Verifikasi database selesai.');
    } catch (error) {
        console.error('Gagal memeriksa atau membuat database:', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

const db = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PASSWORD, {
    host: MYSQL_HOST || 'localhost',
    dialect: 'mysql',
    // logging: false,
});

async function connectSequelize() {
    await initializeDatabase();
    try {
        await db.authenticate();
        console.log(
            'Notification-Service berhasil terhubung ke MySQL (melalui Sequelize).'
        );
    } catch (err) {
        console.error('Koneksi Sequelize gagal:', err);
        process.exit(1);
    }
}

connectSequelize();

module.exports = db;
