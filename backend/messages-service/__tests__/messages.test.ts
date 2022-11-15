import { beforeAll, afterAll, describe, it, expect } from '@jest/globals'
const request = require('supertest')

import app from './../src/app'
import accountsApp from '../../accounts-service/src/app'
import { IMessage } from '../src/models/message'
import messageRepository from '../src/models/messageRepository'
import { MessageStatus } from '../src/models/messageStatus'
import { IAccountEmail } from '../../accounts-service/src/models/accountEmail'

const testDomain = 'jest.test.com'
const testEmail = `jest@${testDomain}`
const testPassword = '123456'
let jwt: string = ''
let testAccountId: number = 0
let testAccountEmailId: number = 0
let testMessageId: number = 0
let testMessageId2: number = 0

beforeAll(async () => {
  jest.setTimeout(60000)

  const testAccount = {
    name: 'jest',
    email: testEmail,
    password: testPassword,
    domain: testDomain
  }
  
  const accountResponse = await request(accountsApp)
    .post('/accounts/')
    .send(testAccount);
  testAccountId = accountResponse.body.id;

  const loginResponse = await request(accountsApp)
    .post('/accounts/login')
    .send({
      email: testEmail,
      password: testPassword
    })
  jwt = loginResponse.body.token

  const testAccountEmail: IAccountEmail = {
    name: 'jest',
    email: testEmail,
    accountId: testAccountId
  }

  const accountEmailResponse = await request(accountsApp)
    .put('/accounts/settings/accountEmails')
    .send(testAccountEmail)
    .set('x-access-token', jwt)

  if (accountEmailResponse.status != 201) {
    throw new Error()
  }

  testAccountEmailId = accountEmailResponse.body.id

  const testMessage = {
    accountId: testAccountId,
    body: 'corpo da mensagem',
    subject: 'assunto da mensagem',
    accountEmailId: testAccountEmailId
  } as IMessage

  const addResult = await messageRepository.add(testMessage, testAccountId);
  testMessageId = addResult.id!
})

afterAll(async () => {
  jest.setTimeout(60000)

  await messageRepository.removeById(testMessageId, testAccountId)
  await messageRepository.removeById(testMessageId2 | 0, testAccountId)

  await request(accountsApp)
    .delete(`/accounts/settings/accountEmails/${testAccountEmailId}/?force=true`)
    .set('x-access-token', jwt)

  await request(accountsApp)
    .delete(`/accounts/${testAccountId}?force=true`)
    .set('x-access-token', jwt)

  await request(accountsApp)
    .post('/accounts/logout')
    .set('x-access-token', jwt)
})

describe('Testando rotas de messages service', () => {
  it('GET /messages/ - Deve retornar statusCode 200', async () => {
    const result = await request(app)
      .get('/messages/')
      .set('x-access-token', jwt)

    expect(result.status).toEqual(200)
    expect(Array.isArray(result.body)).toBeTruthy()
  })

  it('GET /messages/ - Deve retornar statusCode 401', async () => {
    const result = await request(app)
      .get('/messages/')

    expect(result.status).toEqual(401)
  })

  it('GET /messages/:id - Deve retornar statusCode 200', async () => {
    const result = await request(app)
      .get('/messages/'+ testMessageId)
      .set('x-access-token', jwt)

    expect(result.status).toEqual(200)
    expect(result.body.id).toEqual(testMessageId)
  })

  it('GET /messages/:id - Deve retornar statusCode 401', async () => {
    const result = await request(app).get('/messages/'+ testMessageId)
    expect(result.status).toEqual(401)
  })

  it('GET /messages/:id - Deve retornar statusCode 400', async () => {
    const result = await request(app).get('/messages/abc').set('x-access-token', jwt)
    expect(result.status).toEqual(400)
  })

  it('GET /messages/:id - Deve retornar statusCode 404', async () => {
    const result = await request(app)
      .get('/messages/-1')
      .set('x-access-token', jwt)
    expect(result.status).toEqual(404)
  })

  it('POST /messages/ - Deve retornar statusCode 201', async () => {
    const payload = {
      accountId: testAccountId,
      body: 'corpo da mensagem post test',
      subject: 'assunto da mensagem post test',
      accountEmailId: testAccountEmailId
    } as IMessage

    const result = await request(app)
      .post('/messages/')
      .set('x-access-token', jwt)
      .send(payload)

    testMessageId2 = parseInt(result.body.id)
    expect(result.status).toEqual(201)
    expect(result.body.id).toBeTruthy()
  })

  it('POST /messages/ - Deve retornar statusCode 422', async () => {
    const payload = {
      street: 'minha rua',
    }

    const result = await request(app)
      .post('/messages/')
      .set('x-access-token', jwt)
      .send(payload)

    expect(result.status).toEqual(422)
  })

  it('POST /messages/ - Deve retornar statusCode 401', async () => {
    const payload = {
      accountId: testAccountId,
      body: 'corpo da mensagem post test',
      subject: 'assunto da mensagem post test',
    } as IMessage

    const result = await request(app)
      .post('/messages/')
      .send(payload)

    expect(result.status).toEqual(401)
  })

  it('PATCH /messages/:id - Deve retornar statusCode 200', async () => {
    const payload = {
      subject: 'jest alterado'
    } as IMessage

    const result = await request(app)
      .patch(`/messages/${testMessageId}`)
      .set('x-access-token', jwt)
      .send(payload)

    expect(result.status).toEqual(200)
    expect(result.body.subject).toEqual(payload.subject)
  })

  it('PATCH /messages/:id - Deve retornar statusCode 401', async () => {
    const payload = {
      name: 'jest2 patch',
    }

    const result = await request(app)
      .patch(`/messages/${testMessageId}`)
      .send(payload)

    expect(result.status).toEqual(401)
  })

  it('PATCH /messages/:id - Deve retornar statusCode 422', async () => {
    const payload = {
      dasdas: 'jest2 patch',
    }

    const result = await request(app)
      .patch(`/messages/${testMessageId}`)
      .set('x-access-token', jwt)
      .send(payload)

    expect(result.status).toEqual(422)
  })

  it('PATCH /messages/:id - Deve retornar statusCode 404', async () => {
    const payload = {
      subject: 'jest2 patch',
    }

    const result = await request(app)
      .patch(`/messages/-1`)
      .set('x-access-token', jwt)
      .send(payload)

    expect(result.status).toEqual(404)
  })

  it('PATCH /messages/:id - Deve retornar statusCode 400', async () => {
    const payload = {
      subject: 'jest2 patch',
    }

    const result = await request(app)
      .patch(`/messages/abc`)
      .set('x-access-token', jwt)
      .send(payload)

    expect(result.status).toEqual(400)
  })

  it('DELETE /messages/:id - Deve retornar statusCode 200', async () => {
    const result = await request(app)
      .delete('/messages/' + testMessageId)
      .set('x-access-token', jwt);

    expect(result.status).toEqual(200);
    expect(result.body.status).toEqual(MessageStatus.REMOVED);
  })

  it('DELETE /messages/:id?force=true - Deve retornar statusCode 204', async () => {
    const result = await request(app)
      .delete(`/messages/${testMessageId}?force=true`)
      .set('x-access-token', jwt);

    expect(result.status).toEqual(204);
  })

  it('DELETE /messages/:id - Deve retornar statusCode 403', async () => {
    const result = await request(app)
      .delete('/messages/-1')
      .set('x-access-token', jwt);

    expect(result.status).toEqual(403);
  })
})
