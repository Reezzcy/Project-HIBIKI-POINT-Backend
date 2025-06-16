const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Notification = sequelize.define(
    'Notification',
    {
        notification_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            // references: {
            //     model: User,
            //     key: 'user_id',
            // },
        },
        task_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            // references: {
            //     model: Task,
            //     key: 'task_id',
            // },
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        body: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        is_read: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM(['Active', 'Inactive']),
            allowNull: false,
            defaultValue: 'Active',
        },
    },
    {
        tableName: 'notification',
        timestamps: true,
    }
);

module.exports = { Notification, sequelize };
