import { Response } from 'express'
import { HttpError } from './HttpError'

export class SchemaValidationError extends HttpError {
  entity: string

  constructor(entity: string, message: string) {
    super(422, message)
    this.entity = entity
  }

  configResponse(response: Response): Response {
    return response.status(this.statusCode).json({
      entity: this.entity,
      message: this.message
    })
  }
}