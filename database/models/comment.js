const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const User = require('./user');

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
        comment_text: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
        },
    },
    {
        tableName: 'comment', // Nama tabel di database
        timestamps: false, // Tidak ada createdAt dan updatedAt
    }
);

module.exports = Comment;
