import { Request, Response, NextFunction } from 'express'
import authMiddleware from 'commons/api/routes/authMiddleware'
import validateMiddleware from 'commons/api/routes/validateMiddleware'
import controllerCommons from 'commons/api/controllers/controller'
import { TokenProps } from 'commons/api/auth/accountsAuth'
import { accountEmailSchema, accountEmailUpdateSchema } from '../models/accountEmailSchemas'
import { accountSchema, accountUpdateSchema, loginSchema } from '../models/accountSchemas'
import { ReqParamNotFoundError } from 'commons/api/errors/ReqParamNotFoundError'
import { ForbiddenError } from 'commons/api/errors/ForbiddenError'

function validateAccountEmailSchema (req: Request, res: Response, next: NextFunction) {
  return validateMiddleware.validateSchema(accountEmailSchema, req, res, next)
}

function validateAccountEmailUpdateSchema (req: Request, res: Response, next: NextFunction) {
  return validateMiddleware.validateSchema(accountEmailUpdateSchema, req, res, next)
}

function validateAccountSchema(req: Request, res: Response, next: NextFunction) {
  return validateMiddleware.validateSchema(accountSchema, req, res, next)
}

function validateUpdateAccountSchema(req: Request, res: Response, next: NextFunction) {
  return validateMiddleware.validateSchema(accountUpdateSchema, req, res, next)
}

function validateLoginSchema(req: Request, res: Response, next: NextFunction) {
  return validateMiddleware.validateSchema(loginSchema, req, res, next)
}

async function validateAuthentication(req: Request, res: Response, next: NextFunction) {
  return authMiddleware.validateAccountAuth(req, res, next)
}

async function validateMSAuthentication (req: Request, res: Response, next: NextFunction) {
  return authMiddleware.validateMicroserviceAuth(req, res, next)
}

function validateAuthorization(req: Request, res: Response, next: NextFunction) {
  const accountId = parseInt(req.params.id)
  if (!accountId) {
    return next(new ReqParamNotFoundError(
      'id',
      'id is required'
    ))
  }

  const token = controllerCommons.getToken(res) as TokenProps

  // authenticated, but has no permissions
  if (accountId !== token.accountId) {
    return next(new ForbiddenError(
      token.accountId,
      req.path
    ))
  }

  return next()
}

export {
  validateAccountSchema,
  validateLoginSchema,
  validateUpdateAccountSchema,
  validateAuthentication,
  validateAuthorization,
  validateAccountEmailSchema,
  validateAccountEmailUpdateSchema,
  validateMSAuthentication
}
