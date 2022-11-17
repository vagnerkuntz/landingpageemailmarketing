import { Response } from 'express'
import { HttpError } from './HttpError'

export class ResourceNotFoundError extends HttpError {
  resource: string

  constructor(resource: string, message: string) {
    super(404, message)
    this.resource = resource
  }

  configResponse(response: Response): Response {
    return response.status(this.statusCode).json({
      resource: this.resource,
      message: this.message
    })
  }
}