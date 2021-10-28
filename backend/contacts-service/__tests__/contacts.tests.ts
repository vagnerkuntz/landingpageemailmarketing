import { beforeAll, afterAll, describe, it, expect } from "@jest/globals"
import supertest from 'supertest'
import app from './../src/app'
import accountsApp from '../../accounts-service/src/app'
import { IContact } from "../src/models/contact"
import contactRepository from "../src/models/contactRepository"

const testEmail = 'jest@accounts.com'
const testPassword = '123456'
let jwt: string = ''
let testAccountId: number = 0
let testContactId: number = 0

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

  const testContact = {
    name: 'jest',
    email: testEmail,
    phone: '123456789',
  } as IContact

  const addResult  = await contactRepository.add(testContact, testAccountId)
  testContactId = addResult.id!

})

afterAll(async () => {
  await contactRepository.removeByEmail(testEmail, testAccountId)

  await supertest(accountsApp)
    .delete(`/accounts/${testAccountId}`)
    .set('x-access-token', jwt)

  await supertest(accountsApp)
    .post('/accounts/logout')
    .set('x-access-token', jwt)
    .send({})
  
})

describe('Testando rotas de contacts service', () => {
  it('GET /contacts/ - Deve retornar statusCode 200', async () => {
    const result = await supertest(app).get('/contacts/').set('x-access-token', jwt)
    expect(result.status).toEqual(200)
    expect(Array.isArray(result.body)).toBeTruthy()
  })

  it('GET /contacts/ - Deve retornar statusCode 401', async () => {
    const result = await supertest(app).get('/contacts/')
    expect(result.status).toEqual(401)
  })

  it('GET /contacts/:id - Deve retornar statusCode 200', async () => {
    const result = await supertest(app).get(`/contacts/${testContactId}`).set('x-access-token', jwt)
    expect(result.status).toEqual(200)
    expect(result.body.id).toEqual(testContactId)
  })

  it('GET /contacts/:id - Deve retornar statusCode 404', async () => {
    const result = await supertest(app).get(`/contacts/-1`).set('x-access-token', jwt)
    expect(result.status).toEqual(404)
  })

  it('GET /contacts/:id - Deve retornar statusCode 400', async () => {
    const result = await supertest(app).get(`/contacts/abc`).set('x-access-token', jwt)
    expect(result.status).toEqual(400)
  })

  it('GET /contacts/:id - Deve retornar statusCode 401', async () => {
    const result = await supertest(app).get(`/contacts/${testContactId}`)
    expect(result.status).toEqual(401)
  })
})
