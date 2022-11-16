import { NextFunction, Request, Response } from 'express'
import Joi, { ValidationError } from 'joi'

function validateSchema (schema: Joi.ObjectSchema, req: Request, res: Response, next: NextFunction) {
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

export default {
  validateSchema
}