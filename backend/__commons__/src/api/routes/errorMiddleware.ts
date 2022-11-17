import { Request, Response, NextFunction } from 'express'
import { HttpError } from '../errors/HttpError'

export default function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(error)

  if (error instanceof HttpError) {
    return error.configResponse(res)
  }

  return res.sendStatus(500)
}