import { Router, Request, Response, NextFunction } from 'express';
import { accountSchema, loginSchema } from '../models/account';

import accountsController from '../controllers/accounts'
import Joi, { ValidationError } from 'joi';

function validateSchema(schema: Joi.ObjectSchema, req: Request, res: Response, next: NextFunction) {
  const { error } = schema.validate(req.body);
  if (error == null) {
    return next();
  }

  const { details } = error as ValidationError
  const message = details.map((item) => item.message).join(',');

  console.log(message);
  res.status(422).end();
}

function validateAccount(req: Request, res: Response, next: NextFunction) {
  return validateSchema(accountSchema, req, res, next);
}

function validateLogin(req: Request, res: Response, next: NextFunction) {
  return validateSchema(loginSchema, req, res, next);
}

const router = Router();

router.get('/accounts/', accountsController.getAccounts);
router.get('/accounts/:id', accountsController.getAccount);
router.patch('/accounts/:id', validateAccount, accountsController.setAccount);
router.post('/accounts/', validateAccount, accountsController.addAccount);
router.post('/accounts/login', validateLogin, accountsController.loginAccount);
router.post('/accounts/logout', accountsController.logoutAccount);

export default router;