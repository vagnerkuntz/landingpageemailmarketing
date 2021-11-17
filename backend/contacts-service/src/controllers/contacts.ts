import { Request, Response, NextFunction } from 'express'
import repository from '../models/contactRepository'
import controllerCommons from 'commons/api/controllers/controller'
import { TokenProps } from 'commons/api/auth'
import { IContact } from '../models/contact'
import { ContactStatus } from '../models/contactStatus'

async function getContacts(req: Request, res: Response, next: NextFunction) {
  try {
    const includeRemoved = req.query.includeRemoved == 'true'
    const token = controllerCommons.getToken(res) as TokenProps
    const contacts = await repository.findAll(token.accountId, includeRemoved)
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

async function addContact(req: Request, res: Response, next: NextFunction) {
  try {
    const token = controllerCommons.getToken(res) as TokenProps
    const contact = req.body as IContact
    const result = await repository.add(contact, token.accountId)
    res.status(201).json(result)
  } catch (error) {
    console.log(`addContact: ${error}`)
    res.status(400).end()
  }
}

async function setContact(req: Request, res: Response, next: NextFunction){
  try {
    const contactId = parseInt(req.params.id)
    if (!contactId) {
      res.status(400).end()
    }

    const token = controllerCommons.getToken(res) as TokenProps
    const contact = req.body as IContact
    const result = await repository.set(contactId, contact, token.accountId)

    if (!result) {
      return res.status(404).end()
    }

    res.json(result)
  } catch (error) {
    console.log(`setContact: ${error}`)
    res.status(400).end()
  }
}

async function deleteContact(req: Request, res: Response, next: NextFunction) {
  try {
    const contactId = parseInt(req.params.id)
    if (!contactId) {
      return res.status(400).end()
    }

    const token = controllerCommons.getToken(res) as TokenProps

    if (req.query.force === 'true') {
      await repository.removeById(contactId, token.accountId)
      res.status(200).end();
    } else {
      const contactParams = {
        status: ContactStatus.REMOVED
      } as IContact;
      
      const updatedContact = await repository.set(contactId, contactParams, token.accountId);
      
      if (updatedContact) {
        res.json(updatedContact)
      } else {
        res.status(403).end()
      }
    }
  } catch (error) {
    console.log(`deleteContact: ${error}`)
    res.status(400).end()
  }
}

export default { getContacts, getContact, addContact, setContact, deleteContact }