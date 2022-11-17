import { Response } from 'express'
import { HttpError } from './HttpError'

export class ForbiddenError extends HttpError {
  accountId: number

  constructor(accountId: number, message: string) {
    super(403, message)
    this.accountId = accountId
  }

  configResponse(response: Response): Response {
    return response.status(this.statusCode).json({
      accountId: this.accountId,
      message: this.message
    })
  }
}