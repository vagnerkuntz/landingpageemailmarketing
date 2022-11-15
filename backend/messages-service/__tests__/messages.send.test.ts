import { beforeAll, afterAll, describe, it, expect } from '@jest/globals'
const request = require('supertest')

import app from './../src/app'
import accountsApp from '../../accounts-service/src/app'
import contactsApp from '../../contacts-service/src/app'
import { IMessage } from '../src/models/message'
import messageRepository from '../src/models/messageRepository'
import { MessageStatus } from '../src/models/messageStatus'
import { IAccountEmail } from '../../accounts-service/src/models/accountEmail'
import { ISending } from '../src/models/sending'
import { SendingStatus } from '../src/models/sendingStatus'
import { v4 as uuid } from 'uuid'
import sendingRepository from '../src/models/sendingRepository'
import microservicesAuth from '../../__commons__/src/api/auth/microserviceAuth'
import { IContact } from '../../contacts-service/src/models/contact'

const testDomain = 'jest.send.com'
const testEmail = `jest@${testDomain}`
const testEmail2 = `jest2@${testDomain}`
const testPassword = '123456'
let jwt: string = ''
let testAccountId: number = 0
let testAccountEmailId: number = 0
let testMessageId: number = 0
let testContactId: number = 0
let testContactId2: number = 0
let testSendingId: string = ''
let testSendingId2: string = ''

beforeAll(async () => {
    jest.setTimeout(60000)

    const testAccount = {
        name: 'jest',
        email: testEmail,
        password: testPassword,
        domain: testDomain
    }

    const accountResponse = await request(accountsApp)
        .post('/accounts/')
        .send(testAccount)
    testAccountId = accountResponse.body.id

    const loginResponse = await request(accountsApp)
        .post('/accounts/login')
        .send({
            email: testEmail,
            password: testPassword
        })
    jwt = loginResponse.body.token

    const testAccountEmail: IAccountEmail = {
        name: 'jest',
        email: testEmail,
        accountId: testAccountId
    }

    const accountEmailResponse = await request(accountsApp)
      .put('/accounts/settings/accountEmails')
      .send(testAccountEmail)
      .set('x-access-token', jwt)

    if (accountEmailResponse.status != 201) {
        throw new Error()
    }
    testAccountEmailId = accountEmailResponse.body.id

    const testContact: IContact = {
        accountId: testAccountId,
        name: 'jest',
        email: testEmail
    }

    const contactResponse = await request(contactsApp)
        .post('/contacts')
        .send(testContact)
        .set('x-access-token', jwt)
    testContactId = contactResponse.body.id

    const testContact2 : IContact = {
        accountId: testAccountId,
        name: 'jest',
        email: testEmail2
    }

    const contactResponse2 = await request(contactsApp)
      .post('/contacts')
      .send(testContact2)
      .set('x-access-token', jwt)
    testContactId2 = contactResponse2.body.id

    const testMessage = {
        accountId: testAccountId,
        body: 'corpo da mensagem',
        subject: 'assunto da mensagem',
        accountEmailId: testAccountEmailId
    } as IMessage

    const addResult = await messageRepository.add(testMessage, testAccountId)
    testMessageId = addResult.id!

    const testSending: ISending = {
        accountId: testAccountId,
        messageId: testMessageId,
        contactId: testContactId,
        status: SendingStatus.QUEUED,
        id: uuid()
    }
    const sendingResult = await sendingRepository.add(testSending)
    if (!sendingResult.id) {
        throw new Error()
    }

    testSendingId = sendingResult.id

    const testSending2: ISending = {
        accountId: testAccountId,
        messageId: testMessageId,
        contactId: testContactId2,
        status: SendingStatus.QUEUED,
        id: uuid()
    }
    const sendingResult2 = await sendingRepository.add(testSending2)
    if (!sendingResult2.id) {
        throw new Error()
    }
    testSendingId2 = sendingResult2.id
})

