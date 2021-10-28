import Sequelize, { Model, Optional } from 'sequelize'
import database from 'commons/data/db'
import { IAccount } from './account'

interface IAccountCreationAttributes extends Optional<IAccount, 'id'>{}

export interface IAccountModel extends Model<IAccount, IAccountCreationAttributes>, IAccount {}

export default database.define<IAccountModel>('account', {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  status: {
    type: Sequelize.SMALLINT.UNSIGNED,
    allowNull: false,
    defaultValue: 100
  },
  domain: {
    type: Sequelize.STRING,
    allowNull: false
  }
})