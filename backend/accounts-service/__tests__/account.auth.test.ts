import { beforeAll, afterAll, describe, it, expect } from "@jest/globals";
const supertest = require('supertest')
import app from '../src/app';
import auth from "../src/auth";
import { IAccount } from "../src/models/account";

import repository from '../src/models/accountRepository'

const testEmail = 'jest@accounts.auth.com';
const hashPassword = '$2a$10$ye/d5KSzdLt0TIOpevAtde2mgreLPUpLpnE0vyQJ0iMBVeZyklKSi';
const testPassword = '123456';
let jwt = '';
let testAccountId = 0;

beforeAll(async () => {
  const testAccount: IAccount = {
    name: 'jest',
    email: testEmail,
    password: hashPassword,
    domain: 'jest.com'
  }

  const result = await repository.add(testAccount);
  testAccountId = result.id!;
  jwt = auth.signToken(testAccountId);
})

afterAll(async () => {
  await repository.removeByEmail(testEmail)
})

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
    const result = await supertest(app)
      .post('/accounts/logout')
      .set('x-access-token', jwt)
      
    expect(result.status).toEqual(200);
  })
})
