const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Task = require('./task');

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
            // references: {
            //     model: User,
            //     key: 'user_id',
            // },
        },
    },
    {
        tableName: 'attachment',
        timestamps: true,
    }
);

module.exports = Attachment;
