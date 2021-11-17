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

})
