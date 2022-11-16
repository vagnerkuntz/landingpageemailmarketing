const request = require('supertest')

import { describe, it, expect } from '@jest/globals'
import app from './../src/app'
import { IContact } from '../src/models/contact'
import { ContactStatus } from '../src/models/contactStatus'

const testEmail2 = 'jest2@accounts.com'
let testAccountId: number = 1
let testContactId: number = 1

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

jest.mock('../src/models/contactModel')

describe('Testando rotas de contacts service', () => {
  it('GET /contacts/ - Deve retornar statusCode 200', async () => {
    const result = await request(app)
        .get('/contacts/')
        .set('x-access-token', `${testAccountId}`)

    expect(result.status).toEqual(200)
    expect(Array.isArray(result.body)).toBeTruthy()
  })

  it('GET /contacts/ - Deve retornar statusCode 401', async () => {
    const result = await request(app)
      .get('/contacts/')

    expect(result.status).toEqual(401)
  })

  it('GET /contacts/:id - Deve retornar statusCode 200', async () => {
    const result = await request(app)
        .get(`/contacts/${testContactId}`)
        .set('x-access-token', `${testAccountId}`)

    expect(result.status).toEqual(200)
    expect(result.body.id).toEqual(testContactId)
  })

  it('GET /contacts/:id - Deve retornar statusCode 404', async () => {
    const result = await request(app)
      .get(`/contacts/-1`)
      .set('x-access-token', `${testAccountId}`)

    expect(result.status).toEqual(404)
  })

  it('GET /contacts/:id - Deve retornar statusCode 400', async () => {
    const result = await request(app)
        .get('/contacts/abc')
        .set('x-access-token', `${testAccountId}`)

    expect(result.status).toEqual(400)
  })

  it('GET /contacts/:id - Deve retornar statusCode 401', async () => {
    const result = await request(app)
      .get(`/contacts/${testContactId}`)

    expect(result.status).toEqual(401)
  })

   it('POST /contacts/ - Deve retornar statusCode 201', async () => {
     const testContact = {
       name: 'jest2',
       email: testEmail2,
       phone: '51123456789',
     } as IContact

     const result = await request(app)
       .post('/contacts/')
       .set('x-access-token', `${testAccountId}`)
       .send(testContact)

     expect(result.status).toEqual(201)
     expect(result.body.id).toBeTruthy()
   })

   it('POST /contacts/ - Deve retornar statusCode 422', async () => {
     const testContact = {
       street: 'jest2'
     }

     const result = await request(app)
       .post('/contacts/')
       .set('x-access-token', `${testAccountId}`)
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

   it('POST /contacts/ - Deve retornar statusCode 409', async () => {
     const testContact = {
       name: 'jest3',
       email: 'repeat@jest.com',
       phone: '12345678910',
     } as IContact

     const result = await request(app)
       .post('/contacts/')
       .set('x-access-token', `${testAccountId}`)
       .send(testContact)

     expect(result.status).toEqual(409)
   })

   it('PATCH /contacts/:id - Deve retornar statusCode 200', async () => {
     const payload = {
       name: 'Patch',
     }

     const result = await request(app)
       .patch(`/contacts/${testContactId}`)
       .set('x-access-token', `${testAccountId}`)
       .send(payload)

     expect(result.status).toEqual(200)
     expect(result.body.name).toEqual('Patch')
   })

   it('PATCH /contacts/:id - Deve retornar statusCode 401', async () => {
     const payload = {
       name: 'jest2 patch',
     }

     const result = await request(app)
       .patch('/contacts/' + testContactId)
       .send(payload)

     expect(result.status).toEqual(401)
   })

   it('PATCH /contacts/:id - Deve retornar statusCode 422', async () => {
     const payload = {
       dasdas: 'jest2 patch',
     }

     const result = await request(app)
       .patch(`/contacts/${testContactId}`)
       .set('x-access-token', `${testAccountId}`)
       .send(payload)

     expect(result.status).toEqual(422)
   })

   it('PATCH /contacts/:id - Deve retornar statusCode 404', async () => {
     const payload = {
       name: 'jest2 patch',
     }

     const result = await request(app)
       .patch(`/contacts/-1`)
       .set('x-access-token', `${testAccountId}`)
       .send(payload)

     expect(result.status).toEqual(404)
   })

   it('PATCH /contacts/:id - Deve retornar statusCode 400', async () => {
     const payload = {
       name: 'jest2 patch',
     }

     const result = await request(app)
       .patch(`/contacts/abc`)
       .set('x-access-token', `${testAccountId}`)
       .send(payload)

     expect(result.status).toEqual(400)
   })

   it('DELETE /contacts/:id - Deve retornar statusCode 200', async () => {
     const result = await request(app)
       .delete('/contacts/'+testContactId)
       .set('x-access-token', `${testAccountId}`)

     expect(result.status).toEqual(200)
     expect(result.body.status).toEqual(ContactStatus.REMOVED)
   })

   it('DELETE /contacts/:id?force=true - Deve retornar statusCode 204', async () => {
     const result = await request(app)
       .delete(`/contacts/${testContactId}?force=true`)
       .set('x-access-token', `${testAccountId}`)

     expect(result.status).toEqual(204)
   })

   it('DELETE /contacts/:id - Deve retornar statusCode 403', async () => {
     const result = await request(app)
       .delete('/contacts/-1')
       .set('x-access-token', `${testAccountId}`)

     expect(result.status).toEqual(403)
   })
})
