const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const User = require('./user');
const Task = require('./task');

// Model Comment
// Model ini merepresentasikan tabel comment di database
const Comment = sequelize.define(
    'Comment',
    {
        comment_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User, // Nama model yang direferensikan
                key: 'user_id',
            },
        },
        task_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Task,
                key: 'task_id',
            },
        },
        comment_text: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: 'comment', // Nama tabel di database
        timestamps: true, // Menambahkan createdAt dan updatedAt
    }
);

module.exports = Comment;
