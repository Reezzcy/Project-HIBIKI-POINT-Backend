const Auth = require('./auth');
const Campaign = require('./campaign');
const Report = require('./report');
const Task = require('./task');
const User = require('./user');
const Attachment = require('./attachment');
const Notification = require('./notification');
const Comment = require('./comment');
const LogActivity = require('./logActivity');
const Reminder = require('./reminder');
const UserCampaign = require('./userCampaign');
const UserTask = require('./userTask');

// One-to-One: Satu User hanya punya satu Auth
User.hasOne(Auth, { foreignKey: { name: "user_id", allowNull: false }, as: "Auth", onDelete: "CASCADE"});
Auth.belongsTo(User, { foreignKey: { name: "user_id", allowNull: false }, as: "User", onDelete: "CASCADE"});

// Many-to-Many: Banyak User bisa punya banyak Campaign
User.belongsToMany(Campaign, { through: UserCampaign, foreignKey: 'user_id', as: 'campaigns' });
Campaign.belongsToMany(User, { through: UserCampaign, foreignKey: 'campaign_id', as: 'users' });

// Many-to-Many: Banyak User bisa punya banyak Task
User.belongsToMany(Task, { through: UserTask, foreignKey: 'user_id', otherKey: 'task_id', as: 'tasks' });
Task.belongsToMany(User, { through: UserTask, foreignKey: 'task_id', otherKey: 'user_id', as: 'users' });

// One-to-Many: Satu User bisa punya banyak Notification
User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

// One-to-Many: Satu User bisa punya banyak Notification
User.hasMany(Attachment, { foreignKey: 'uploaded_by' });
Attachment.belongsTo(User, { foreignKey: 'uploaded_by' });

// One-to-Many: Satu User bisa punya banyak Task
User.hasMany(Reminder, { foreignKey: 'user_id' });
Reminder.belongsTo(User, { foreignKey: 'user_id' });

// One-to-Many: Satu User bisa punya banyak Comment
User.hasMany(Comment, { foreignKey: 'user_id' });
Comment.belongsTo(User, { foreignKey: 'user_id' });

// One-to-Many: Satu Campaign bisa punya banyak Task
Campaign.hasMany(Task, { foreignKey: 'campaign_id' });
Task.belongsTo(Campaign, { foreignKey: 'campaign_id' });

// One-to-Many: Satu Task bisa punya Banyak Attachment
Task.hasMany(Attachment, {foreignKey: 'task_id'});
Attachment.belongsTo(Task, {foreignKey: 'task_id'});

// One-to-Many: Satu Campaign bisa punya banyak Report
Campaign.hasMany(Report, { foreignKey: 'campaign_id' });
Report.belongsTo(Campaign, { foreignKey: 'campaign_id' });

// One-to-Many: Satu Task bisa punya banyak Comment
Task.hasMany(Comment, {foreignKey: 'task_id'});
Comment.belongsTo(Task, {foreignKey: 'task_id'});

// One-to-Many: Satu Task bisa punya banyak Reminder
Task.hasMany(Reminder, {foreignKey: 'task_id'});
Reminder.belongsTo(Task, {foreignKey: 'task_id'});

// One-to-Many: Satu Task bisa punya banyak Notification
Task.hasMany(Notification, {foreignKey: 'task_id'});
Notification.belongsTo(Task, {foreignKey: 'task_id'});

module.exports = { 
    Auth, 
    Campaign, 
    Report, 
    Task, 
    User, 
    Attachment, 
    Notification,
    Comment,
    LogActivity,
    Reminder,
    UserCampaign,
    UserTask
};
