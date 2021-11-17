import { Request, Response } from 'express';
import commonsMiddleware from 'commons/api/routes/midlewares';
import { messageSchema, messageUpdateSchema } from '../models/messageSchema';

function validateMessageSchema(req: Request, res: Response, next: any){
  return commonsMiddleware.validateSchema(messageSchema, req, res, next);
}

function validateUpdateMessageSchema(req: Request, res: Response, next: any){
  return commonsMiddleware.validateSchema(messageUpdateSchema, req, res, next);
}

export { validateMessageSchema, validateUpdateMessageSchema }