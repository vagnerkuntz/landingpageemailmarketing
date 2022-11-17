import { Response } from 'express'
import { HttpError } from './HttpError'

export class UnauthorizedError extends HttpError {
  constructor(message?: string) {
    super(401, message ? message : 'Unauthorized')
  }

  configResponse(response: Response): Response {
    return response.sendStatus(this.statusCode)
  }
}