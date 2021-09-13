import { Request, Response, NextFunction } from 'express'
import { IAccount } from '../models/account'
import repository from '../models/accountRepository'

import auth from '../auth'

async function getAccounts(req: Request, res: Response, next: NextFunction) {
  const accounts = await repository.findAll()
  res.json(accounts.map(item => {
    item.password = ''
    return item
  }))
}

async function getAccount(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    if (!id) {
      return res.status(400).end()
    }

    const account = await repository.findById(id)
    if (account === null) {
      return res.status(404).end()
    }
    
    account.password = ''
    return res.json(account)
  } catch (error) {
    console.log(error)
    res.status(400).end()
  }
}

async function addAccount(req: Request, res: Response, next: NextFunction) {
  try {
    const newAccount = req.body as IAccount
    newAccount.password = auth.hashPassword(newAccount.password)

    const result = await repository.add(newAccount)
    newAccount.id = result.id

    newAccount.password = ''
    res.status(201).json(newAccount)
  } catch (error) {
    console.error(error)
    res.status(400).end()
  }
}

async function setAccount(req: Request, res: Response, next: NextFunction) {
  try {
    const accountId = parseInt(req.params.id)
    if (!accountId) {
      return res.status(400).end()
    }

    const accountParams = req.body as IAccount
    
    if (accountParams.password) {
      accountParams.password = auth.hashPassword(accountParams.password)
    }

    const updateAccount = await repository.set(accountId, accountParams)
    if (updateAccount !== null) {
      updateAccount.password = ''
      res.status(200).json(updateAccount)
    }

    res.status(404).end()
  } catch (error) {
    console.error(error)
    res.status(400).end()
  }
}

async function loginAccount(req: Request, res: Response, next: NextFunction) {
  try {
    const loginParams = req.body as IAccount;

    const account = await repository.findByEmail(loginParams.email)
    if (account !== null) {
      const isValidPassword = auth.comparePassword(loginParams.password, account.password)
      if (isValidPassword) {
        const token = auth.signToken(account.id!)
        return res.json({ auth: true, token })
      }
    }

    return res.status(401).end();
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
}

function logoutAccount(req: Request, res: Response, next: NextFunction) {
  res.json({ auth: false, token: null });
}

export default {
  getAccounts,
  getAccount,
  addAccount,
  setAccount,
  loginAccount,
  logoutAccount
}