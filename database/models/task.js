const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Campaign = require('./campaign');
const User = require('./user');

// Model Task
// Model ini merepresentasikan tabel task di database
const Task = sequelize.define(
    'Task',
    {
        task_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        campaign_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Campaign,
                key: 'campaign_id',
            },
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        assigned_to: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'user_id',
            },
        },
        priority: {
            type: DataTypes.ENUM(['Low', 'Medium', 'High']),
            allowNull: false,
            defaultValue: 'Low',
        },
        status: {
            type: DataTypes.ENUM(['Todo', 'In Progress', 'Done']),
            allowNull: false,
        },
        due_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
    },
    {
        tableName: 'task', // Nama tabel di database
        timestamps: true, // Menambahkan createdAt & updatedAt
    }
);

module.exports = Task;
