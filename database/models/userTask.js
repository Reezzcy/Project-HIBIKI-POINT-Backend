const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const User = require('./user');
const Task = require('./task');

// Model UserTask
// Model ini merepresentasikan tabel user_task di database
const UserTask = sequelize.define(
    'UserTask',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'user_id',
            },
        },
        task_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Task,
                key: 'task_id',
            },
        },
    },
    {
        tableName: 'user_task',
        timestamps: false,
    }
);

module.exports = UserTask;
