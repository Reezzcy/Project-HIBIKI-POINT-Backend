const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const User = require('./user');
const Campaign = require('./campaign');

const Notification = sequelize.define('Notification', {
    notification_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id'
        }
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
    body: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM(["Active", "Inactive"]),
        allowNull: false,
        defaultValue: "Active",
    },
}, {
    tableName: 'notification', // Nama tabel di database
    timestamps: true // Menambahkan createdAt & updatedAt
});

module.exports = Notification;
