import { Router } from 'express';
import accountsController from '../controllers/accounts'

import { validateAccountSchema, validateUpdateAccountSchema, validateLoginSchema, validateAuth } from './midlewares';

const router = Router();

router.get('/accounts/', validateAuth, accountsController.getAccounts);

router.get('/accounts/:id', validateAuth, accountsController.getAccount);

// path para seguir os padrões de restful
// update parcial
router.patch('/accounts/:id', validateAuth, validateUpdateAccountSchema, accountsController.setAccount);

// não tem validação de autenticação porque ele não tem registro
router.post('/accounts/', validateAccountSchema, accountsController.addAccount);

router.post('/accounts/login', validateLoginSchema, accountsController.loginAccount);

router.post('/accounts/logout', accountsController.logoutAccount);

export default router;