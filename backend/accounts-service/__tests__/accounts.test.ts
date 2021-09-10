import { describe, it, expect } from "@jest/globals";
import supertest from 'supertest'
import app from './../src/app'

describe('Testando rotas de accounts service', () => {
  it('GET /accounts/ - Deve retornar statusCode 200', async () => {
    const result = await supertest(app).get('/accounts/');
    expect(result.status).toEqual(200);
    expect(Array.isArray(result.body)).toBeTruthy();
  })

  it('POST /accounts/ - Deve retornar statusCode 201', async () => {
    const payload = {
      id: 1,
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
      status: 100,
    }
    const result = await supertest(app).post('/accounts/').send(payload);
    expect(result.status).toEqual(201);
    expect(result.body.id).toBe(1);
  })

  it('POST /accounts/ - Deve retornar statusCode 422', async () => {
    const payload = {
      id: 1,
      street: 'rua teste',
      city: 'citytest',
      state: 'PR'
    }
    const result = await supertest(app).post('/accounts/').send(payload);
    expect(result.status).toEqual(422);
  })

  it('PATCH /accounts/:id - Deve retornar statusCode 200', async () => {
    const payload = {
      name: 'John Doe 2',
      email: 'johndoe2@email.com',
      password: '123456789',
    }
    const result = await supertest(app).patch('/accounts/1').send(payload);
    expect(result.status).toEqual(200);
    expect(result.body.id).toEqual(1);
  })

  it('PATCH /accounts/:id - Deve retornar statusCode 400', async () => {
    const payload = {
      name: 'John Doe 2',
      email: 'johndoe2@email.com',
      password: '123456789',
    }
    const result = await supertest(app).patch('/accounts/abc').send(payload);
    expect(result.status).toEqual(400);
  })

  it('PATCH /accounts/:id - Deve retornar statusCode 404', async () => {
    const payload = {
      name: 'John Doe 2',
      email: 'johndoe2@email.com',
      password: '123456789',
    }
    const result = await supertest(app).patch('/accounts/-1').send(payload);
    expect(result.status).toEqual(404);
  })

  it('GET /accounts/:id - Deve retornar statusCode 200', async () => {
    const result = await supertest(app).get('/accounts/1');
    expect(result.status).toEqual(200);
    expect(result.body.id).toBe(1);
  })

  it('GET /accounts/:id - Deve retornar statusCode 404', async () => {
    const result = await supertest(app).get('/accounts/2');
    expect(result.status).toEqual(404);
  })

  it('GET /accounts/:id - Deve retornar statusCode 400', async () => {
    const result = await supertest(app).get('/accounts/dasdasd');
    expect(result.status).toEqual(400);
  })
})
