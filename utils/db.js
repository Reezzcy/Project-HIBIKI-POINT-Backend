const { Sequelize } = require('sequelize');

// Buat koneksi ke MySQL
const db = new Sequelize('hibiki-point', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

// Cek koneksi
db.authenticate()
    .then(() => console.log('Connected to MySQL'))
    .catch(err => console.error('Connection failed:', err));

module.exports = db;