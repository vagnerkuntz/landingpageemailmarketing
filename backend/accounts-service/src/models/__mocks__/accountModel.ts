import { IAccount } from '../account'
import { AccountStatus } from '../accountStatus'
import { IAccountEmail } from '../accountEmail'

const SequelizeMock = require('sequelize-mock')
const dbMock = new SequelizeMock()

const accountOk = {
  id: 1,
  domain: 'jest.com',
  email: 'contato@jest.com',
  name: 'Jest',
  password: '$2y$10$yvYMv8OZ4cKkOWBLinr9F.o6xf3Za9W0jimtE5BC8Grc4LzeRt3FG',
  status: AccountStatus.ACTIVE,
  accountEmails: [{
    id: 1,
    accountId: 1,
    email: 'jest@jest.com',
    name: 'Jest'
  } as IAccountEmail]
} as IAccount

const accountNotOk = {
  id: 2,
  domain: 'jest2.com',
  email: 'contato@jest2.com',
  name: 'Jest2',
  password: 'a$12$l9qNc89Ao2zYx3/jSb2zAOKFpa4Jl2zysAmYADLDIdGuTLbcQyN7.',
  status: AccountStatus.REMOVED
} as IAccount

const AccountMock = dbMock.define('account', accountOk)

AccountMock.$queryInterface.$useHandler((query: any, queryOptions: any, done: any) => {
  if (query === 'findAll') {
    const status = queryOptions[0].where.status
    if (status) {
      return [accountOk]
    } else {
      return [accountOk, accountNotOk]
    }
  }
})

export default AccountMock
