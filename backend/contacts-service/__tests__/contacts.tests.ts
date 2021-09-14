import { beforeAll, afterAll, describe, it, expect } from "@jest/globals"
import supertest from 'supertest'
import app from './../src/app'
import accountApp from '../../accounts-service/src/app'

const testEmail = 'jest3434343@accounts.com'
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
  
  const accountResponse = await supertest(accountApp)
    .post('/accounts/')
    .send(testAccount);
  
  testAccountId = accountResponse.body.id;

  const loginResponse = await supertest(accountApp)
    .post('/accounts/login')
    .send({
      email: testEmail,
      password: testPassword
    })

  jwt = loginResponse.body.token
})

afterAll(async () => {
  await supertest(accountApp)
    .post('/accounts/logout')
    .send({})
    
  await supertest(accountApp)
    .delete(`/accounts/${testAccountId}`)
})

describe('Testando rotas de accounts service', () => {
  it('GET /contacts/ - Deve retornar statusCode 200', async () => {
    const result = await supertest(app).get('/contacts/').set('x-access-token', jwt)
    expect(result.status).toEqual(200)
    expect(Array.isArray(result.body)).toBeTruthy()
  })
})
