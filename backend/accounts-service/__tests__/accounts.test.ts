const request = require('supertest')

import { describe, it, expect } from "@jest/globals"
import { IAccount } from "../src/models/account"
import app from './../src/app'
import auth from "../src/auth"
import { AccountStatus } from "../src/models/accountStatus"
import {
  getEmailIdentityMock,
  getEmailIdentityUnMock,
  createEmailIdentityMock,
  createEmailIdentityUnMock,
  putEmailIdentityMailFromAttributesMock,
  putEmailIdentityMailFromAttributesUnMock,
  getIdentityVerificationAttributesMock,
  getIdentityVerificationAttributesUnMock,
  deleteEmailIdentityMock,
  deleteEmailIdentityUnMock
} from '../../__commons__/src/services/__mocks__/emailService'

const testEmail = 'jest@accounts.com'
const testId: number = 1

jest.mock('../src/models/accountModel')
jest.mock('../src/models/accountEmailModel')

describe('Testando rotas de accounts service', () => {
  it('GET /accounts/ - Deve retornar statusCode 200', async () => {
    const jwt = await auth.signToken(testId)

    const result = await request(app)
      .get('/accounts/')
      .set('x-access-token', jwt)

    expect(result.status).toEqual(200)
    expect(Array.isArray(result.body)).toBeTruthy()
  })

  it('GET /accounts/ - Deve retornar statusCode 401', async () => {
    const result = await request(app)
      .get('/accounts/')

    expect(result.status).toEqual(401)
  })

  it('POST /accounts/ - Deve retornar statusCode 201', async () => {
    createEmailIdentityMock()
    putEmailIdentityMailFromAttributesMock()
    getEmailIdentityMock()
    getIdentityVerificationAttributesMock()

    const payload: IAccount = {
      name: 'jest2',
      email: testEmail,
      password: '123456',
      domain: 'jest.com'
    }

    const result = await request(app)
      .post('/accounts/')
      .send(payload)

    expect(result.status).toEqual(201)
    expect(result.body.id).toBeTruthy()

    createEmailIdentityUnMock()
    getEmailIdentityUnMock()
    putEmailIdentityMailFromAttributesUnMock()
    getIdentityVerificationAttributesUnMock()
  })

  it('POST /accounts/ - Deve retornar statusCode 422', async () => {
    const payload = {
      street: 'rua teste',
      city: 'citytest',
      state: 'PR'
    }

    const result = await request(app)
      .post('/accounts/')
      .send(payload)

    expect(result.status).toEqual(422)
  })

  it('PATCH /accounts/:id - Deve retornar statusCode 200', async () => {
    const payload = {
      name: 'John Doe 2'
    }
    const jwt = await auth.signToken(testId)

    const result = await request(app)
      .patch('/accounts/'+testId)
      .send(payload)
      .set('x-access-token', jwt)

    expect(result.status).toEqual(200)
    expect(result.body.id).toEqual(testId)
    expect(result.body.name).toEqual(payload.name);
  })

  it('PATCH /accounts/:id - Deve retornar statusCode 401', async () => {
    const result = await request(app)
      .patch('/accounts/'+testId)

    expect(result.status).toEqual(401)
  })

  it('PATCH /accounts/:id - Deve retornar statusCode 400', async () => {
    const payload = {
      name: 'John Doe 2',
    }
    const jwt = await auth.signToken(testId)

    const result = await request(app).patch('/accounts/abc')
      .send(payload)
      .set('x-access-token', jwt)

    expect(result.status).toEqual(400)
  })

  it('PATCH /accounts/:id - Deve retornar statusCode 403', async () => {
    const payload = {
      name: 'John Doe 2',
    }
    const jwt = await auth.signToken(testId)

    const result = await request(app).patch('/accounts/-1')
      .send(payload)
      .set('x-access-token', jwt)

    expect(result.status).toEqual(403)
  })

  it('GET /accounts/:id - Deve retornar statusCode 200', async () => {
    const jwt = await auth.signToken(testId)

    const result = await request(app)
      .get('/accounts/'+testId)
      .set('x-access-token', jwt)
    expect(result.status).toEqual(200)
    expect(result.body.id).toBe(testId)
  })

  it('GET /accounts/:id - Deve retornar statusCode 401', async () => {
    const result = await request(app)
      .get('/accounts/'+testId)

    expect(result.status).toEqual(401)
  })

  it('GET /accounts/:id - Deve retornar statusCode 403', async () => {
    const jwt = await auth.signToken(testId)

    const result = await request(app)
      .get('/accounts/-1')
      .set('x-access-token', jwt)

    expect(result.status).toEqual(403)
  })

  it('GET /accounts/:id - Deve retornar statusCode 400', async () => {
    const jwt = await auth.signToken(testId)

    const result = await request(app)
      .get('/accounts/dasdasd')
      .set('x-access-token', jwt)

    expect(result.status).toEqual(400)
  })

  it('DELETE /accounts/:id - Deve retornar statusCode 200', async () => {
    deleteEmailIdentityMock()

    const jwt = await auth.signToken(testId)

    const result = await request(app)
      .delete('/accounts/'+testId)
      .set('x-access-token', jwt)

    expect(result.status).toEqual(200)
    expect(result.body.status).toEqual(AccountStatus.REMOVED)

    deleteEmailIdentityUnMock()
  })

  it('DELETE /accounts/:id - Deve retornar statusCode 401', async () => {
    const result = await request(app)
      .delete('/accounts/'+testId)

    expect(result.status).toEqual(401)
  })

  it('DELETE /accounts/:id?force=true - Deve retornar statusCode 204', async () => {
    const jwt = await auth.signToken(testId)

    const result = await request(app)
      .delete(`/accounts/${testId}?force=true`)
      .set('x-access-token', jwt)

    expect(result.status).toEqual(204)
  })

  it('DELETE /accounts/:id - Deve retornar statusCode 403', async () => {
    const jwt = await auth.signToken(testId)

    const result = await request(app)
      .delete('/accounts/-1')
      .set('x-access-token', jwt);

    expect(result.status).toEqual(403)
  })
})
