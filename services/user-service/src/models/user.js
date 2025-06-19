const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

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
        role: {
            type: DataTypes.ENUM('user', 'admin'),
            allowNull: false,
            defaultValue: 'user',
        },
        avatar_base64: {
            type: DataTypes.TEXT('long'),
            allowNull: true,
        },
    },
    {
        tableName: 'user',
        timestamps: true,
    }
);

module.exports = User;
