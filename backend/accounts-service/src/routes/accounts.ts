import { Router } from 'express';
import accountsController from '../controllers/accounts'

import {
  validateAccountSchema,
  validateUpdateAccountSchema,
  validateLoginSchema,
  validateAuthentication,
  validateAuthorization
} from './midlewares';

const router = Router();

router.get('/accounts/', validateAuthentication, accountsController.getAccounts);

router.get('/accounts/:id', validateAuthentication, validateAuthorization, accountsController.getAccount);

// path para seguir os padrões de restful
// update parcial
router.patch('/accounts/:id', validateAuthentication, validateAuthorization, validateUpdateAccountSchema, accountsController.setAccount);

// não tem validação de autenticação porque ele não tem registro
router.post('/accounts/', validateAccountSchema, accountsController.addAccount);

router.post('/accounts/login', validateLoginSchema, accountsController.loginAccount);

router.post('/accounts/logout', accountsController.logoutAccount);

router.delete('/accounts/:id', validateAuthentication, validateAuthorization, accountsController.deleteAccount);

export default router;