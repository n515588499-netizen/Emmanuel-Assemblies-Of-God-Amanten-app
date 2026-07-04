const sequelize = require('../config/db');

const User = require('./User');
const Ministry = require('./Ministry');
const Event = require('./Event');
const Project = require('./Project');
const Announcement = require('./Announcement');

Ministry.hasMany(User, { foreignKey: 'ministry_id' });
User.belongsTo(Ministry, { foreignKey: 'ministry_id' });

Ministry.hasMany(Event, { foreignKey: 'ministry_id' });
Event.belongsTo(Ministry, { foreignKey: 'ministry_id' });

Ministry.hasMany(Project, { foreignKey: 'committee_id' });
Project.belongsTo(Ministry, { foreignKey: 'committee_id' });

module.exports = {
  sequelize,
  User,
  Ministry,
  Event,
  Project,
  Announcement
};
