import { Response } from 'express'
import { HttpError } from './HttpError'

export class BadRequestError extends HttpError {
  path: string
  body: string

  constructor(path: string, body: string, message: string) {
    super(400, message)
    this.path = path
    this.body = body
  }

  configResponse(response: Response): Response {
    return response.status(this.statusCode).json({
      path: this.path,
      body: this.body,
      message: this.message
    })
  }
}