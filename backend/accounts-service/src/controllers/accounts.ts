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
      return res.status(400).end()
    }

    const account = await repository.findById(accountId)
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
    newAccount.password = ''
    newAccount.id = result.id

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
    const loginParams = req.body as IAccount
    const account = await repository.findByEmail(loginParams.email)
    if (account !== null) {
      const isValidPassword = auth.comparePassword(loginParams.password, account.password)

      if (isValidPassword) {
        const token = auth.signToken(account.id!)
        return res.json({ auth: true, token })
      }
      
      return res.status(401).end();
    }

    return res.status(404).end();
  } catch (error) {
    console.log(`loginAccount: ${error}`);
    res.status(400).end();
  }
}

function logoutAccount(req: Request, res: Response, next: NextFunction) {
  res.json({ auth: false, token: null });
}

async function deleteAccount(req: Request, res: Response, next: NextFunction) {
  try {
    const accountId = parseInt(req.params.id)
    if (!accountId) {
      return res.status(400).end()
    }

    const token = controllerCommons.getToken(res) as TokenProps
    if (accountId !== token.accountId) {
      return res.status(403).end()
    }

    if (req.query.force === 'true') {
      await repository.remove(accountId)
      res.status(200).end();
    } else {
      const accountParams = {
        status: AccountStatus.REMOVED,
      } as IAccount

      const updateAccount = await repository.set(accountId, accountParams)
      res.json(updateAccount)
    }
    
    res.status(200).end()
  } catch (error) {
    console.log(`deleteAccount: ${error}`)
    res.status(400).end()
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