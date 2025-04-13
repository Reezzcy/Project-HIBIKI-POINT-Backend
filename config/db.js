require('dotenv').config();
const { Sequelize } = require('sequelize');

// Buat koneksi ke MySQL
const db = new Sequelize(
    process.env.MYSQL_DB,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        host: 'localhost',
        dialect: 'mysql'
    }
);

// Cek koneksi
db.authenticate()
    .then(() => console.log('Connected to MySQL'))
    .catch(err => console.error('Connection failed:', err));

module.exports = db;
