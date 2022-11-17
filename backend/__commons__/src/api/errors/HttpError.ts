import { Response } from 'express'

export abstract class HttpError extends Error {
  statusCode: number

  constructor (statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
  }

  abstract configResponse(response: Response): Response
}
