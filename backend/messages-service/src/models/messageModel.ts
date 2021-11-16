import sequelize, { Model, Optional } from 'sequelize'
import database from 'commons/data/db'
import { IMessage } from './message'

interface IMessageCreationAttributes extends Optional<IMessage, 'id'> {}

export interface IMessageModel extends Model<IMessage, IMessageCreationAttributes>, IMessage {}

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
  subject: {
    type: sequelize.STRING,
    allowNull: false
  },
  body: {
    type: sequelize.STRING,
    allowNull: false
  },
  status: {
    type: sequelize.SMALLINT.UNSIGNED,
    allowNull: false,
    defaultValue: 100
  },
  sendDate: {
    type: sequelize.DATE,
    allowNull: true
  }
})

Message.sync();

export default Message;