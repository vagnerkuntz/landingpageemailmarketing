import { beforeAll, afterAll, describe, it, expect } from "@jest/globals"
import request from 'supertest'
import { IAccount } from "../src/models/account"
import app from './../src/app'

import repository from '../src/models/accountRepository'
import auth from "../src/auth"
import { AccountStatus } from "../src/models/accountStatus"

const testEmail = 'jest@accounts.com'
const testEmail2 = 'jest2@accounts.com'
const hashPassword = '$2a$10$ye/d5KSzdLt0TIOpevAtde2mgreLPUpLpnE0vyQJ0iMBVeZyklKSi'
let jwt: string = ''
let testId: number = 0

beforeAll(async () => {
  const testAccount: IAccount = {
    name: 'jest',
    email: testEmail,
    password: hashPassword,
    domain: 'jest.com'
  }

  const result = await repository.add(testAccount)
  testId = result.id!
  jwt = auth.signToken(testId)
})

afterAll(async () => {
  await repository.removeByEmail(testEmail)
  await repository.removeByEmail(testEmail2)
})

describe('Testando rotas de accounts service', () => {
  it('GET /accounts/ - Deve retornar statusCode 200', async () => {
    const result = await request(app)
      .get('/accounts/')
      .set('x-access-token', jwt)

    expect(result.status).toEqual(200)
    expect(Array.isArray(result.body)).toBeTruthy()
  })

  it('POST /accounts/ - Deve retornar statusCode 201', async () => {
    const payload: IAccount = {
      name: 'jest2',
      email: testEmail2,
      password: '123456',
      domain: 'jest.com'
    }

    const result = await request(app)
      .post('/accounts/')
      .send(payload)

    expect(result.status).toEqual(201)
    expect(result.body.id).toBeTruthy()
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

    const result = await request(app)
      .patch('/accounts/'+testId)
      .send(payload)
      .set('x-access-token', jwt)

    expect(result.status).toEqual(200)
    expect(result.body.id).toEqual(testId)
    expect(result.body.name).toEqual(payload.name);
  })

  it('PATCH /accounts/:id - Deve retornar statusCode 400', async () => {
    const payload = {
      name: 'John Doe 2',
    }

    const result = await request(app).patch('/accounts/abc')
      .send(payload)
      .set('x-access-token', jwt)

    expect(result.status).toEqual(400)
  })

  it('PATCH /accounts/:id - Deve retornar statusCode 403', async () => {
    const payload = {
      name: 'John Doe 2',
    }

    const result = await request(app).patch('/accounts/-1')
      .send(payload)
      .set('x-access-token', jwt)

    expect(result.status).toEqual(403)
  })

  it('GET /accounts/:id - Deve retornar statusCode 200', async () => {
    const result = await request(app)
      .get('/accounts/'+testId)
      .set('x-access-token', jwt)

    expect(result.status).toEqual(200)
    expect(result.body.id).toBe(testId)
  })

  it('GET /accounts/:id - Deve retornar statusCode 403', async () => {
    const result = await request(app)
      .get('/accounts/-1')
      .set('x-access-token', jwt)

    expect(result.status).toEqual(403)
  })

  it('GET /accounts/:id - Deve retornar statusCode 400', async () => {
    const result = await request(app)
      .get('/accounts/dasdasd')
      .set('x-access-token', jwt)

    expect(result.status).toEqual(400)
  })

  it('DELETE /accounts/:id - Deve retornar statusCode 200', async () => {
    const result = await request(app)
      .delete('/accounts/'+testId)
      .set('x-access-token', jwt)

    expect(result.status).toEqual(200)
    expect(result.body.status).toEqual(AccountStatus.REMOVED)
  })

  it('DELETE /accounts/:id?force=true - Deve retornar statusCode 200', async () => {
    const result = await request(app)
      .delete(`/accounts/${testId}?force=true`)
      .set('x-access-token', jwt)

    expect(result.status).toEqual(200)
  })

  it('DELETE /accounts/:id - Deve retornar statusCode 403', async () => {
    const result = await request(app)
      .delete('/accounts/-1')
      .set('x-access-token', jwt);

    expect(result.status).toEqual(403)
  })
})
