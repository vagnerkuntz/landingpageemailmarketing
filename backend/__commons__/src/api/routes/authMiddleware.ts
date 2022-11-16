import { Request, Response, NextFunction } from 'express'
import accountAuth from '../auth/accountsAuth'
import microserviceAuth from '../auth/microserviceAuth'

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

function validateMicroserviceAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers['x-access-token'] as string
    if (!token) {
      return res.sendStatus(401)
    }

    const payload = microserviceAuth.verify(token)
    if (!payload) {
      return res.sendStatus(401)
    }

    res.locals.payload = payload
    return next()
  } catch (error) {
    console.log(`validateMicroserviceAuth: ${error}`)
    res.sendStatus(400)
  }
}

export default {
  validateAccountAuth,
  validateMicroserviceAuth
}
