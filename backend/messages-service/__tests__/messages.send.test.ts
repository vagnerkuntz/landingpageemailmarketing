const request = require('supertest')
const nock = require('nock')

import { beforeAll, afterAll, describe, it, expect } from '@jest/globals'
import app from './../src/app'
import { MessageStatus } from '../src/models/messageStatus'
import { ISending } from '../src/models/sending'
import { SendingStatus } from '../src/models/sendingStatus'
import { v4 as uuid } from 'uuid'
import microservicesAuth from '../../__commons__/src/api/auth/microserviceAuth'

import {
  sendMessageMock,
  sendMessageUnMock,
  sendMessageBatchMock,
  sendMessageBatchUnMock
} from '../../__commons__/src/clients/__mocks__/queueService'

import {
  sendEmailMock,
  sendEmailUnMock,
  getEmailIdentityMock,
  getEmailIdentityUnMock
} from '../../__commons__/src/clients/__mocks__/emailService'

let testAccountId: number = 1
let testMessageId: number = 1
let testMessageId2: number = 2
let testContactId: number = 1
let testSendingId: string = 'a302c7e5-6399-4630-a2a8-b4a5cd478bdb'

jest.mock('../src/models/messageModel')
jest.mock('../src/models/sendingModel')
jest.mock('../../__commons__/node_modules/jsonwebtoken', () => {
    return {
        verify: (token: string) => {
            if (token === `${testAccountId}`) { // token user
                return {
                    accountId: testAccountId,
                    jwt: token
                }
            } else if (token.indexOf('accountId')) { // token de micro serviços
              return JSON.parse(token)
            } else {
                return false
            }
        },
        sign: (payload: any) => {
          return `${JSON.stringify(payload)}`
        }
    }
})
nock(`${process.env.CONTACTS_API}`)
  .persist()
  .get('/contacts')
  .reply(200, [{
      id: 1,
      accountId: 1,
      name: 'jest',
      email: 'jest@jest.com',
      status: 100
  }])

nock(`${process.env.CONTACTS_API}`)
  .persist()
  .get('/contacts/1/account/1')
  .reply(200, {
      id: 1,
      accountId: 1,
      name: 'jest',
      email: 'jest@jest.com',
      status: 100
  })

nock(`${process.env.ACCOUNTS_API}`)
  .persist()
  .get('/accounts/1/accountEmails/1')
  .reply(200, {
    id: 1,
    accountId: 1,
    name: 'jest',
    email: 'jest@jest.com'
  })

nock(`${process.env.ACCOUNTS_API}`)
  .persist()
  .get('/accounts/1/accountEmails/2')
  .reply(200, {
    id: 1,
    accountId: 1,
    name: 'jest2',
    email: 'jest2@jest.com'
  })


beforeAll(async () => {
  sendMessageMock()
  sendMessageBatchMock()
  sendEmailMock()
  getEmailIdentityMock()
})

afterAll(async () => {
  sendMessageUnMock()
  sendMessageBatchUnMock()
  sendEmailUnMock()
  getEmailIdentityUnMock()
})

describe('Testando rotas de envio do messages service', () => {
    it('POST /message/:id/send = Deve retornar statusCode 202', async () => {
        const result = await request(app)
            .post(`/messages/${testMessageId}/send`)
            .set('x-access-token', `${testAccountId}`)

        expect(result.status).toEqual(202)
        expect(result.body.id).toEqual(testMessageId)
        expect(result.body.status).toEqual(MessageStatus.SCHEDULED)
    })

    it('POST /message/:id/send - Deve retornar statusCode 401', async () => {
        const result = await request(app)
            .post(`/messages/${testMessageId}/send`)

        expect(result.status).toEqual(401)
    })

    it('POST /message/:id/send - Deve retornar statusCode 403', async () => {
        const result = await request(app)
            .post(`/messages/-1/send`)
            .set('x-access-token', `${testAccountId}`)

        expect(result.status).toEqual(403)
    })

    it('POST /message/:id/send - Deve retornar statusCode 400', async () => {
        const result = await request(app)
            .post(`/messages/abc/send`)
            .set('x-access-token', `${testAccountId}`)

        expect(result.status).toEqual(400)
    })

    it('POST /messages/sending - Deve retornar um 202', async () => {
      const payload: ISending = {
          id: testSendingId,
          accountId: testAccountId,
          contactId: testContactId,
          messageId: testMessageId
      }
      const msJwt = microservicesAuth.sign(payload)

      const result = await request(app)
        .post('/messages/sending')
        .set('x-access-token', `${msJwt}`)
        .send(payload)

      expect(result.status).toEqual(202)
      expect(result.body.id).toEqual(testSendingId)
      expect(result.body.status).toEqual(SendingStatus.SENT)
  })

  it('POST /messages/sending - Deve retornar um 401', async () => {
      const result = await request(app)
        .post('/messages/sending')

      expect(result.status).toEqual(401)
  })

  it('POST /messages/sending - Deve retornar um 404', async () => {
      const payload: ISending = {
          id: uuid(),
          accountId: testAccountId,
          contactId: testContactId,
          messageId: testMessageId
      }
      const msJwt = microservicesAuth.sign(payload)

      const result = await request(app)
        .post('/messages/sending')
        .set('x-access-token', `${msJwt}`)
        .send(payload)

      expect(result.status).toEqual(404)
  })

  it('POST /messages/sending - Deve retornar um 404', async () => {
      const payload: ISending = {
          id: testSendingId,
          accountId: 999999999,
          contactId: testContactId,
          messageId: testMessageId
      }
      const msJwt = microservicesAuth.sign(payload)

      const result = await request(app)
        .post('/messages/sending')
        .set('x-access-token', `${msJwt}`)
        .send(payload)

      expect(result.status).toEqual(404)
  })

  it('POST /messages/sending - Deve retornar um 404', async () => {
      const payload: ISending = {
          id: testSendingId,
          accountId: testAccountId,
          contactId: 999999999,
          messageId: testMessageId
      }
      const msJwt = microservicesAuth.sign(payload)

      const result = await request(app)
        .post('/messages/sending')
        .set('x-access-token', `${msJwt}`)
        .send(payload)

      expect(result.status).toEqual(404)
  })

  it('POST /messages/sending - Deve retornar um 404', async () => {
      const payload: ISending = {
          id: testSendingId,
          accountId: testAccountId,
          contactId: testContactId,
          messageId: 999999999
      }
      const msJwt = microservicesAuth.sign(payload)

      const result = await request(app)
        .post('/messages/sending')
        .set('x-access-token', `${msJwt}`)
        .send(payload)

      expect(result.status).toEqual(404)
  })

  it('POST /messages/sending - Deve retornar um 422', async () => {
      const payload = {
          street: 'rua'
      }
      const msJwt = microservicesAuth.sign(payload)

      const result = await request(app)
        .post('/messages/sending')
        .set('x-access-token', `${msJwt}`)
        .send(payload)

      expect(result.status).toEqual(422)
  })

  it('POST /messages/sending - Deve retornar um 400', async () => {
      const payload: ISending = {
          id: testSendingId,
          accountId: testAccountId,
          contactId: testContactId,
          messageId: testMessageId2
      }
      const msJwt = microservicesAuth.sign(payload)

      const result = await request(app)
        .post('/messages/sending')
        .set('x-access-token', `${msJwt}`)
        .send(payload)

      expect(result.status).toEqual(400)
  })
})
