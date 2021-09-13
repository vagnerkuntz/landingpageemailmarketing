import { Request, Response, NextFunction } from 'express'
import Joi, { ValidationError } from 'joi'
import auth from '../auth'

import { accountSchema, accountUpdateSchema, loginSchema } from '../models/accountSchemas'

function validateSchema(schema: Joi.ObjectSchema, req: Request, res: Response, next: NextFunction) {
	const { error } = schema.validate(req.body)
	if (error == null) {
		return next()
	}

	const { details } = error as ValidationError
	const message = details.map((item) => item.message).join(',')

	console.log(`validateSchema: ${message}`)
	res.status(422).end()
}

function validateAccountSchema(req: Request, res: Response, next: NextFunction) {
  return validateSchema(accountSchema, req, res, next)
}

function validateUpdateAccountSchema(req: Request, res: Response, next: NextFunction) {
  return validateSchema(accountUpdateSchema, req, res, next)
}

function validateLoginSchema(req: Request, res: Response, next: NextFunction) {
  return validateSchema(loginSchema, req, res, next)
}

async function validateAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers['x-access-token'] as string
    if (!token) {
      return res.status(401).end()
    }

    const payload = await auth.verifyToken(token)
    if (!payload) {
      return res.status(401).end()
    }

    res.locals.payload = payload
    next()
  } catch (error) {
    console.log(`validateAuth: ${error}`)
    res.status(400).end()
  }
}

export { validateAccountSchema, validateLoginSchema, validateUpdateAccountSchema, validateAuth }
