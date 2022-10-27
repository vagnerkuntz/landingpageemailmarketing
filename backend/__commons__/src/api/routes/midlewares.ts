import { Request, Response, NextFunction } from 'express'
import Joi, { ValidationError } from 'joi'
import auth from '../auth'

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

async function validateAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers['x-access-token'] as string
    if (!token) {
      return res.sendStatus(401)
    }

    const payload = await auth.verifyToken(token)
    if (!payload) {
      return res.sendStatus(401)
    }

    res.locals.payload = payload
    next()
  } catch (error) {
    console.log(`validateAuth: ${error}`)
    res.sendStatus(400)
  }
}

export default { validateSchema, validateAuth }
