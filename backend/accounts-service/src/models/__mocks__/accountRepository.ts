import { IAccount } from '../account'
import { AccountStatus } from '../accountStatus'
import { IAccountEmail } from '../accountEmail'

const accountOk: IAccount = {
  domain: 'jest.com',
  email: 'jest@jest.com',
  password: '$2a$10$ye/d5KSzdLt0TIOpevAtde2mgreLPUpLpnE0vyQJ0iMBVeZyklKSi',
  id: 1,
  name: 'jest',
  status: AccountStatus.ACTIVE
}

function add(account: IAccount) {
  account.id = 1;
  return account
}

function findAll(includeRemoved: boolean) {
  const accountNotOk: IAccount = {
    domain: 'jest2.com',
    email: 'jest2@jest2.com',
    password: '$2a$10$ye/d5KSzdLt0TIOpevAtde2mgreLPUpLpnE0vyQJ0iMBVeZyklKSi',
    id: 2,
    name: 'jest2',
    status: AccountStatus.REMOVED
  }

  if (includeRemoved) {
    return [accountOk, accountNotOk]
  } else {
    return [accountOk]
  }
}

function set(id: number, account: IAccount) {
  if (id < 1) {
    return null
  }

  const originalAccount = findAll(false)[0]

  if (account.name) {
    originalAccount.name = account.name
  }

  if (account.status) {
    originalAccount.status = account.status
  }

  if (account.password) {
    originalAccount.password = account.password
  }

  return originalAccount
}

function findById(id: number) {
  if (id < 1) {
    return null
  }

  accountOk.id = id

  return accountOk
}

function remove(id: number) {
  if (id < 1) {
    return null
  }

  return {}
}

function findByIdWithEmails(id: number) {
  accountOk.id = id
  accountOk.get = (param: string, options: { plain: boolean}) => {
    const accountEmails: IAccountEmail[] = []
    accountEmails.push({
      accountId: id,
      email: 'jest@jest.com',
      name: 'Jest'
    })
    return accountEmails
  }

  return accountOk
}

function findByEmail(email: string) {
  if (!email || email.indexOf('@') === -1) {
    return null
  }

  return accountOk
}

export default {
  add,
  findAll,
  set,
  findById,
  remove,
  findByIdWithEmails,
  findByEmail
}