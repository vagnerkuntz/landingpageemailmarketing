import { Router } from 'express';
import accountsController from '../controllers/accounts'

import { validateAccount, validateUpdateAccount, validateLogin, validateAuth } from './midlewares';

const router = Router();

router.get('/accounts/', validateAuth, accountsController.getAccounts);

router.get('/accounts/:id', validateAuth, accountsController.getAccount);

// path para seguir os padrões de restful
// update parcial
router.patch('/accounts/:id', validateAuth, validateUpdateAccount, accountsController.setAccount);

// não tem validação de autenticação porque ele não tem registro
router.post('/accounts/', validateAccount, accountsController.addAccount);

router.post('/accounts/login', validateLogin, accountsController.loginAccount);

// valida se é autenticado
router.post('/accounts/logout', validateAuth, accountsController.logoutAccount);

export default router;