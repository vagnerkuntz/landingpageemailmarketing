import { beforeAll, afterAll, describe, it, expect } from "@jest/globals"
const request = require('supertest')

import app from './../src/app'
import accountsApp from '../../accounts-service/src/app'
import contactsApp from '../../contacts-service/src/app'
import { IMessage } from "../src/models/message"
import messageRepository from "../src/models/messageRepository"
import {MessageStatus} from "../src/models/messageStatus";

const testEmail = 'jest@accounts.com'
const testPassword = '123456'
let jwt: string = ''
let testAccountId: number = 0
let testMessageId: number = 0
let testContactId: number = 0

beforeAll(async () => {
    const testAccount = {
        name: 'jest',
        email: testEmail,
        password: testPassword,
        domain: 'jest.com'
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
        accountId: testAccountId,
        name: 'jest',
        email: testEmail,
    }

    const contactResponse = await request(contactsApp)
        .post('/contacts')
        .send(testContact)
        .set('x-access-token', jwt)
    testContactId = contactResponse.body.id

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

    await request(contactsApp)
        .post(`/contacts/${testContactId}/?force=true`)
        .set('x-access-token', jwt)

    await request(accountsApp)
        .delete(`/accounts/${testAccountId}?force=true`)
        .set('x-access-token', jwt)

    await request(accountsApp)
        .post('/accounts/logout')
        .set('x-access-token', jwt)
})

describe('Testando rotas de envio do messages service', () => {
    it('POST /message/:id/send = Deve retornar statusCode 200', async () => {
        const result = await request(app)
            .patch(`/messages/${testMessageId}/send`)
            .set('x-access-token', jwt)

        expect(result.status).toEqual(200)
        expect(result.body.id).toEqual(testMessageId)
        expect(result.body.status).toEqual(MessageStatus.SENT)
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
})
