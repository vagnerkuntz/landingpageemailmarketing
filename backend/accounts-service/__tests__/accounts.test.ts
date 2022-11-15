const request = require('supertest')
const AWSMock = require('aws-sdk-mock')
const path = require('path')

import { beforeAll, describe, it, expect } from "@jest/globals"
import { IAccount } from "../src/models/account"
import app from './../src/app'
import auth from "../src/auth"
import { AccountStatus } from "../src/models/accountStatus"

AWSMock.setSDK(path.resolve('../__commons__/node_modules/aws-sdk'))

const testEmail = 'jest@accounts.com'
let jwt: string = ''
const testId: number = 1

jest.mock('../src/models/accountRepository')
jest.mock('../src/models/accountEmailRepository')

beforeAll(async () => {
  jwt = auth.signToken(testId)
})

describe('Testando rotas de accounts service', () => {
  it('GET /accounts/ - Deve retornar statusCode 200', async () => {
    const result = await request(app)
      .get('/accounts/')
      .set('x-access-token', jwt)

    expect(result.status).toEqual(200)
    expect(Array.isArray(result.body)).toBeTruthy()
  })

  it('POST /accounts/ - Deve retornar statusCode 201', async () => {
    AWSMock.mock('SESV2', 'createEmailIdentity', (params: {
      EmailIdentity: string
    }, callback: Function) => {
      return callback(null, {
        IdentityType: 'DOMAIN',
        VerifiedForSendingStatus: false,
        DkimAttributes: {
          SigningEnabled: true,
          Status: 'NOT_STARTED',
          Tokens: ['30923kdqdada', 'dok23dk23d', 'd4543fsadasd09dasa'],
          SigningAttributesOrigin: 'AWS_SES'
        }
      })
    })

    AWSMock.mock('SESV2', 'putEmailIdentityMailFromAttributes', (params: {
      EmailIdentity: string,
      BehaviorOnMxFailure: string,
      MailFromDomain: string
    }, callback: Function) => {
      return callback(null, {})
    })

    AWSMock.mock('SESV2', 'getEmailIdentity', (params: {
      EmailIdentity: string
    }, callback: Function) => {
      return callback(null, {
        IdentityType: 'DOMAIN',
        FeedbackForwardingStatus: true,
        VerifiedForSendingStatus: false,
        DkimAttributes: {
          SigningEnabled: true,
          Status: 'PENDING',
          Tokens: ['30923kdqdada', 'dok23dk23d', 'd4543fsadasd09dasa'],
          SigningAttributesOrigin: 'AWS_SES'
        },
        MailFromAttributes: {
          MailFromDomain: `lpem.${params.EmailIdentity}`,
          MailFromDomainStatus: 'PENDING',
          BehaviorOnMxFailure: 'USE_DEFAULT_VALUE',
        },
        Policies: {},
        Tags: []
      })
    })

    interface IStringArray {
      [index: string]: {}
    }

    AWSMock.mock('SES', 'getIdentityVerificationAttributes', (params: {
      Identities: string[]
    }, callback: Function) => {
      const result = {
        ResponseMetadata: {
          RequestId: 'ad96c9c3-9730-4585-9dff-42e195666593'
        },
        VerificationAttributes: {} as IStringArray
      }

      for (let i = 0; i < params.Identities.length; i++) {
        result.VerificationAttributes[params.Identities[i]] = {
          VerificationStatus: 'Pending',
          VerificationToken: 'daoskdpoakd2923m23409dmalk'
        }
      }

      return callback(null, result)
    })

    const payload: IAccount = {
      name: 'jest2',
      email: testEmail,
      password: '123456',
      domain: 'jest.com'
    }

    const result = await request(app)
      .post('/accounts/')
      .send(payload)

    expect(result.status).toEqual(201)
    expect(result.body.id).toBeTruthy()

    AWSMock.restore('SESV2', 'createEmailIdentity')
    AWSMock.restore('SESV2', 'putEmailIdentityMailFromAttributes')
    AWSMock.restore('SESV2', 'getEmailIdentity')
    AWSMock.restore('SESV2', 'getIdentityVerificationAttributes')
  })

  it('POST /accounts/ - Deve retornar statusCode 422', async () => {
    const payload = {
      street: 'rua teste',
      city: 'citytest',
      state: 'PR'
    }

    const result = await request(app)
      .post('/accounts/')
      .send(payload)

    expect(result.status).toEqual(422)
  })

  it('PATCH /accounts/:id - Deve retornar statusCode 200', async () => {
    const payload = {
      name: 'John Doe 2'
    }

    const result = await request(app)
      .patch('/accounts/'+testId)
      .send(payload)
      .set('x-access-token', jwt)

    expect(result.status).toEqual(200)
    expect(result.body.id).toEqual(testId)
    expect(result.body.name).toEqual(payload.name);
  })

  it('PATCH /accounts/:id - Deve retornar statusCode 400', async () => {
    const payload = {
      name: 'John Doe 2',
    }

    const result = await request(app).patch('/accounts/abc')
      .send(payload)
      .set('x-access-token', jwt)

    expect(result.status).toEqual(400)
  })

  it('PATCH /accounts/:id - Deve retornar statusCode 403', async () => {
    const payload = {
      name: 'John Doe 2',
    }

    const result = await request(app).patch('/accounts/-1')
      .send(payload)
      .set('x-access-token', jwt)

    expect(result.status).toEqual(403)
  })

  it('GET /accounts/:id - Deve retornar statusCode 200', async () => {
    const result = await request(app)
      .get('/accounts/'+testId)
      .set('x-access-token', jwt)

    expect(result.status).toEqual(200)
    expect(result.body.id).toBe(testId)
  })

  it('GET /accounts/:id - Deve retornar statusCode 403', async () => {
    const result = await request(app)
      .get('/accounts/-1')
      .set('x-access-token', jwt)

    expect(result.status).toEqual(403)
  })

  it('GET /accounts/:id - Deve retornar statusCode 400', async () => {
    const result = await request(app)
      .get('/accounts/dasdasd')
      .set('x-access-token', jwt)

    expect(result.status).toEqual(400)
  })

  it('DELETE /accounts/:id - Deve retornar statusCode 200', async () => {
    AWSMock.mock('SESV2', 'deleteEmailIdentity', (params: {
      EmailIdentity: string
    }, callback: Function) => {
      return callback(null, {})
    })

    const result = await request(app)
      .delete('/accounts/'+testId)
      .set('x-access-token', jwt)

    expect(result.status).toEqual(200)
    expect(result.body.status).toEqual(AccountStatus.REMOVED)

    AWSMock.restore('SESV2', 'deleteEmailIdentity')
  })

  it('DELETE /accounts/:id?force=true - Deve retornar statusCode 204', async () => {
    const result = await request(app)
      .delete(`/accounts/${testId}?force=true`)
      .set('x-access-token', jwt)

    expect(result.status).toEqual(204)
  })

  it('DELETE /accounts/:id - Deve retornar statusCode 403', async () => {
    const result = await request(app)
      .delete('/accounts/-1')
      .set('x-access-token', jwt);

    expect(result.status).toEqual(403)
  })
})
