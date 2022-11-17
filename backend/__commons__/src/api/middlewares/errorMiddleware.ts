import { Request, Response, NextFunction } from 'express'
import { HttpError } from '../errors/HttpError'
import logService from '../../services/logService'

export default function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logService.error(error.message)

  if (error instanceof HttpError) {
    return error.configResponse(res)
  }

  return res.sendStatus(500)
}