import { NextFunction, Request, Response } from 'express'
import Joi, { ValidationError } from 'joi'
import { SchemaValidationError } from '../errors/SchemaValidationError'

function validateSchema (schema: Joi.ObjectSchema, req: Request, res: Response, next: NextFunction) {
  const { error } = schema.validate(req.body)
  if (error == null) {
    return next()
  }

  const { details } = error as ValidationError
  const message = details.map((item) => item.message).join(',')

  return next(new SchemaValidationError(
    JSON.stringify(req.body),
    message
  ))
}

export default {
  validateSchema
}