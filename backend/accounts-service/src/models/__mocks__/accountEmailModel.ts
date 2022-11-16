import { IAccountEmail } from '../accountEmail'

const SequelizeMock = require('sequelize-mock')
const dbMock = new SequelizeMock()

const accountEmail = {
  id: 1,
  accountId: 1,
  email: 'contato@jest.com',
  name: 'Jest'
} as IAccountEmail

const AccountEmailMock = dbMock.define('accountEmail', accountEmail)

AccountEmailMock.$queryInterface.$useHandler((query: any, queryOptions: any, done: any) => {
  if (query === 'findOne') {
    const id = queryOptions[0].where.id as number
    const accountId = queryOptions[0].where.accountid as number

    if (id < 1 || accountId < 1) {
      return null
    }

    return AccountEmailMock.build(accountEmail)
  }
})

export default AccountEmailMock