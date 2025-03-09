const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Report = sequelize.define('Report', {
    report_id: {
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
    total_reach: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    roi: {
        type: DataTypes.STRING,
        allowNull: false
    },
    report_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
}, {
    tableName: 'report', // Nama tabel di database
    timestamps: true // Menambahkan createdAt & updatedAt
});

module.exports = Report;