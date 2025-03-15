const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/db');
const User = require('./user');
const Campaign = require('./campaign');

const UserCampaign = sequelize.define('UserCampaign', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    campaign_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Campaign,
            key: 'campaign_id'
        }
    }
}, {
    tableName: 'user_campaigns',
    timestamps: false
});

module.exports = UserCampaign;
