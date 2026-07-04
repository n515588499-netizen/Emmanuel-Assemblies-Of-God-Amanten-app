const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Project = sequelize.define('Project', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  committee_id: { type: DataTypes.UUID, allowNull: true },
  status: { type: DataTypes.STRING, allowNull: false },
  budget: { type: DataTypes.DECIMAL(12,2), allowNull: true },
  tasks: { type: DataTypes.JSONB, allowNull: true }
}, {
  tableName: 'projects',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Project;
