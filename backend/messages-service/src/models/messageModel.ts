import sequelize, { Model, Optional } from 'sequelize'
import database from 'commons/data/db'
import { IMessage } from './message'
import Sending from './sendingModel'

interface IMessageCreationAttributes extends Optional<IMessage, 'id'>{}

export interface IMessageModel extends Model<IMessage, IMessageCreationAttributes>, IMessage{}

const Message = database.define<IMessageModel>('message', {
  id: {
    type: sequelize.INTEGER.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  accountId: {
    type: sequelize.INTEGER.UNSIGNED,
    allowNull: false,
  },
  accountEmailId: {
    type: sequelize.INTEGER.UNSIGNED,
    allowNull: false
  },
  subject: {
    type: sequelize.STRING,
    allowNull: false
  },
  body: {
    type: sequelize.TEXT,
    allowNull: false
  },
  sendDate: {
    type: sequelize.DATE,
    allowNull: true
  },
  status: {
    type: sequelize.SMALLINT.UNSIGNED,
    allowNull: false,
    defaultValue: 100
  }
})

Message.hasMany(Sending, {
  constraints: true,
  foreignKey: 'messageId'
})

Sending.belongsTo(Message, {
  constraints: true,
  foreignKey: 'messageId'
})

export default Message;