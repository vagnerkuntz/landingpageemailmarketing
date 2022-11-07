import { Request, Response, NextFunction } from 'express'
import commonsMidleware from 'commons/api/routes/midlewares'
import controllerCommons from 'commons/api/controllers/controller'
import { TokenProps } from 'commons/api/auth'
import { accountEmailSchema, accountEmailUpdateSchema } from '../models/accountEmailSchemas'

import { accountSchema, accountUpdateSchema, loginSchema } from '../models/accountSchemas'

function validateAccountEmailSchema (req: Request, res: Response, next: NextFunction) {
  return commonsMidleware.validateSchema(accountEmailSchema, req, res, next)
}

function validateAccountEmailUpdateSchema (req: Request, res: Response, next: NextFunction) {
  return commonsMidleware.validateSchema(accountEmailUpdateSchema, req, res, next)
}

function validateAccountSchema(req: Request, res: Response, next: NextFunction) {
  return commonsMidleware.validateSchema(accountSchema, req, res, next)
}

function validateUpdateAccountSchema(req: Request, res: Response, next: NextFunction) {
  return commonsMidleware.validateSchema(accountUpdateSchema, req, res, next)
}

function validateLoginSchema(req: Request, res: Response, next: NextFunction) {
  return commonsMidleware.validateSchema(loginSchema, req, res, next)
}

async function validateAuthentication(req: Request, res: Response, next: NextFunction) {
  return commonsMidleware.validateAuth(req, res, next)
}

function validateAuthorization(req: Request, res: Response, next: NextFunction) {
  const accountId = parseInt(req.params.id)
  if (!accountId) {
    return res.status(400).end()
  }

  const token = controllerCommons.getToken(res) as TokenProps

  // autenticado, mas não tem permissão
  if (accountId !== token.accountId) {
    return res.status(403).end()
  }

  next()
}

export {
  validateAccountSchema,
  validateLoginSchema,
  validateUpdateAccountSchema,
  validateAuthentication,
  validateAuthorization,
  validateAccountEmailSchema,
  validateAccountEmailUpdateSchema
}
