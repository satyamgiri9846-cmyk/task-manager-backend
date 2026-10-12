import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../utils/db.js';

export class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING, // stores the HASHED password, never plain text
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('ADMIN', 'MEMBER'),
      allowNull: false,
      defaultValue: 'MEMBER',
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true, // auto-adds createdAt / updatedAt
  }
);
