const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');

const Auth = sequelize.define(
    'Auth',
    {
        auth_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [6, 100],
            },
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'user_id',
            },
        },
    },
    {
        tableName: 'auth',
        timestamps: true,
    }
);

module.exports = Auth;
