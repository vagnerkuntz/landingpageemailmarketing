import sequelize, { Model, Optional } from 'sequelize'
import database from 'commons/data/db'
import { IContact } from './contact'

interface IContactCreationAttributes extends Optional<IContact, 'id'> {}

export interface IContactModel extends Model<IContact, IContactCreationAttributes>, IContact {}

export default database.define<IContactModel>('contact', {
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
  name: {
    type: sequelize.STRING,
    allowNull: true
  },
  email: {
    type: sequelize.STRING,
    allowNull: false
  },
  phone: {
    type: sequelize.STRING,
    allowNull: true,
  },
  status: {
    type: sequelize.SMALLINT.UNSIGNED,
    allowNull: false,
    defaultValue: 100
  }
}, {
  indexes: [{
    unique: true,
    fields: ['accountId', 'email']
  }]
})