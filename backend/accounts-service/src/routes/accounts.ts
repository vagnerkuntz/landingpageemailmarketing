import { Router } from 'express';
import accountsController from '../controllers/accounts'

import { validateAccountSchema, validateUpdateAccountSchema, validateLoginSchema, validateAuth } from './midlewares';

import calc from 'commons/calc'

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

router.get('/somar/:val1/:val2', (req, res, next) => {
  const val1 = parseInt(req.params.val1);
  const val2 = parseInt(req.params.val2);
  const resultado = calc(val1, val2);
  res.json({resultado})
})

export default router;