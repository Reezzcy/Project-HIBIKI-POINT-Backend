const sequelize = require('../config/db');

const Campaign = require('./campaign');
const Task = require('./task');
const Comment = require('./comment');
const Attachment = require('./attachment');
const Reminder = require('./reminder');
const Report = require('./report');
const UserTask = require('./userTask');
const UserCampaign = require('./userCampaign');

// One-to-Many: Satu Campaign bisa punya banyak Task
Campaign.hasMany(Task, { foreignKey: 'campaign_id' });
Task.belongsTo(Campaign, { foreignKey: 'campaign_id' });

// One-to-Many: Satu Task bisa punya Banyak Attachment
Task.hasMany(Attachment, { foreignKey: 'task_id' });
Attachment.belongsTo(Task, { foreignKey: 'task_id' });

// One-to-Many: Satu Campaign bisa punya banyak Report
Campaign.hasMany(Report, { foreignKey: 'campaign_id' });
Report.belongsTo(Campaign, { foreignKey: 'campaign_id' });

// One-to-Many: Satu Task bisa punya banyak Comment
Task.hasMany(Comment, { foreignKey: 'task_id' });
Comment.belongsTo(Task, { foreignKey: 'task_id' });

// One-to-Many: Satu Task bisa punya banyak Reminder
Task.hasMany(Reminder, { foreignKey: 'task_id' });
Reminder.belongsTo(Task, { foreignKey: 'task_id' });

// Many-to-Many: Relasi konseptual dengan User, diimplementasikan di sini
// Relasi ini hanya ada di antara Task dan UserTask (tabel pivot)
// Kita tidak mendefinisikan relasi ke User secara langsung
Task.hasMany(UserTask, { foreignKey: 'task_id' });
UserTask.belongsTo(Task, { foreignKey: 'task_id' });

Campaign.hasMany(UserCampaign, { foreignKey: 'campaign_id' });
UserCampaign.belongsTo(Campaign, { foreignKey: 'campaign_id' });

module.exports = {
    sequelize,
    Campaign,
    Report,
    Task,
    Attachment,
    Comment,
    Reminder,
    UserTask,
    UserCampaign,
};
