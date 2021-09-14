import { Request, Response, NextFunction } from 'express'
import repository from '../models/contactRepository'
import controllerCommons from 'commons/api/controllers/controller'
import { TokenProps } from 'commons/api/auth'

async function getContacts(req: Request, res: Response, next: NextFunction) {
  const token = controllerCommons.getToken(res) as TokenProps
  const contacts = await repository.findAll(token.accountId)
  res.json(contacts)
}

export default { getContacts }