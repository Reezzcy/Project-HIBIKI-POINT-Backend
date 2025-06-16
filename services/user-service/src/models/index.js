const User = require('./user');
const Auth = require('./auth');
const sequelize = require('../config/db');

User.hasOne(Auth, {
    foreignKey: { name: 'user_id', allowNull: false },
    as: 'Auth',
    onDelete: 'CASCADE',
});
Auth.belongsTo(User, {
    foreignKey: { name: 'user_id', allowNull: false },
    as: 'User',
    onDelete: 'CASCADE',
});

module.exports = {
    sequelize,
    User,
    Auth,
};
