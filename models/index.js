const Auth = require('./auth');
const Campaign = require('./campaign');
const Report = require('./report');
const Task = require('./task');
const User = require('./user');
const UserCampaign = require('./userCampaign');

// One-to-One: Satu Akun hanya punya satu Auth
User.hasOne(Auth, { foreignKey: { name: "userId", allowNull: false }, as: "Auth", onDelete: "CASCADE"});
Auth.belongsTo(User, { foreignKey: { name: "userId", allowNull: false }, as: "User", onDelete: "CASCADE"});

// Many-to-Many: Satu Akun bisa punya banyak Campaign
User.belongsToMany(Campaign, { through: UserCampaign, foreignKey: 'user_id', as: 'campaigns' });
Campaign.belongsToMany(User, { through: UserCampaign, foreignKey: 'campaign_id', as: 'users' });

// One-to-Many: Satu Campaign bisa punya banyak Task
Campaign.hasMany(Task, { foreignKey: 'campaign_id' });
Task.belongsTo(Campaign, { foreignKey: 'campaign_id' });

// One-to-Many: Satu Campaign bisa punya banyak Report
Campaign.hasMany(Report, { foreignKey: 'campaign_id' });
Report.belongsTo(Campaign, { foreignKey: 'campaign_id' });

module.exports = { Auth, Campaign, Report, Task, User };
