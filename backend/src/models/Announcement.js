const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Announcement = sequelize.define('Announcement', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  target_audience: { type: DataTypes.STRING, allowNull: false },
  target_value: { type: DataTypes.UUID, allowNull: true },
  content: { type: DataTypes.TEXT, allowNull:false },
  created_by: { type: DataTypes.UUID, allowNull: true }
}, {
  tableName: 'announcements',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Announcement;
