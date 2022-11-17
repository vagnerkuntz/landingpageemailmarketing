const request = require('supertest')

import { beforeAll, afterAll, describe } from '@jest/globals'
import app from '../src/app'
import auth from '../src/auth'
import { IAccountEmail } from '../src/models/accountEmail'

import {
  createEmailIdentityMock,
  createEmailIdentityUnMock,
  getEmailIdentityMock,
  getEmailIdentityUnMock,
  getIdentityVerificationAttributesMock,
  getIdentityVerificationAttributesUnMock,
  putEmailIdentityMailFromAttributesMock,
  putEmailIdentityMailFromAttributesUnMock,
  deleteEmailIdentityMock,
  deleteEmailIdentityUnMock
} from '../../__commons__/src/services/__mocks__/emailService'

jest.mock('../src/models/accountModel')
jest.mock('../src/models/accountEmailModel')

const testAccountId: number = 1
const testAccountEmailId: number = 1
const testEmail: string = 'jest@jest.com'

beforeAll(() => {
  getEmailIdentityMock()
  getIdentityVerificationAttributesMock()
  createEmailIdentityMock()
  putEmailIdentityMailFromAttributesMock()
  deleteEmailIdentityMock()
})

afterAll(() => {
  getEmailIdentityUnMock()
  getIdentityVerificationAttributesUnMock()
  deleteEmailIdentityUnMock()
  createEmailIdentityUnMock()
  putEmailIdentityMailFromAttributesUnMock()
})

describe('Testando as rotas de accounts/settings', () => {
  it('GET /accounts/settings - Deve retornar statusCode 200', async () => {
    const jwt = await auth.signToken(testAccountId)

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
    const jwt = await auth.signToken(testAccountId)

    const result = await request(app)
      .post('/accounts/settings')
      .set('x-access-token', jwt)

    expect(result.status).toEqual(200)
    expect(result.body).toBeTruthy()
  })

  it('POST /accounts/settings?force=true - Deve retornar statusCode 201', async () => {
    const jwt = await auth.signToken(testAccountId)

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
  it('GET /accounts/settings/accountEmails - Deve retornar statusCode 200', async () => {
    const jwt = await auth.signToken(testAccountId)

    const result = await request(app)
      .get('/accounts/settings/accountEmails')
      .set('x-access-token', jwt);

    expect(result.status).toEqual(200);
    expect(result.body).toBeTruthy();
  })

  it('PUT /accounts/settings/accountEmails - Deve retornar statusCode 201', async () => {
    const payload = {
      name: 'jest',
      email: 'jest2@jest.com'
    } as IAccountEmail;

    const jwt = await auth.signToken(testAccountId)

    const result = await request(app)
      .put('/accounts/settings/accountEmails')
      .send(payload)
      .set('x-access-token', jwt);

    expect(result.status).toEqual(201);
    expect(result.body).toBeTruthy();
  })

  it('PUT /accounts/settings/accountEmails - Deve retornar statusCode 409', async () => {
    const payload = {
      name: 'jest',
      email: testEmail
    } as IAccountEmail

    const jwt = await auth.signToken(testAccountId)

    const result = await request(app)
      .put('/accounts/settings/accountEmails')
      .send(payload)
      .set('x-access-token', jwt)

    expect(result.status).toEqual(409)
  })

  it('PUT /accounts/settings/accountEmails - Deve retornar statusCode 401', async () => {
    const result = await request(app)
      .put('/accounts/settings/accountEmails')

    expect(result.status).toEqual(401)
  })

  it('PUT /accounts/settings/accountEmails - Deve retornar statusCode 403', async () => {
    const payload = {
      name: 'jest',
      email: testEmail + ".br"
    } as IAccountEmail;

    const jwt = await auth.signToken(testAccountId)

    const result = await request(app)
      .put('/accounts/settings/accountEmails')
      .send(payload)
      .set('x-access-token', jwt);

    expect(result.status).toEqual(403);
  })

  it('PUT /accounts/settings/accountEmails - Deve retornar statusCode 422', async () => {
    const payload = {
      street: 'jest',
    };

    const jwt = await auth.signToken(testAccountId)

    const result = await request(app)
      .put('/accounts/settings/accountEmails')
      .send(payload)
      .set('x-access-token', jwt);

    expect(result.status).toEqual(422);
  })

  it('PATCH /accounts/settings/accountEmails/:id - Deve retornar statusCode 200', async () => {
    const payload = {
      name: 'new name',
    };

    const jwt = await auth.signToken(testAccountId)

    const result = await request(app)
      .patch('/accounts/settings/accountEmails/' + testAccountEmailId)
      .send(payload)
      .set('x-access-token', jwt);

    expect(result.status).toEqual(200);
    expect(result.body.name).toEqual('new name');
  })

  it('PATCH /accounts/settings/accountEmails/:id - Deve retornar statusCode 400', async () => {
    const payload = {
      name: 'new name',
    };

    const jwt = await auth.signToken(testAccountId)

    const result = await request(app)
      .patch('/accounts/settings/accountEmails/abc')
      .send(payload)
      .set('x-access-token', jwt);

    expect(result.status).toEqual(400);
  })

  it('PATCH /accounts/settings/accountEmails/:id - Deve retornar statusCode 401', async () => {
    const result = await request(app)
      .patch(`/accounts/settings/accountEmails/${testAccountEmailId}`)

    expect(result.status).toEqual(401);
  })

  it('PATCH /accounts/settings/accountEmails/:id - Deve retornar statusCode 404', async () => {
    const payload = {
      name: 'new name',
    };

    const jwt = await auth.signToken(testAccountId)

    const result = await request(app)
      .patch('/accounts/settings/accountEmails/-1')
      .send(payload)
      .set('x-access-token', jwt);

    expect(result.status).toEqual(404);
  })

  it('PATCH /accounts/settings/accountEmails/:id - Deve retornar statusCode 422', async () => {
    const payload = {
      street: 'new street',
    };

    const jwt = await auth.signToken(testAccountId)

    const result = await request(app)
      .patch('/accounts/settings/accountEmails/' + testAccountEmailId)
      .send(payload)
      .set('x-access-token', jwt);

    expect(result.status).toEqual(422);
  })

  it('DELETE /accounts/settings/accountEmails/:id - Deve retornar statusCode 200', async () => {
    const jwt = await auth.signToken(testAccountId)

    const result = await request(app)
      .delete(`/accounts/settings/accountEmails/${testAccountEmailId}`)
      .set('x-access-token', jwt);

    expect(result.status).toEqual(200);
  })

  it('DELETE /accounts/settings/accountEmails/:id - Deve retornar statusCode 400', async () => {
    const jwt = await auth.signToken(testAccountId)

    const result = await request(app)
      .delete('/accounts/settings/accountEmails/abc')
      .set('x-access-token', jwt);

    expect(result.status).toEqual(400);
  })

  it('DELETE /accounts/settings/accountEmails/:id - Deve retornar statusCode 401', async () => {
    const result = await request(app)
      .delete(`/accounts/settings/accountEmails/${testAccountEmailId}`);

    expect(result.status).toEqual(401);
  })

  it('DELETE /accounts/settings/accountEmails/:id - Deve retornar statusCode 404', async () => {
    const jwt = await auth.signToken(testAccountId)

    const result = await request(app)
      .delete('/accounts/settings/accountEmails/-1')
      .set('x-access-token', jwt);

    expect(result.status).toEqual(404);
  })
})
