const request = require('supertest')

import { describe, it, expect } from '@jest/globals'
import app from './../src/app'
import { IMessage } from '../src/models/message'
import { MessageStatus } from '../src/models/messageStatus'

let testAccountId: number = 1
let testAccountEmailId: number = 1
let testMessageId: number = 1
let testMessageId2: number = 0

jest.mock('../src/models/messageModel')
jest.mock('../../__commons__/node_modules/jsonwebtoken', () => {
  return {
    verify: (token: string) => {
      if (token === `${testAccountId}`) {
        return {
          accountId: testAccountId,
          jwt: token
        }
      } else {
        return false
      }
    }
  }
})

describe('Testando rotas de messages service', () => {
  it('GET /messages/ - Deve retornar statusCode 200', async () => {
    const result = await request(app)
      .get('/messages/')
      .set('x-access-token', `${testAccountId}`)

    expect(result.status).toEqual(200)
    expect(Array.isArray(result.body)).toBeTruthy()
  })

  it('GET /messages/ - Deve retornar statusCode 401', async () => {
    const result = await request(app)
      .get('/messages/')

    expect(result.status).toEqual(401)
  })

  it('GET /messages/:id - Deve retornar statusCode 200', async () => {
    const result = await request(app)
      .get('/messages/'+ testMessageId)
      .set('x-access-token', `${testAccountId}`)

    expect(result.status).toEqual(200)
    expect(result.body.id).toEqual(testMessageId)
  })

  it('GET /messages/:id - Deve retornar statusCode 401', async () => {
    const result = await request(app)
      .get('/messages/'+ testMessageId)
    expect(result.status).toEqual(401)
  })

  it('GET /messages/:id - Deve retornar statusCode 400', async () => {
    const result = await request(app).get('/messages/abc')
      .set('x-access-token', `${testAccountId}`)
    expect(result.status).toEqual(400)
  })

  it('GET /messages/:id - Deve retornar statusCode 404', async () => {
    const result = await request(app)
      .get('/messages/-1')
      .set('x-access-token', `${testAccountId}`)
    expect(result.status).toEqual(404)
  })

  it('POST /messages/ - Deve retornar statusCode 201', async () => {
    const payload = {
      accountId: testAccountId,
      body: 'corpo da mensagem post test',
      subject: 'assunto da mensagem post test',
      accountEmailId: testAccountEmailId
    } as IMessage

    const result = await request(app)
      .post('/messages/')
      .set('x-access-token', `${testAccountId}`)
      .send(payload)

    testMessageId2 = parseInt(result.body.id)
    expect(result.status).toEqual(201)
    expect(result.body.id).toBeTruthy()
  })

  it('POST /messages/ - Deve retornar statusCode 422', async () => {
    const payload = {
      street: 'minha rua',
    }

    const result = await request(app)
      .post('/messages/')
      .set('x-access-token', `${testAccountId}`)
      .send(payload)

    expect(result.status).toEqual(422)
  })

  it('POST /messages/ - Deve retornar statusCode 401', async () => {
    const payload = {
      accountId: testAccountId,
      body: 'corpo da mensagem post test',
      subject: 'assunto da mensagem post test',
    } as IMessage

    const result = await request(app)
      .post('/messages/')
      .send(payload)

    expect(result.status).toEqual(401)
  })

  it('PATCH /messages/:id - Deve retornar statusCode 200', async () => {
    const payload = {
      subject: 'jest alterado'
    } as IMessage

    const result = await request(app)
      .patch(`/messages/${testMessageId}`)
      .set('x-access-token', `${testAccountId}`)
      .send(payload)

    expect(result.status).toEqual(200)
    expect(result.body.subject).toEqual(payload.subject)
  })

  it('PATCH /messages/:id - Deve retornar statusCode 401', async () => {
    const payload = {
      name: 'jest2 patch',
    }

    const result = await request(app)
      .patch(`/messages/${testMessageId}`)
      .send(payload)

    expect(result.status).toEqual(401)
  })

  it('PATCH /messages/:id - Deve retornar statusCode 422', async () => {
    const payload = {
      dasdas: 'jest2 patch',
    }

    const result = await request(app)
      .patch(`/messages/${testMessageId}`)
      .set('x-access-token', `${testAccountId}`)
      .send(payload)

    expect(result.status).toEqual(422)
  })

  it('PATCH /messages/:id - Deve retornar statusCode 404', async () => {
    const payload = {
      subject: 'jest2 patch',
    }

    const result = await request(app)
      .patch(`/messages/-1`)
      .set('x-access-token', `${testAccountId}`)
      .send(payload)

    expect(result.status).toEqual(404)
  })

  it('PATCH /messages/:id - Deve retornar statusCode 400', async () => {
    const payload = {
      subject: 'jest2 patch',
    }

    const result = await request(app)
      .patch(`/messages/abc`)
      .set('x-access-token', `${testAccountId}`)
      .send(payload)

    expect(result.status).toEqual(400)
  })

  it('DELETE /messages/:id - Deve retornar statusCode 200', async () => {
    const result = await request(app)
      .delete('/messages/' + testMessageId)
      .set('x-access-token', `${testAccountId}`)

    expect(result.status).toEqual(200);
    expect(result.body.status).toEqual(MessageStatus.REMOVED);
  })

  it('DELETE /messages/:id?force=true - Deve retornar statusCode 204', async () => {
    const result = await request(app)
      .delete(`/messages/${testMessageId}?force=true`)
      .set('x-access-token', `${testAccountId}`)

    expect(result.status).toEqual(204);
  })

  it('DELETE /messages/:id - Deve retornar statusCode 403', async () => {
    const result = await request(app)
      .delete('/messages/-1')
      .set('x-access-token', `${testAccountId}`)

    expect(result.status).toEqual(403);
  })
})
