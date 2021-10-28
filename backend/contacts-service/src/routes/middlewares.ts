import { Request, Response, NextFunction } from 'express'
import commonsMidleware from 'commons/api/routes/midlewares'
import { contactSchema, contactUpdateSchema } from '../models/contactSchemas'

function validateContactSchema(req: Request, res: Response, next: NextFunction) {
  return commonsMidleware.validateSchema(contactSchema, req, res, next)
}

function validateUpdateContactSchema(req: Request, res: Response, next: NextFunction) {
  return commonsMidleware.validateSchema(contactUpdateSchema, req, res, next)
}

export { validateContactSchema, validateUpdateContactSchema }
