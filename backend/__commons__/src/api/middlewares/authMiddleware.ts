import { Request, Response, NextFunction } from 'express'
import accountAuth from '../auth/accountsAuth'
import microserviceAuth from '../auth/microserviceAuth'
import { UnauthorizedError } from '../errors/UnauthorizedError'

async function validateAccountAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['x-access-token'] as string
  if (!token) {
    return next(new UnauthorizedError())
  }

  const payload = await accountAuth.verifyToken(token)
  if (!payload) {
    return next(new UnauthorizedError())
  }

  res.locals.payload = payload
  return next()
}

function validateMicroserviceAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['x-access-token'] as string
  if (!token) {
    return next(new UnauthorizedError())
  }

  const payload = microserviceAuth.verify(token)
  if (!payload) {
    return next(new UnauthorizedError())
  }

  res.locals.payload = payload
  return next()
}

export default {
  validateAccountAuth,
  validateMicroserviceAuth
}
