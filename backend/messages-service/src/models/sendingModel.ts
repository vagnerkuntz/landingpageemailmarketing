import sequelize, { Optional, Model } from 'sequelize'
import database from 'commons/data/db'
import { ISending } from './sending'

interface ISendingCreationAttributes extends Optional<ISending, 'id'> {}

export interface ISendingModel extends Model<ISending, ISendingCreationAttributes>, ISending {}

const Sending = database.define<ISendingModel>('sending', {
  id: {
    type: sequelize.STRING(36),
    primaryKey: true,
    allowNull: false
  },
  accountId: {
    type: sequelize.INTEGER.UNSIGNED,
    allowNull: false
  },
  messageId: {
    type: sequelize.INTEGER.UNSIGNED,
    allowNull: false
  },
  contactId: {
    type: sequelize.INTEGER.UNSIGNED,
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

export default Sending