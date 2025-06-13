const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

// Model LogActivity
// Model ini merepresentasikan tabel log_activity di database
const LogActivity = sequelize.define(
    'LogActivity',
    {
        log_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'User', // Nama model yang direferensikan
                key: 'user_id',
            },
        },
        activity_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        activity_description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        tableName: 'log_activity', // Nama tabel di database
        timestamps: true, // Menambahkan createdAt dan updatedAt
    }
);

module.exports = LogActivity;
