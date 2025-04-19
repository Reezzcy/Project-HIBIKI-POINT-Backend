const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Task = require('./task');
const User = require('./user');

// Model Reminder
// Model ini merepresentasikan tabel reminder di database
const Reminder = sequelize.define(
    'Reminder',
    {
        reminder_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        task_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Task, // Nama model yang direferensikan
                key: 'task_id',
            },
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User, // Nama model yang direferensikan
                key: 'user_id',
            },
        },
        reminder_text: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        reminder_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        tableName: 'reminder', // Nama tabel di database
        timestamps: true, // Menambahkan createdAt dan updatedAt
    }
);

module.exports = Reminder;
