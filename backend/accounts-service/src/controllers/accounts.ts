import {NextFunction, Request, Response} from 'express'
import {IAccount} from '../models/account'
import controllerCommons from 'commons/api/controllers/controller'
import {TokenProps} from 'commons/api/auth/accountsAuth'
import repository from '../models/accountRepository'
import accountRepository from '../models/accountRepository'
import auth from '../auth'
import {AccountStatus} from '../models/accountStatus'
import emailService, {AccountSettings} from 'commons/services/emailService'
import {IAccountEmail} from '../models/accountEmail'
import accountEmailRepository from "../models/accountEmailRepository";
import { ReqParamNotFoundError } from 'commons/api/errors/ReqParamNotFoundError'
import { ForbiddenError } from 'commons/api/errors/ForbiddenError'
import { ResourceNotFoundError } from 'commons/api/errors/ResourceNotFoundError'
import { UnauthorizedError } from 'commons/api/errors/UnauthorizedError'
import { AlteradyExistsError } from 'commons/api/errors/AlteradyExistsError'

async function getAccounts(req: Request, res: Response, next: NextFunction) {
  const includeRemoved = req.query.includeRemoved == 'true'

  const accounts: IAccount[] = await repository.findAll(includeRemoved)
  res.json(accounts.map(item => {
    item.password = ''
    return item
  }))
}

async function getAccount(req: Request, res: Response, next: NextFunction) {
  const accountId = parseInt(req.params.id)
  if (!accountId) {
    return next(new ReqParamNotFoundError(
      'id',
      'is required'
    ))
  }

  const account = await repository.findById(accountId)
  if (account === null) {
    return next(new ResourceNotFoundError(
      'account',
      'account not found'
    ))
  }

  account.password = ''
  return res.json(account)
}

async function addAccount(req: Request, res: Response, next: NextFunction) {
  const newAccount = req.body as IAccount

  try {
    newAccount.password = auth.hashPassword(newAccount.password)

    const result = await repository.add(newAccount)
    newAccount.password = ''
    newAccount.id = result.id

    newAccount.settings = await emailService.createAccountSettings(newAccount.domain)

    return res.status(201).json(newAccount)
  } catch (error) {
    if (!newAccount.id) {
      await repository.remove(newAccount.id!)
      return next(error)
    }
  }

}

async function setAccount(req: Request, res: Response, next: NextFunction) {
  const accountParams = req.body as IAccount
  if (accountParams.status === AccountStatus.REMOVED) {
    return deleteAccount(req, res, next)
  }

  const accountId = parseInt(req.params.id)
  if (!accountId) {
    return next(new ReqParamNotFoundError(
      'accountId',
      'accountId is required'
    ))
  }

  const token = controllerCommons.getToken(res) as TokenProps;
  if (accountId !== token.accountId) {
    return next(new ForbiddenError(
      token.accountId,
      'setAccount'
    ))
  }

  if (accountParams.password) {
    accountParams.password = auth.hashPassword(accountParams.password)
  }

  const updateAccount = await repository.set(accountId, accountParams)
  if (updateAccount !== null) {
    updateAccount.password = ''
    return res.status(200).json(updateAccount)
  } else {
    return next(new ResourceNotFoundError(
      'updateAccount',
      'update account not found'
    ))
  }
}

async function loginAccount(req: Request, res: Response, next: NextFunction) {
  const loginParams = req.body as IAccount
  const account = await repository.findByEmail(loginParams.email)
  if (account !== null) {
    const isValidPassword = auth.comparePassword(loginParams.password, account.password)
        && account.status !== AccountStatus.REMOVED

    if (isValidPassword) {
      const token = auth.signToken(account.id!)
      return res.json({
        auth: true,
        token
      })
    }

    return next(new UnauthorizedError())
  }

  return next(new ResourceNotFoundError(
    'account',
    'account not found'
  ))
}

function logoutAccount(req: Request, res: Response, next: NextFunction) {
  return res.json({ auth: false, token: null });
}

async function deleteAccount(req: Request, res: Response, next: NextFunction) {
  const accountId = parseInt(req.params.id)
  if (!accountId) {
    return next(new ReqParamNotFoundError(
      'id',
      'id is required'
    ))
  }

  const token = controllerCommons.getToken(res) as TokenProps
  if (accountId !== token.accountId) {
    return next(new ForbiddenError(
      token.accountId,
      'deleteAccount'
    ))
  }

  const account = await accountRepository.findByIdWithEmails(accountId)
  if (account == null) {
    return next(new ResourceNotFoundError(
      'account',
      'account not found'
    ))
  }

  const { accountEmails } = account.get({ plain: true })
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
    return res.sendStatus(204)
  } else {
    const accountParams = {
      status: AccountStatus.REMOVED,
    } as IAccount

    const updateAccount = await repository.set(accountId, accountParams)

    if (updateAccount != null) {
      updateAccount.password = ''
      return res.status(200).json(updateAccount)
    } else {
      return next(new ResourceNotFoundError(
        'updateAccount',
        'update account not found'
      ))
    }
  }
}

