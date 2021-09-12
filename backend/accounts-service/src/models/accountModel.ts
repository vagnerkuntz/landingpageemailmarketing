import Sequelize, { Model, Optional } from 'sequelize'
import database from '../db'
import { IAccount } from './account'

interface IAccountCreationAttributes extends Optional<IAccount, 'id'>{}

export interface IAccountModel extends Model<IAccount, IAccountCreationAttributes>, IAccount {}

const accountModel = database.define<IAccountModel>('account', {
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

function findAll() {
  return accountModel.findAll<IAccountModel>()
}

function findByEmail(email: string) {
  return accountModel.findOne<IAccountModel>({
    where: { email }
  })
}

function findById(id: number) {
    return accountModel.findByPk<IAccountModel>(id)
}

function add(account: IAccount) {
    return accountModel.create(account)
}

async function set(id: number, account: IAccount) {
    const originalAccount = await accountModel.findByPk<IAccountModel>(id)
    
    if (originalAccount !== null) {
        originalAccount.name = account.name
        originalAccount.domain = account.domain
        originalAccount.status = account.status

        if (account.password) {
            originalAccount.password = account.password
        }

        await originalAccount.save()
        return originalAccount
    }

    throw new Error(`Account not found`)
}

export default { findAll, findById, add, set, findByEmail }
