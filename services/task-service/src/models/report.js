const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Campaign = require('./campaign');

const Report = sequelize.define(
    'Report',
    {
        report_id: {
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
        total_reach: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        roi: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        report_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
    },
    {
        tableName: 'report',
        timestamps: true,
    }
);

module.exports = Report;
