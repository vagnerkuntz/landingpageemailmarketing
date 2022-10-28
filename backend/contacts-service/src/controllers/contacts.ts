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
    res.sendStatus(400)
  }
}

async function getContact(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    if (!id) {
      return res.status(400).json({
        message: 'Contact ID is a required'
      })
    }

    const token = controllerCommons.getToken(res) as TokenProps
    const contact = await repository.findById(id, token.accountId)

    if (contact === null) {
      return res.sendStatus(404)
    } else {
      res.status(200).json(contact)
    }
  } catch (error) {
    console.log(`getContact: ${error}`)
    res.sendStatus(400)
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
    res.sendStatus(400)
  }
}

async function setContact(req: Request, res: Response, next: NextFunction){
  try {
    const contactId = parseInt(req.params.id)
    if (!contactId) {
      return res.status(400).json({
        message: 'Contact ID is a required'
      })
    }

    const token = controllerCommons.getToken(res) as TokenProps
    const contact = req.body as IContact
    const result = await repository.set(contactId, contact, token.accountId)

    if (!result) {
      return res.sendStatus(404)
    }

    res.status(200).json(result)
  } catch (error) {
    console.log(`setContact: ${error}`)
    res.sendStatus(400)
  }
}

async function deleteContact(req: Request, res: Response, next: NextFunction) {
  try {
    const contactId = parseInt(req.params.id)
    if (!contactId) {
      return res.sendStatus(400).json({
        message: 'ID is a required'
      })
    }

    const token = controllerCommons.getToken(res) as TokenProps

    if (req.query.force === 'true') {
      await repository.removeById(contactId, token.accountId)
      res.sendStatus(204)
    } else {
      const contactParams = {
        status: ContactStatus.REMOVED
      } as IContact;
      
      const updatedContact = await repository.set(contactId, contactParams, token.accountId);
      
      if (updatedContact) {
        res.status(200).json(updatedContact)
      } else {
        res.sendStatus(403)
      }
    }
  } catch (error) {
    console.log(`deleteContact: ${error}`)
    res.sendStatus(400)
  }
}

export default {
  getContacts,
  getContact,
  addContact,
  setContact,
  deleteContact
}