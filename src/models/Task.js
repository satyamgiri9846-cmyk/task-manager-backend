import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../utils/db.js';
import { User } from './User.js';
import { Board } from './Board.js';

export class Task extends Model {}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('TODO', 'IN_PROGRESS', 'DONE'),
      allowNull: false,
      defaultValue: 'TODO',
    },
  },
  {
    sequelize,
    modelName: 'Task',
    tableName: 'tasks',
    timestamps: true,
  }
);

Board.hasMany(Task, { foreignKey: 'boardId', onDelete: 'CASCADE' });
Task.belongsTo(Board, { foreignKey: 'boardId' });

User.hasMany(Task, { foreignKey: 'createdBy' });
Task.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
