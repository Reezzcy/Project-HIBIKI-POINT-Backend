const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Task = require('./task');

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
            // references: {
            //     model: User, // Nama model yang direferensikan
            //     key: 'user_id',
            // },
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
        tableName: 'comment',
        timestamps: true,
    }
);

module.exports = Comment;
