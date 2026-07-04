const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Ministry = sequelize.define('Ministry', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: { type: DataTypes.STRING, allowNull: false },
  leader_id: { type: DataTypes.UUID, allowNull: true }
}, {
  tableName: 'ministries',
  underscored: true,
  timestamps: false
});

module.exports = Ministry;