afterAll(async () => {
    jest.setTimeout(60000)

    await sendingRepository.removeById(testSendingId, testAccountId)
    await sendingRepository.removeById(testSendingId2, testAccountId)

    await messageRepository.removeById(testMessageId, testAccountId)

    await request(contactsApp)
      .post(`/contacts/${testContactId}/?force=true`)
      .set('x-access-token', jwt)

    await request(contactsApp)
      .post(`/contacts/${testContactId2}/?force=true`)
      .set('x-access-token', jwt)

    await request(accountsApp)
      .delete(`/accounts/settings/accountEmails/${testAccountEmailId}/?force=true`)
      .set('x-access-token', jwt);

    await request(accountsApp)
        .delete(`/accounts/${testAccountId}?force=true`)
        .set('x-access-token', jwt)

    await request(accountsApp)
        .post('/accounts/logout')
        .set('x-access-token', jwt)
})

describe('Testando rotas de envio do messages service', () => {
    it('POST /message/:id/send = Deve retornar statusCode 202', async () => {
        const result = await request(app)
            .patch(`/messages/${testMessageId}/send`)
            .set('x-access-token', jwt)

        expect(result.status).toEqual(202)
        expect(result.body.id).toEqual(testMessageId)
        expect(result.body.status).toEqual(MessageStatus.SCHEDULED)
    })

    it('POST /message/:id/send - Deve retornar statusCode 401', async () => {
        const result = await request(app)
            .patch(`/messages/${testMessageId}/send`)

        expect(result.status).toEqual(401)
    })

    it('POST /message/:id/send - Deve retornar statusCode 403', async () => {
        const result = await request(app)
            .patch(`/messages/-1/send`)
            .set('x-access-token', jwt)

        expect(result.status).toEqual(403)
    })

    it('POST /message/:id/send - Deve retornar statusCode 400', async () => {
        const result = await request(app)
            .patch(`/messages/abc/send`)
            .set('x-access-token', jwt)

        expect(result.status).toEqual(400)
    })

    it('POST /messages/sending - Deve retornar um 202', async () => {
        const payload: ISending = {
            id: testSendingId,
            accountId: testAccountId,
            contactId: testContactId,
            messageId: testMessageId
        }
        const msJwt = await microservicesAuth.sign(payload)

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
        const msJwt = await microservicesAuth.sign(payload)

        const result = await request(app)
          .post('/messages/sending')
          .set('x-access-token', `${msJwt}`)
          .send(payload)

        expect(result.status).toEqual(404)
    })

    it('POST /messages/sending - Deve retornar um 404', async () => {
        const payload: ISending = {
            id: testSendingId2,
            accountId: 999999999,
            contactId: testContactId,
            messageId: testMessageId
        }
        const msJwt = await microservicesAuth.sign(payload)

        const result = await request(app)
          .post('/messages/sending')
          .set('x-access-token', `${msJwt}`)
          .send(payload)

        expect(result.status).toEqual(404)
    })

    it('POST /messages/sending - Deve retornar um 404', async () => {
        const payload: ISending = {
            id: testSendingId2,
            accountId: testAccountId,
            contactId: 999999999,
            messageId: testMessageId
        }
        const msJwt = await microservicesAuth.sign(payload)

        const result = await request(app)
          .post('/messages/sending')
          .set('x-access-token', `${msJwt}`)
          .send(payload)

        expect(result.status).toEqual(404)
    })

    it('POST /messages/sending - Deve retornar um 404', async () => {
        const payload: ISending = {
            id: testSendingId2,
            accountId: testAccountId,
            contactId: testContactId,
            messageId: 999999999
        }
        const msJwt = await microservicesAuth.sign(payload)

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
        const msJwt = await microservicesAuth.sign(payload)

        const result = await request(app)
          .post('/messages/sending')
          .set('x-access-token', `${msJwt}`)
          .send(payload)

        expect(result.status).toEqual(422)
    })

    it('POST /messages/sending - Deve retornar um 400', async () => {
        const payload: ISending = {
            id: testSendingId2,
            accountId: testAccountId,
            contactId: testContactId2,
            messageId: testMessageId
        }
        const msJwt = await microservicesAuth.sign(payload)

        const result = await request(app)
          .post('/messages/sending')
          .set('x-access-token', `${msJwt}`)
          .send(payload)

        expect(result.status).toEqual(400)
    })
})
