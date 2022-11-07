import { Router } from 'express';
import accountsController from '../controllers/accounts'

import {
  validateAccountSchema,
  validateUpdateAccountSchema,
  validateLoginSchema,
  validateAuthentication,
  validateAuthorization,
  validateAccountEmailSchema,
  validateAccountEmailUpdateSchema
} from './midlewares';

const router = Router();

router.get('/accounts/settings/accountEmails', validateAuthentication, accountsController.getAccountEmails)

router.get('/accounts/settings/accountEmails/:id', validateAuthentication, accountsController.getAccountEmail)

router.get('/accounts/settings', validateAuthentication, accountsController.getAccountsSettings)

router.get('/accounts/:id', validateAuthentication, validateAuthorization, accountsController.getAccount);

router.get('/accounts/', validateAuthentication, accountsController.getAccounts);

// path para seguir os padrões de restful
// update parcial
router.patch('/accounts/:id', validateAuthentication, validateAuthorization, validateUpdateAccountSchema, accountsController.setAccount);

router.patch('/accounts/settings/accountEmails/:id', validateAuthentication, validateAccountEmailUpdateSchema, accountsController.setAccountEmail);

router.put('/accounts/settings/accountEmails', validateAuthentication, validateAccountEmailSchema, accountsController.addAccountEmail)

router.post('/accounts/settings', validateAuthentication, accountsController.createAccountsSettings)

// não tem validação de autenticação porque ele não tem registro
router.post('/accounts/', validateAccountSchema, accountsController.addAccount);

router.post('/accounts/login', validateLoginSchema, accountsController.loginAccount);

router.post('/accounts/logout', accountsController.logoutAccount);

router.delete('/accounts/:id', validateAuthentication, validateAuthorization, accountsController.deleteAccount);

router.delete('/accounts/settings/accountEmails/:id', validateAuthentication, accountsController.deleteAccountEmail);

export default router;