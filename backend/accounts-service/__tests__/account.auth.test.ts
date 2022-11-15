const supertest = require('supertest')

import { describe, it, expect } from '@jest/globals'
import app from '../src/app';
import auth from '../src/auth'

let testAccountId: number = 1
const testEmail = 'jest@accounts.auth.com'
const testPassword = '123456';

jest.mock('../src/models/accountRepository')

describe('Testando rotas de autenticação', () => {
  it('POST /accounts/login - 200 OK', async () => {
    const payload = {
      email: testEmail,
      password: testPassword
    }

    const result = await supertest(app)
      .post('/accounts/login')
      .send(payload);

    expect(result.status).toEqual(200);
    expect(result.body.auth).toBeTruthy();
    expect(result.body.token).toBeTruthy();
  })

  it('POST /accounts/login - 422 Unprocessable Entity', async () => {
    const payload = {
      email: testEmail
    }

    const result = await supertest(app)
      .post('/accounts/login')
      .send(payload);

    expect(result.status).toEqual(422);
  })

  it('POST /accounts/login - 401 Unauthorized', async () => {
    const payload = {
      email: testEmail,
      password: testPassword + '1'
    }

    const result = await supertest(app)
      .post('/accounts/login')
      .send(payload);

    expect(result.status).toEqual(401);
  })

  it('POST /accounts/logout - 200 Logout OK', async () => {
    const jwt = await auth.signToken(testAccountId)

    const result = await supertest(app)
      .post('/accounts/logout')
      .set('x-access-token', jwt)
      
    expect(result.status).toEqual(200);
  })
})
