import { Request, Response, NextFunction } from 'express'
import Joi, { ValidationError } from 'joi'
import accountAuth from '../auth/accountsAuth'
import microserviceAuth from '../auth/microserviceAuth'

function validateSchema(schema: Joi.ObjectSchema, req: Request, res: Response, next: NextFunction) {
    const { error } = schema.validate(req.body)
    if (error == null) {
        return next()
    }

    const { details } = error as ValidationError
    const message = details.map((item) => item.message).join(',')

    console.log(`validateSchema: ${message}`)
    res.status(422).json({
        entity: req.body,
        message
    })
}

async function validateAccountAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers['x-access-token'] as string
    if (!token) {
      return res.sendStatus(401)
    }

    const payload = await accountAuth.verifyToken(token)
    if (!payload) {
      return res.sendStatus(401)
    }

    res.locals.payload = payload
    next()
  } catch (error) {
    console.log(`validateAccountAuth: ${error}`)
    res.sendStatus(400)
  }
}

async function validateMicroserviceAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers['x-access-token'] as string
    if (!token) {
      return res.sendStatus(401)
    }

    const payload = await microserviceAuth.verify(token)
    if (!payload) {
      return res.sendStatus(401)
    }

    res.locals.payload = payload
    next()
  } catch (error) {
    console.log(`validateMicroserviceAuth: ${error}`)
    res.sendStatus(400)
  }
}

export default {
  validateSchema,
  validateAccountAuth,
  validateMicroserviceAuth
}
