import { afterAll, describe, beforeAll } from '@jest/globals'

const request = require('supertest')

import app from '../src/app'

import { IAccount } from '../src/models/account'
import accountRepository from '../src/models/accountRepository'

import auth from '../src/auth'
import emailService from '../../__commons__/src/clients/emailService'

import accountEmailRepository from '../src/models/accountEmailRepository'
import { IAccountEmail } from '../src/models/accountEmail'

let jwt: string
let testAccountId: number
const testDomain: string = 'settings.com'
const testEmail: string = 'jest@settings.com'
const hashPassword = '$2a$10$ye/d5KSzdLt0TIOpevAtde2mgreLPUpLpnE0vyQJ0iMBVeZyklKSi'

describe('Testando as rotas de accounts/settings', () => {
  beforeAll(async () => {
    jest.setTimeout(60000)

    const testAccount: IAccount = {
      name: 'jest',
      email: testEmail,
      domain: testDomain,
      password: hashPassword
    }
    const result = await accountRepository.add(testAccount)
    testAccountId = result.id!


    jwt = auth.signToken(testAccountId)
    await emailService.createAccountSettings(testDomain)
  })

  it('GET /accounts/settings - Deve retornar statusCode 200', async () => {
    const resultado = await request(app)
      .get('/accounts/settings')
      .set('x-access-token', jwt)

    expect(resultado.status).toEqual(200)
    expect(resultado.body).toBeTruthy()
  })

  it('GET /accounts/settings - Deve retornar statusCode 401', async () => {
    const resultado = await request(app)
      .get('/accounts/settings')

    expect(resultado.status).toEqual(401)
  })

  it('POST /accounts/settings - Deve retornar statusCode 200', async () => {
    const resultado = await request(app)
      .post('/accounts/settings')
      .set('x-access-token', jwt)

    expect(resultado.status).toEqual(200)
    expect(resultado.body).toBeTruthy()
  })

  it('POST /accounts/settings - Deve retornar statusCode 201', async () => {
    const resultado = await request(app)
      .post('/accounts/settings?force=true')
      .set('x-access-token', jwt)

    expect(resultado.status).toEqual(201)
    expect(resultado.body).toBeTruthy()
  })

  it('POST /accounts/settings - Deve retornar statusCode 401', async () => {
    const resultado = await request(app)
      .post('/accounts/settings')

    expect(resultado.status).toEqual(401)
  })
})

const testEmail2: string = 'jest2@settings2.com'
const testDomain2: string = 'settings2.com'
const testEmail3: string = 'jest3@settings2.com'

let testAccountId2: number
let testAccountEmailId: number
let jwt2: string

describe('Testando as rotas de accounts/settings/accountEmails', () => {
  beforeAll(async () => {
    jest.setTimeout(60000)

    const testAccount: IAccount = {
      name: 'jest',
      email: testEmail2,
      domain: testDomain2,
      password: hashPassword
    }
    const result = await accountRepository.add(testAccount)
    testAccountId2 = result.id!

    jwt2 = auth.signToken(testAccountId2)
    await emailService.createAccountSettings(testDomain2)

    const testAccountEmail: IAccountEmail = {
      name: 'jest',
      email: testEmail3,
      accountId: testAccountId2
    }

    const result2 = await accountEmailRepository.add(testAccountEmail)
    testAccountEmailId = result2.id!

    await emailService.addEmailIdentity(testEmail3)
  })


})

afterAll(async () => {
  jest.setTimeout(60000)

  await emailService.removeEmailIdentity(testDomain)
  await emailService.removeEmailIdentity(testDomain2)
  await emailService.removeEmailIdentity(testEmail3)

  await accountRepository.removeByEmail(testEmail)
  await accountRepository.removeByEmail(testEmail2)

  await accountEmailRepository.removeByEmail(testEmail3, testAccountId2)
})