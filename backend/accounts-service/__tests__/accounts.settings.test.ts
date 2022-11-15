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
let jwt2: string

let testAccountId: number
let testAccountId2: number

let testAccountEmailId: number
let testAccountEmailId2: number

const testDomain: string = 'settings.com'
const testDomain2: string = 'settings2.com'

const testEmail: string = 'jest@settings.com'
const testEmail2: string = 'jest2@settings2.com'
const testEmail3: string = 'jest3@settings2.com'
const testEmail4: string = 'jest4@settings2.com'
const testEmail5: string = 'jest5@settings2.com'

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
    const result = await request(app)
      .get('/accounts/settings')
      .set('x-access-token', jwt)

    expect(result.status).toEqual(200)
    expect(result.body).toBeTruthy()
  })

  it('GET /accounts/settings - Deve retornar statusCode 401', async () => {
    const result = await request(app)
      .get('/accounts/settings')

    expect(result.status).toEqual(401)
  })

  it('POST /accounts/settings - Deve retornar statusCode 200', async () => {
    const result = await request(app)
      .post('/accounts/settings')
      .set('x-access-token', jwt)

    expect(result.status).toEqual(200)
    expect(result.body).toBeTruthy()
  })

  it('POST /accounts/settings?force=true - Deve retornar statusCode 201', async () => {
    const result = await request(app)
      .post('/accounts/settings?force=true')
      .set('x-access-token', jwt)

    expect(result.status).toEqual(201)
    expect(result.body).toBeTruthy()
  })

  it('POST /accounts/settings - Deve retornar statusCode 401', async () => {
    const result = await request(app)
      .post('/accounts/settings')

    expect(result.status).toEqual(401)
  })
})

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

    const testAccountEmail2 : IAccountEmail = {
      name: 'jest',
      email: testEmail5,
      accountId: testAccountId2
    }
    const result3 = await accountEmailRepository.add(testAccountEmail2);
    testAccountEmailId2 = result3.id!;

    await emailService.addEmailIdentity(testEmail5);
  })

  it('GET /accounts/settings/accountEmails - Deve retornar statusCode 200', async () => {
    const result = await request(app)
      .get('/accounts/settings/accountEmails')
      .set('x-access-token', jwt2);

    expect(result.status).toEqual(200);
    expect(result.body).toBeTruthy();
  })

  it('PUT /accounts/settings/accountEmails - Deve retornar statusCode 201', async () => {
    const payload = {
      name: 'jest',
      email: testEmail4
    } as IAccountEmail;

    const result = await request(app)
      .put('/accounts/settings/accountEmails')
      .send(payload)
      .set('x-access-token', jwt2);

    expect(result.status).toEqual(201);
    expect(result.body).toBeTruthy();
  })

  it('PUT /accounts/settings/accountEmails - Deve retornar statusCode 400', async () => {
    const payload = {
      name: 'jest',
      email: testEmail3
    } as IAccountEmail;

    const result = await request(app)
      .put('/accounts/settings/accountEmails')
      .send(payload)
      .set('x-access-token', jwt2);

    expect(result.status).toEqual(400);
  })

  it('PUT /accounts/settings/accountEmails - Deve retornar statusCode 401', async () => {
    const payload = {
      name: 'jest',
      email: testEmail4
    } as IAccountEmail;

    const result = await request(app)
      .put('/accounts/settings/accountEmails')
      .send(payload);

    expect(result.status).toEqual(401);
  })

  it('PUT /accounts/settings/accountEmails - Deve retornar statusCode 403', async () => {
    const payload = {
      name: 'jest',
      email: testEmail3 + ".br"
    } as IAccountEmail;

    const result = await request(app)
      .put('/accounts/settings/accountEmails')
      .send(payload)
      .set('x-access-token', jwt2);

    expect(result.status).toEqual(403);
  })

  it('PUT /accounts/settings/accountEmails - Deve retornar statusCode 422', async () => {
    const payload = {
      street: 'jest',
    };

    const result = await request(app)
      .put('/accounts/settings/accountEmails')
      .send(payload)
      .set('x-access-token', jwt2);

    expect(result.status).toEqual(422);
  })

  it('PATCH /accounts/settings/accountEmails/:id - Deve retornar statusCode 200', async () => {
    const payload = {
      name: 'new name',
    };

    const result = await request(app)
      .patch('/accounts/settings/accountEmails/' + testAccountEmailId)
      .send(payload)
      .set('x-access-token', jwt2);

    expect(result.status).toEqual(200);
    expect(result.body.name).toEqual('new name');
  })

  it('PATCH /accounts/settings/accountEmails/:id - Deve retornar statusCode 400', async () => {
    const payload = {
      name: 'new name',
    };

    const result = await request(app)
      .patch('/accounts/settings/accountEmails/abc')
      .send(payload)
      .set('x-access-token', jwt2);

    expect(result.status).toEqual(400);
  })

  it('PATCH /accounts/settings/accountEmails/:id - Deve retornar statusCode 401', async () => {
    const payload = {
      name: 'new name',
    };

    const result = await request(app)
      .patch('/accounts/settings/accountEmails/abc')
      .send(payload);

    expect(result.status).toEqual(401);
  })

  it('PATCH /accounts/settings/accountEmails/:id - Deve retornar statusCode 404', async () => {
    const payload = {
      name: 'new name',
    };

    const result = await request(app)
      .patch('/accounts/settings/accountEmails/-1')
      .send(payload)
      .set('x-access-token', jwt2);

    expect(result.status).toEqual(404);
  })

  it('PATCH /accounts/settings/accountEmails/:id - Deve retornar statusCode 422', async () => {
    const payload = {
      street: 'new street',
    };

    const result = await request(app)
      .patch('/accounts/settings/accountEmails/' + testAccountEmailId)
      .send(payload)
      .set('x-access-token', jwt2);

    expect(result.status).toEqual(422);
  })

  it('DELETE /accounts/settings/accountEmails/:id - Deve retornar statusCode 200', async () => {
    const result = await request(app)
      .delete('/accounts/settings/accountEmails/' + testAccountEmailId2)
      .set('x-access-token', jwt2);

    expect(result.status).toEqual(200);
  })

  it('DELETE /accounts/settings/accountEmails/:id - Deve retornar statusCode 400', async () => {
    const result = await request(app)
      .delete('/accounts/settings/accountEmails/abc')
      .set('x-access-token', jwt2);

    expect(result.status).toEqual(400);
  })

  it('DELETE /accounts/settings/accountEmails/:id - Deve retornar statusCode 401', async () => {
    const result = await request(app)
      .delete('/accounts/settings/accountEmails/' + testAccountEmailId2);

    expect(result.status).toEqual(401);
  })

  it('DELETE /accounts/settings/accountEmails/:id - Deve retornar statusCode 404', async () => {
    const result = await request(app)
      .delete('/accounts/settings/accountEmails/-1')
      .set('x-access-token', jwt2);

    expect(result.status).toEqual(404);
  })
})

afterAll(async () => {
  jest.setTimeout(60000)

  await emailService.removeEmailIdentity(testDomain)
  await emailService.removeEmailIdentity(testDomain2)

  await emailService.removeEmailIdentity(testEmail)
  await emailService.removeEmailIdentity(testEmail2)
  await emailService.removeEmailIdentity(testEmail3)
  await emailService.removeEmailIdentity(testEmail4)
  await emailService.removeEmailIdentity(testEmail5)

  await accountEmailRepository.removeByEmail(testEmail, testAccountId)
  await accountEmailRepository.removeByEmail(testEmail2, testAccountId2)
  await accountEmailRepository.removeByEmail(testEmail3, testAccountId2)
  await accountEmailRepository.removeByEmail(testEmail4, testAccountId2)
  await accountEmailRepository.removeByEmail(testEmail5, testAccountId2)

  await accountRepository.removeByEmail(testEmail)
  await accountRepository.removeByEmail(testEmail2)
  await accountRepository.removeByEmail(testEmail3)
  await accountRepository.removeByEmail(testEmail4)
  await accountRepository.removeByEmail(testEmail5)
})