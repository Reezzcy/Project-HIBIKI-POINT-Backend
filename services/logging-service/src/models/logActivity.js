const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

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
            // references: {
            //     model: 'User',
            //     key: 'user_id',
            // },
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
        tableName: 'log_activity',
        timestamps: true,
    }
);

module.exports = { LogActivity, sequelize };
