const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Task = require('./task');
const User = require('./user');

// Model Attachment
// Model ini merepresentasikan tabel attachment di database
const Attachment = sequelize.define(
    'Attachment',
    {
        attachment_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        task_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Task,
                key: 'task_id',
            },
        },
        file: {
            type: DataTypes.TEXT('long'),
            allowNull: true,
        },
        uploaded_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'user_id',
            },
        },
    },
    {
        tableName: 'attachment', // Nama tabel di database
        timestamps: true, // Menambahkan createdAt & updatedAt
    }
);

module.exports = Attachment;
