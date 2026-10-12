import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../utils/db.js';
import { User } from './User.js';

export class Board extends Model {}

Board.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Board',
    tableName: 'boards',
    timestamps: true,
  }
);

// Whoever creates the board is its owner.
User.hasMany(Board, { foreignKey: 'ownerId' });
Board.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });
