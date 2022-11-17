import { Request, Response } from 'express';
import validateMiddleware from 'commons/api/middlewares/validateMiddleware';
import { messageSchema, messageUpdateSchema } from '../models/messageSchema';
import { sendingSchema } from '../models/sendingSchema'

function validateMessageSchema(req: Request, res: Response, next: any){
  return validateMiddleware.validateSchema(messageSchema, req, res, next);
}

function validateUpdateMessageSchema(req: Request, res: Response, next: any){
  return validateMiddleware.validateSchema(messageUpdateSchema, req, res, next);
}

function validateSendingSchema(req: Request, res: Response, next: any){
  return validateMiddleware.validateSchema(sendingSchema, req, res, next);
}

export {
  validateMessageSchema,
  validateUpdateMessageSchema,
  validateSendingSchema
}