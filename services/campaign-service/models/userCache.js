const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../../shared/config/db');

// Model UserCache
// Model ini merepresentasikan tabel UserCache di database
const UserCache = sequelize.define(
    'UserCache',
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
        tableName: 'UserCache', // Nama tabel di database
        timestamps: true, // Menambahkan createdAt & updatedAt
    }
);

module.exports = UserCache;