const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const User = require('./user');

// Model Campaign
// Model ini merepresentasikan tabel campaign di database
const Campaign = sequelize.define(
    'Campaign',
    {
        campaign_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'user_id',
            },
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        budget: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM(['Draft', 'Published', 'Completed']),
            allowNull: false,
            defaultValue: 'Draft',
        },
        start_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        end_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
    },
    {
        tableName: 'campaign', // Nama tabel di database
        timestamps: true, // Menambahkan createdAt & updatedAt
    }
);

module.exports = Campaign;
