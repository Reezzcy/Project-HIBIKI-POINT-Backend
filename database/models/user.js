const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

// Model User
// Model ini merepresentasikan tabel user di database
const User = sequelize.define(
    'User',
    {
        user_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        status: {
            type: DataTypes.ENUM(['Active', 'Inactive']),
            allowNull: false,
            defaultValue: 'Active',
        },
        avatar_base64: {
            type: DataTypes.TEXT('long'),
            allowNull: true,
        },
    },
    {
        tableName: 'user', // Nama tabel di database
        timestamps: true, // Menambahkan createdAt & updatedAt
    }
);

module.exports = User;
