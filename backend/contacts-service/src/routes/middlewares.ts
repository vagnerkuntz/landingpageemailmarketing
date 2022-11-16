import { Request, Response, NextFunction } from 'express'
import validateMiddleware from 'commons/api/routes/validateMiddleware'
import { contactSchema, contactUpdateSchema } from '../models/contactSchemas'

function validateContactSchema(req: Request, res: Response, next: NextFunction) {
  return validateMiddleware.validateSchema(contactSchema, req, res, next)
}

function validateUpdateContactSchema(req: Request, res: Response, next: NextFunction) {
  return validateMiddleware.validateSchema(contactUpdateSchema, req, res, next)
}

export { validateContactSchema, validateUpdateContactSchema }
