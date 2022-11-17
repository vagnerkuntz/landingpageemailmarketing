import { Response } from 'express'
import { HttpError } from './HttpError'

export class ReqParamNotFoundError extends HttpError {
  param: string[]

  constructor(param: string | string[], message: string) {
    super(400, message)
    this.param = Array.isArray(param) ? param : [param]
  }

  configResponse(response: Response): Response {
    return response.status(this.statusCode).json({
      param: this.param,
      message: this.message
    })
  }
}