async function getAccountsSettings(req: Request, res: Response, next: NextFunction) {
  const token = controllerCommons.getToken(res) as TokenProps
  const account = await accountRepository.findByIdWithEmails(token.accountId)
  if (!account) {
    return next(new ResourceNotFoundError(
      'account',
      'account not found'
    ))
  }

  let emails: string[] = []
  const { accountEmails } = account.get({ plain: true })
  if (accountEmails && accountEmails.length > 0) {
    emails = accountEmails.map(item => item.email)
  }

  const settings = await emailService.getAccountSettings(account.domain, emails)

  if (accountEmails != null) {
    settings.EmailAddress.forEach(item => {
      const email = accountEmails.find(ae => ae.email === item.email)
      if (!email) {
        return
      }

      item.id = email.id
      item.name = email.name
    })
  }

  return res.json(settings)
}

async function createAccountsSettings(req: Request, res: Response, next: NextFunction) {
  const token = controllerCommons.getToken(res) as TokenProps
  const account = await accountRepository.findById(token.accountId)
  if (!account) {
    return next(new ResourceNotFoundError(
      'account',
      'account not found'
    ))
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
  return res.status(201).json(accountsSettings)
}

async function addAccountEmail (req: Request, res: Response, next: NextFunction) {
  const token = controllerCommons.getToken(res) as TokenProps
  const accountEmail = req.body as IAccountEmail

  try {
    const account = await accountRepository.findByIdWithEmails(token.accountId)
    if (!account) {
      return next(new ResourceNotFoundError(
        'account',
        'account not found'
      ))
    }

    if (!accountEmail.email.endsWith(`@${account.domain}`)) {
      return next(new ForbiddenError(
        token.accountId,
        'Você só pode adicionar e-mails do seu próprio domínio'
      ))
    }

    const accountEmails = account.get('accountEmails', { plain: true }) as IAccountEmail[]
    let alreadyExists = false
    if (accountEmails && accountEmails.length > 0) {
      alreadyExists = accountEmails.some(item => item.email === accountEmail.email)
    }

    if (alreadyExists) {
      return next(new AlteradyExistsError(
        'addAccountEmail',
        'accountEmail já existe'
      ))
    }

    accountEmail.accountId = token.accountId
    const result = await accountEmailRepository.add(accountEmail)

    accountEmail.id = result.id!
    await emailService.addEmailIdentity(accountEmail.email)

    return res.status(201).json(accountEmail)
  } catch (error) {
    if (accountEmail.id) {
      await accountEmailRepository.remove(accountEmail.id, token.accountId)
    }

    return next(`addAccountEmail: ${error}`)
  }
}

async function getAccountEmails (req: Request, res: Response, next: NextFunction) {
  const token = controllerCommons.getToken(res) as TokenProps
  const account = await accountRepository.findByIdWithEmails(token.accountId)
  if (!account) {
    return next(new ResourceNotFoundError(
      'account',
      'account not found'
    ))
  }

  let emails: string[] = []
  const { accountEmails } = account.get({ plain: true })

  if (accountEmails && accountEmails.length > 0) {
    emails = accountEmails.map(item => item.email)

    const settings = await emailService.getEmailSettings(emails)
    accountEmails.forEach(item => {
      item.settings = settings.find(s => s.email === item.email)
    })

    return res.status(200).json(accountEmails);
  }

  return res.status(200).json([])
}

async function getAccountEmail (req: Request, res: Response, next: NextFunction) {
  let accountId = parseInt(req.params.accountId)
  if (!accountId) {
    const token = controllerCommons.getToken(res) as TokenProps
    accountId = token.accountId
  }

  const accountEmailId = parseInt(req.params.accountEmailId)
  if (!accountId || !accountEmailId) {
    return next(new ReqParamNotFoundError(
      ['accountId', 'accountEmailId'],
      'Boths ids are required'
    ))
  }

  const accountEmail = await accountEmailRepository.findById(accountEmailId, accountId, true)
  if (!accountEmail) {
    return next(new ResourceNotFoundError(
      'accountEmail',
      'accountEmail not found'
    ))
  }

  const settings = await emailService.getEmailSettings([accountEmail.email])
  if (!settings || settings.length === 0) {
    return next(new ResourceNotFoundError(
      'settings',
      'settings não encontrada'
    ))
  }

  accountEmail.settings = settings[0]

  return res.status(200).json(accountEmail)
}

async function setAccountEmail (req: Request, res: Response, next: NextFunction) {
  const accountEmailId = parseInt(req.params.id)
  if (!accountEmailId) {
    return next(new ReqParamNotFoundError(
      'accountEmailId',
      'accountEmailId is required'
    ))
  }
  const token = controllerCommons.getToken(res) as TokenProps
  const accountEmailParams = req.body as IAccountEmail

  const updateAccountEmail = await accountEmailRepository.set(accountEmailId, token.accountId, accountEmailParams)
  if (updateAccountEmail !== null) {
    return res.status(200).json(updateAccountEmail)
  } else {
    return next(new ResourceNotFoundError(
      'updateAccountEmail',
      'updateAccountEmail not found'
    ))
  }
}

async function deleteAccountEmail (req: Request, res: Response, next: NextFunction) {
  const accountEmailId = parseInt(req.params.id)
  if (!accountEmailId) {
    return next(new ReqParamNotFoundError(
      'accountEmailId',
      'accountEmailId is required'
    ))
  }
  const token = controllerCommons.getToken(res) as TokenProps

  const accountEmail = await accountEmailRepository.findById(accountEmailId, token.accountId)
  if (accountEmail == null) {
    return next(new ResourceNotFoundError(
      'accountEmail',
      'accountEmail not found'
    ))
  }

  await emailService.removeEmailIdentity(accountEmail.email)
  await accountEmailRepository.remove(accountEmailId, token.accountId)

  return res.sendStatus(200)
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
