const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

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
        created_at: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
        },
    },
    {
        tableName: 'log_activity', // Nama tabel di database
        timestamps: false, // Tidak ada createdAt dan updatedAt
    }
);

module.exports = LogActivity;
