const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Campaign = require('../models/campaign');

const Task = sequelize.define('Task', {
    task_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    campaign_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Campaign,
            key: 'campaign_id'
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    assigned_to: {
        type: DataTypes.STRING,
        allowNull: false
    },
    priority: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    due_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
}, {
    tableName: 'task', // Nama tabel di database
    timestamps: true // Menambahkan createdAt & updatedAt
});

module.exports = Task;
