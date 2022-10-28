import { beforeAll, afterAll, describe, it, expect } from "@jest/globals"
const request = require('supertest')
import app from './../src/app'
import accountsApp from '../../accounts-service/src/app'
import { IContact } from "../src/models/contact"
import contactRepository from "../src/models/contactRepository"
import { ContactStatus } from "../src/models/contactStatus"

const testEmail = 'jest@accounts.com'
const testEmail2 = 'jest2@accounts.com'
const testPassword = '123456'
let jwt: string = ''
let testAccountId: number = 0
let testContactId: number = 0

beforeAll(async () => {
  const testAccount = {
    name: 'jestone',
    email: testEmail,
    password: testPassword,
    domain: 'jest.com.br'
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

  const testContact = {
    name: 'jest',
    email: testEmail,
    phone: '51123456789',
    accountId: testAccountId
  } as IContact

  const addResult  = await contactRepository.add(testContact, testAccountId)
  testContactId = addResult.id!
})

afterAll(async () => {
  await contactRepository.removeByEmail(testEmail, testAccountId)
  await contactRepository.removeByEmail(testEmail2, testAccountId)

  await request(accountsApp)
      .delete(`/accounts/${testAccountId}?force=true`)
      .set('x-access-token', jwt)

  await request(accountsApp)
      .post('/accounts/logout')
      .set('x-access-token', jwt)
})

describe('Testando rotas de contacts service', () => {
  it('GET /contacts/ - Deve retornar statusCode 200', async () => {
    const result = await request(app)
        .get('/contacts/')
        .set('x-access-token', jwt)

    expect(result.status).toEqual(200)
    expect(Array.isArray(result.body)).toBeTruthy()
  })

  it('GET /contacts/ - Deve retornar statusCode 401', async () => {
    const result = await request(app).get('/contacts/')
    expect(result.status).toEqual(401)
  })

  it('GET /contacts/:id - Deve retornar statusCode 200', async () => {
    const result = await request(app)
        .get(`/contacts/${testContactId}`)
        .set('x-access-token', jwt)

    expect(result.status).toEqual(200)
    expect(result.body.id).toEqual(testContactId)
  })

  it('GET /contacts/:id - Deve retornar statusCode 404', async () => {
    const result = await request(app).get(`/contacts/-1`).set('x-access-token', jwt)
    expect(result.status).toEqual(404)
  })

  it('GET /contacts/:id - Deve retornar statusCode 400', async () => {
    const result = await request(app)
        .get('/contacts/abc')
        .set('x-access-token', jwt)

    expect(result.status).toEqual(400)
  })

  it('GET /contacts/:id - Deve retornar statusCode 401', async () => {
    const result = await request(app).get(`/contacts/${testContactId}`)
    expect(result.status).toEqual(401)
  })

  it('POST /contacts/ - Deve retornar statusCode 201', async () => {
    const testContact = {
      name: 'jest2',
      email: testEmail2,
      phone: '12345678910',
    } as IContact

    const result = await request(app)
      .post('/contacts/')
      .set('x-access-token', jwt)
      .send(testContact)

    expect(result.status).toEqual(201)
    expect(result.body.id).toBeTruthy()
  })

  it('POST /contacts/ - Deve retornar statusCode 400', async () => {
    const testContact = {
      name: 'jest3',
      email: testEmail,
      phone: '12345678910',
    } as IContact

    const result = await request(app)
      .post('/contacts/')
      .set('x-access-token', jwt)
      .send(testContact)

    expect(result.status).toEqual(400)
  })

  it('POST /contacts/ - Deve retornar statusCode 422', async () => {
    const testContact = {
      rua: 'jest2',
      phone: '123456789',
    }

    const result = await request(app)
      .post('/contacts/')
      .set('x-access-token', jwt)
      .send(testContact)

    expect(result.status).toEqual(422)
  })

  it('POST /contacts/ - Deve retornar statusCode 401', async () => {
    const testContact = {
      name: 'jest2',
      email: testEmail2,
      phone: '12345678910',
    } as IContact

    const result = await request(app)
      .post('/contacts/')
      .send(testContact)

    expect(result.status).toEqual(401)
  })

  it('PATCH /contacts/:id - Deve retornar statusCode 200', async () => {
    const payload = {
      name: 'patchpayload',
    }

    const result = await request(app)
      .patch(`/contacts/${testContactId}`)
      .set('x-access-token', jwt)
      .send(payload)

    expect(result.status).toEqual(200)
    expect(result.body.name).toEqual('patchpayload')
  })

  it('PATCH /contacts/:id - Deve retornar statusCode 401', async () => {
    const payload = {
      name: 'jest2 patch',
    }

    const result = await request(app)
      .patch(`/contacts/${testContactId}`)
      .send(payload)

    expect(result.status).toEqual(401)
  })

  it('PATCH /contacts/:id - Deve retornar statusCode 422', async () => {
    const payload = {
      dasdas: 'jest2 patch',
    }

    const result = await request(app)
      .patch(`/contacts/${testContactId}`)
      .set('x-access-token', jwt)
      .send(payload)

    expect(result.status).toEqual(422)
  })

  it('PATCH /contacts/:id - Deve retornar statusCode 404', async () => {
    const payload = {
      name: 'jest2 patch',
    }

    const result = await request(app)
      .patch(`/contacts/-1`)
      .set('x-access-token', jwt)
      .send(payload)

    expect(result.status).toEqual(404)
  })

  it('PATCH /contacts/:id - Deve retornar statusCode 400', async () => {
    const payload = {
      name: 'jest2 patch',
    }

    const result = await request(app)
      .patch(`/contacts/abc`)
      .set('x-access-token', jwt)
      .send(payload)

    expect(result.status).toEqual(400)
  })

  it('DELETE /contacts/:id - Deve retornar statusCode 200', async () => {
    const result = await request(app)
      .delete('/contacts/'+testContactId)
      .set('x-access-token', jwt)

    expect(result.status).toEqual(200)
    expect(result.body.status).toEqual(ContactStatus.REMOVED)
  })

  it('DELETE /contacts/:id?force=true - Deve retornar statusCode 204', async () => {
    const result = await request(app)
      .delete(`/contacts/${testContactId}?force=true`)
      .set('x-access-token', jwt)

    expect(result.status).toEqual(204)
  })

  it('DELETE /contacts/:id - Deve retornar statusCode 403', async () => {
    const result = await request(app)
      .delete('/contacts/-1')
      .set('x-access-token', jwt);

    expect(result.status).toEqual(403)
  })
})
