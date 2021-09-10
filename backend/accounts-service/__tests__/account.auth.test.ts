import { describe, it, expect } from "@jest/globals";

import supertest from 'supertest';
import app from '../src/app';

describe('Testando rotas de autenticação', () => {
  it('POST /accounts/login', async () => {
    const payload = {
      email: 'johndoe@email.com',
      password: '123456'
    }

    const result = await supertest(app).post('/accounts/login').send(payload);

    expect(result.status).toEqual(200);
    expect(result.body.auth).toBeTruthy();
    expect(result.body.token).toBeTruthy();
  })

  it('POST /accounts/login - 401 Unauthorized', async () => {
    const payload = {
      email: 'johndoe@email.com',
      password: 'abcabc'
    }

    const result = await supertest(app).post('/accounts/login').send(payload);

    expect(result.status).toEqual(401);
  })

  it('POST /accounts/login - 422 Unprocessable Entity', async () => {
    const payload = {
      email: 'johndoe@email.com',
      password: 'abc'
    }

    const result = await supertest(app).post('/accounts/login').send(payload);

    expect(result.status).toEqual(422);
  })

  it('POST /accounts/logout - 200 Logout OK', async () => {
    const result = await supertest(app).post('/accounts/logout');
    expect(result.status).toEqual(200);
  })
})
