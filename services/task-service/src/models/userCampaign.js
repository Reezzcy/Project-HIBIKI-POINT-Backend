const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Campaign = require('./campaign');

const UserCampaign = sequelize.define(
    'UserCampaign',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            // references: {
            //     model: User,
            //     key: 'user_id',
            // },
        },
        campaign_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Campaign,
                key: 'campaign_id',
            },
        },
    },
    {
        tableName: 'user_campaign',
        timestamps: false,
    }
);

module.exports = UserCampaign;
