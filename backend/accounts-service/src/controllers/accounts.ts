import {NextFunction, Request, Response} from 'express'
import {IAccount} from '../models/account'
import controllerCommons from 'commons/api/controllers/controller'
import {TokenProps} from 'commons/api/auth'
import repository from '../models/accountRepository'
import accountRepository from '../models/accountRepository'
import auth from '../auth'
import {AccountStatus} from '../models/accountStatus'
import emailService, {AccountSettings} from 'commons/clients/emailService'
import {IAccountEmail} from '../models/accountEmail'
import accountEmailRepository from "../models/accountEmailRepository";

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

    newAccount.settings = await emailService.createAccountSettings(newAccount.domain)

    res.status(201).json(newAccount)
  } catch (error) {
    console.log(`controllers/accounts.addAccount: ${error}`);
    res.sendStatus(400);
  }
}

async function setAccount(req: Request, res: Response, next: NextFunction) {
  try {
    const accountParams = req.body as IAccount
    if (accountParams.status === AccountStatus.REMOVED) {
      return deleteAccount(req, res, next)
    }

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
          && account.status !== AccountStatus.REMOVED

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

    const account = await accountRepository.findByIdWithEmails(accountId)
    if (account == null) {
      return res.sendStatus(404)
    }

    const accountEmails = account.get('accountEmails', { plain: true }) as IAccount[]
    if (accountEmails && accountEmails.length > 0) {
      const promises = accountEmails.map(item => {
        return emailService.removeEmailIdentity(item.email)
      })
      await Promise.all(promises)
      await accountEmailRepository.removeAll(accountId)
    }

    await emailService.removeEmailIdentity(account.domain)

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

async function getAccountsSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const token = controllerCommons.getToken(res) as TokenProps

    console.log('tokengetAccountsSettings ', token)
    const account = await accountRepository.findByIdWithEmails(token.accountId)
    if (!account) {
      return res.sendStatus(404)
    }

    let emails: string[] = []
    const accountEmails = account.get('accountEmails', { plain: true }) as IAccountEmail[]
    if (accountEmails && accountEmails.length > 0) {
      emails = accountEmails.map(item => item.email)
    }

    const settings = await emailService.getAccountSettings(account.domain, emails)

    res.json(settings)
  } catch (error) {
    console.log(`getAccountsSettings: ${error}`)
    res.sendStatus(400)
  }
}

async function createAccountsSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const token = controllerCommons.getToken(res) as TokenProps
    const account = await accountRepository.findById(token.accountId)
    if (!account) {
      return res.sendStatus(404)
    }

    let accountsSettings: AccountSettings
    if (req.query.force === 'true') {
      await emailService.removeEmailIdentity(account.domain)
    } else {
      accountsSettings = await emailService.getAccountSettings(account.domain, [])
      if (accountsSettings) {
        return res.json(accountsSettings)
      }
    }

    accountsSettings = await emailService.createAccountSettings(account.domain)
    res.status(201).json(accountsSettings)
  } catch (error) {
    console.log(`createAccountsSettings: ${error}`)
    res.sendStatus(400)
  }
}

async function addAccountEmail (req: Request, res: Response, next: NextFunction) {
  const accountEmail = req.body as IAccountEmail
  const token = controllerCommons.getToken(res) as TokenProps

  try {
    const account = await accountRepository.findByIdWithEmails(token.accountId)
    if (!account) {
      return res.sendStatus(404)
    }

    if (!accountEmail.email.endsWith(`@${account.domain}`)) {
      return res.sendStatus(403)
    }

    const accountEmails = account.get('accountEmails', { plain: true }) as IAccountEmail[]
    let alreadyExists = false
    if (accountEmails && accountEmails.length > 0) {
      alreadyExists = accountEmails.some(item => item.email === accountEmail.email)
    }

    if (alreadyExists) {
      return res.sendStatus(400)
    }

    accountEmail.accountId = token.accountId
    const result = await accountEmailRepository.add(accountEmail)
    if (!result.id) {
      return res.sendStatus(400)
    }

    accountEmail.id = result.id!
    const response = await emailService.addEmailIdentity(accountEmail.email)
    res.status(201).json(accountEmail)
  } catch (error) {
    console.log(`addAccountEmail: ${error}`)
    if (accountEmail.id) {
      await accountEmailRepository.remove(accountEmail.id, token.accountId)
    }

    res.sendStatus(400)
  }
}

async function getAccountEmails (req: Request, res: Response, next: NextFunction) {
  try {
    const token = controllerCommons.getToken(res) as TokenProps
    const account = await accountRepository.findById(token.accountId)
    if (!account) {
      return res.sendStatus(404)
    }

    let emails: string[] = []
    const accountEmails = account.get('accountEmails', { plain: true }) as IAccountEmail[]
    if (accountEmails && accountEmails.length > 0) {
      emails = accountEmails.map(item => item.email)
    }

    const settings = await emailService.getEmailSettings(emails)
    res.json(settings)
  } catch (error) {
    console.log(`getAccountEmails: ${error}`)
    res.sendStatus(400)
  }
}

async function getAccountEmail (req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    if (!id) {
      return res.status(400).json({
        message: 'ID is a required'
      })
    }

    const token = controllerCommons.getToken(res) as TokenProps
    const accountEmail = await accountEmailRepository.findById(id, token.accountId, true)
    if (!accountEmail) {
      return res.sendStatus(404)
    }

    const settings = await emailService.getEmailSettings([accountEmail.email])
    if (!settings || settings.length === 0) {
      return res.sendStatus(404)
    }

    accountEmail.settings = settings[0]

    res.json(accountEmail)
  } catch (error) {
    console.log(`getAccountEmail: ${error}`)
    res.sendStatus(400)
  }
}

async function setAccountEmail (req: Request, res: Response, next: NextFunction) {
  try {
    const accountEmailId = parseInt(req.params.id)
    if (!accountEmailId) {
      return res.status(400).json({
        message: 'ID is required'
      })
    }
    const token = controllerCommons.getToken(res) as TokenProps
    const accountEmailParams = req.body as IAccountEmail

    const updateAccountEmail = await accountEmailRepository.set(accountEmailId, token.accountId, accountEmailParams)
    if (updateAccountEmail !== null) {
      res.status(200).json(updateAccountEmail)
    } else {
      res.sendStatus(404)
    }

  } catch (error) {
    console.log(`setAccountEmail: ${error}`)
    res.sendStatus(400)
  }
}

async function deleteAccountEmail (req: Request, res: Response, next: NextFunction) {
  try {
    const accountEmailId = parseInt(req.params.id)
    if (!accountEmailId) {
      return res.status(400).json({
        message: 'ID is required'
      })
    }
    const token = controllerCommons.getToken(res) as TokenProps

    const accountEmail = await accountEmailRepository.findById(accountEmailId, token.accountId)
    if (accountEmail === null) {
      return res.sendStatus(404)
    }

    await emailService.removeEmailIdentity(accountEmail.email)
    await accountEmailRepository.remove(accountEmailId, token.accountId)

    res.sendStatus(200)
  } catch (error) {
    console.log(`deleteAccountEmail: ${error}`)
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
  deleteAccount,
  getAccountsSettings,
  createAccountsSettings,
  addAccountEmail,
  getAccountEmails,
  getAccountEmail,
  setAccountEmail,
  deleteAccountEmail
}
