import { Request, Response, NextFunction } from 'express'
import repository from '../models/contactRepository'
import controllerCommons from 'commons/api/controllers/controller'
import { TokenProps } from 'commons/api/auth'

async function getContacts(req: Request, res: Response, next: NextFunction) {
  try {
    const token = controllerCommons.getToken(res) as TokenProps
    const contacts = await repository.findAll(token.accountId)
    res.json(contacts)
  } catch (error) {
    console.log(`getContacts: ${error}`)
    res.status(400).end()
  }
}

async function getContact(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    if (!id) {
      res.status(400).end()
    }

    const token = controllerCommons.getToken(res) as TokenProps
    const contact = await repository.findById(id, token.accountId)
    if (contact === null) {
      return res.status(404).end()
    } else {
      res.json(contact)
    }
  } catch (error) {
    console.log(`getContact: ${error}`)
    res.status(400).end()
  }
}

export default { getContacts, getContact}