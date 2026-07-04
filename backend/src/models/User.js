const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'member'), defaultValue: 'member', allowNull: false },
  ministry_id: { type: DataTypes.UUID, allowNull: true },
  profile_photo_url: { type: DataTypes.TEXT, allowNull: true },
  birthday: { type: DataTypes.DATEONLY, allowNull: true },
  contact_info: { type: DataTypes.JSONB, allowNull: true }
}, {
  tableName: 'users',
  underscored: true,
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});

module.exports = User;
