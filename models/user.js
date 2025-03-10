const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'users', // Nama tabel di database
    timestamps: true // Menambahkan createdAt & updatedAt
});

module.exports = User;
