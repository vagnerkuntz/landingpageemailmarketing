import { Request, Response, NextFunction } from 'express'
import { IAccount } from '../models/account'
import controllerCommons from 'commons/api/controllers/controller'
import { TokenProps } from 'commons/api/auth'
import repository from '../models/accountRepository'
import auth from '../auth'
import { AccountStatus } from '../models/accountStatus'

async function getAccounts(req: Request, res: Response, next: NextFunction) {
  const includeRemoved = req.query.includeRemoved == 'true'

  const accounts: IAccount[] = await repository.findAll(includeRemoved)
  res.json(accounts.map(item => {
    item.password = ''
    return item
  }))
}

async function getAccount(req: Request, res: Response, next: NextFunction) {
  try {
    const accountId = parseInt(req.params.id)
    if (!accountId) {
      return res.status(400).json({
        message: 'ID is required'
      })
    }

    const account = await repository.findById(accountId)
    if (account === null) {
      return res.sendStatus(404)
    }

    account.password = ''
    return res.json(account)
  } catch (error) {
    console.log(error)
    res.sendStatus(400)
  }
}

async function addAccount(req: Request, res: Response, next: NextFunction) {
  try {
    const newAccount = req.body as IAccount
    newAccount.password = auth.hashPassword(newAccount.password)

    const result = await repository.add(newAccount)
    newAccount.password = ''
    newAccount.id = result.id

    res.status(201).json(newAccount)
  } catch (error) {
    console.log(`controllers/accounts.addAccount: ${error}`);
    res.sendStatus(400);
  }
}

async function setAccount(req: Request, res: Response, next: NextFunction) {
  try {
    const accountId = parseInt(req.params.id)
    if (!accountId) {
      return res.status(400).json({
        message: 'ID is required'
      })
    }

    const token = controllerCommons.getToken(res) as TokenProps;
    if (accountId !== token.accountId) {
      return res.sendStatus(403);
    }

    const accountParams = req.body as IAccount

    if (accountParams.password) {
      accountParams.password = auth.hashPassword(accountParams.password)
    }

    const updateAccount = await repository.set(accountId, accountParams)
    if (updateAccount !== null) {
      updateAccount.password = ''
      res.status(200).json(updateAccount)
    } else {
      res.sendStatus(404)
    }
  } catch (error) {
    console.log(`setAccount: ${error}`);
    res.sendStatus(400)
  }
}

async function loginAccount(req: Request, res: Response, next: NextFunction) {
  try {
    const loginParams = req.body as IAccount
    const account = await repository.findByEmail(loginParams.email)
    if (account !== null) {
      const isValidPassword = auth.comparePassword(loginParams.password, account.password)

      if (isValidPassword) {
        const token = auth.signToken(account.id!)
        return res.json({ auth: true, token })
      }

      return res.sendStatus(401);
    }

    return res.sendStatus(404);
  } catch (error) {
    console.log(`loginAccount: ${error}`);
    res.sendStatus(400);
  }
}

function logoutAccount(req: Request, res: Response, next: NextFunction) {
  res.json({ auth: false, token: null });
}

async function deleteAccount(req: Request, res: Response, next: NextFunction) {
  try {
    const accountId = parseInt(req.params.id)
    if (!accountId) {
      return res.status(400).json({
        message: 'ID is required'
      })
    }

    const token = controllerCommons.getToken(res) as TokenProps
    if (accountId !== token.accountId) {
      return res.sendStatus(403)
    }

    if (req.query.force === 'true') {
      await repository.remove(accountId)
      res.sendStatus(204)
    } else {
      const accountParams = {
        status: AccountStatus.REMOVED,
      } as IAccount

      const updateAccount = await repository.set(accountId, accountParams)

      if (updateAccount != null) {
        updateAccount.password = ''
        res.status(200).json(updateAccount)
      } else {
        res.sendStatus(404)
      }
    }
  } catch (error) {
    console.log(`deleteAccount: ${error}`)
    res.sendStatus(400)
  }
}

export default {
  getAccounts,
  getAccount,
  addAccount,
  setAccount,
  loginAccount,
  logoutAccount,
  deleteAccount
}
