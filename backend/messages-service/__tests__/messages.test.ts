import { beforeAll, afterAll, describe, it, expect } from "@jest/globals"
import supertest from 'supertest'
import app from './../src/app'
import accountsApp from '../../accounts-service/src/app'
import { IMessage } from "../src/models/message"
import messageRepository from "../src/models/messageRepository"

const testEmail = 'jest@accounts.com'
const testPassword = '123456'
let jwt: string = ''
let testAccountId: number = 0
let testMessageId: number = 0
let testMessageId2: number = 0

beforeAll(async () => {
  const testAccount = {
    name: 'jest',
    email: testEmail,
    password: testPassword,
    domain: 'jest.com'
  }
  
  const accountResponse = await supertest(accountsApp)
    .post('/accounts/')
    .send(testAccount);
  
  testAccountId = accountResponse.body.id;

  const loginResponse = await supertest(accountsApp)
    .post('/accounts/login')
    .send({
      email: testEmail,
      password: testPassword
    })

  jwt = loginResponse.body.token

  const testMessage = {
    accountId: testAccountId,
    body: 'corpo da mensagem',
    subject: 'assunto da mensagem',
  } as IMessage

  const addResult = await messageRepository.add(testMessage, testAccountId);
  testMessageId = addResult.id!
})

afterAll(async () => {
  await messageRepository.removeById(testMessageId, testAccountId)
  await messageRepository.removeById(testMessageId2 | 0, testAccountId)
  //await contactRepository.removeByEmail(testEmail2, testAccountId)

  await supertest(accountsApp)
    .delete(`/accounts/${testAccountId}`)
    .set('x-access-token', jwt)

  await supertest(accountsApp)
    .post('/accounts/logout')
    .set('x-access-token', jwt)
    .send({})
  
})

describe('Testando rotas de messages service', () => {
  it('GET /messages/ - Deve retornar statusCode 200', async () => {
    const result = await supertest(app).get('/messages/').set('x-access-token', jwt)
    expect(result.status).toEqual(200)
    expect(Array.isArray(result.body)).toBeTruthy()
  })

  it('GET /messages/ - Deve retornar statusCode 401', async () => {
    const result = await supertest(app).get('/messages/')
    expect(result.status).toEqual(401)
  })

  it('GET /messages/:id - Deve retornar statusCode 200', async () => {
    const result = await supertest(app).get('/messages/'+ testMessageId).set('x-access-token', jwt)
    expect(result.status).toEqual(200)
    expect(result.body.id).toEqual(testMessageId)
  })

  it('GET /messages/:id - Deve retornar statusCode 401', async () => {
    const result = await supertest(app).get('/messages/'+ testMessageId)
    expect(result.status).toEqual(401)
  })

  it('GET /messages/:id - Deve retornar statusCode 400', async () => {
    const result = await supertest(app).get('/messages/abc').set('x-access-token', jwt)
    expect(result.status).toEqual(400)
  })

  it('GET /messages/:id - Deve retornar statusCode 404', async () => {
    const result = await supertest(app).get('/messages/-1').set('x-access-token', jwt)
    expect(result.status).toEqual(404)
  })

  it('POST /messages/ - Deve retornar statusCode 201', async () => {
    const payload = {
      accountId: testAccountId,
      body: 'corpo da mensagem post test',
      subject: 'assunto da mensagem post test',
    } as IMessage

    const result = await supertest(app)
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

    const result = await supertest(app)
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

    const result = await supertest(app)
      .post('/messages/')
      .send(payload)

    expect(result.status).toEqual(401)
  })

  it('PATCH /messages/:id - Deve retornar statusCode 200', async () => {
    const payload = {
      subject: 'jest alterado'
    }

    const result = await supertest(app)
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

    const result = await supertest(app)
      .patch(`/messages/${testMessageId}`)
      .send(payload)

    expect(result.status).toEqual(401)
  })

  it('PATCH /messages/:id - Deve retornar statusCode 422', async () => {
    const payload = {
      dasdas: 'jest2 patch',
    }

    const result = await supertest(app)
      .patch(`/messages/${testMessageId}`)
      .set('x-access-token', jwt)
      .send(payload)

    expect(result.status).toEqual(422)
  })

  it('PATCH /messages/:id - Deve retornar statusCode 404', async () => {
    const payload = {
      subject: 'jest2 patch',
    }

    const result = await supertest(app)
      .patch(`/messages/-1`)
      .set('x-access-token', jwt)
      .send(payload)

    expect(result.status).toEqual(404)
  })

  it('PATCH /messages/:id - Deve retornar statusCode 400', async () => {
    const payload = {
      subject: 'jest2 patch',
    }

    const result = await supertest(app)
      .patch(`/messages/abc`)
      .set('x-access-token', jwt)
      .send(payload)

    expect(result.status).toEqual(400)
  })
  
})
