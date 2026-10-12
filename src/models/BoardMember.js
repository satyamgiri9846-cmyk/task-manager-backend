import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../utils/db.js';
import { User } from './User.js';
import { Board } from './Board.js';

export class BoardMember extends Model {}

BoardMember.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    role: {
      type: DataTypes.ENUM('OWNER', 'MEMBER'),
      allowNull: false,
      defaultValue: 'MEMBER',
    },
  },
  {
    sequelize,
    modelName: 'BoardMember',
    tableName: 'board_members',
    timestamps: true,
  }
);

User.belongsToMany(Board, { through: BoardMember, foreignKey: 'userId' });
Board.belongsToMany(User, { through: BoardMember, foreignKey: 'boardId' });

User.hasMany(BoardMember, { foreignKey: 'userId' });
Board.hasMany(BoardMember, { foreignKey: 'boardId' });
BoardMember.belongsTo(User, { foreignKey: 'userId' });
BoardMember.belongsTo(Board, { foreignKey: 'boardId' });
