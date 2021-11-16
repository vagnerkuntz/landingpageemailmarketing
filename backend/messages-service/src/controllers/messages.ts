import { Request, Response, NextFunction } from 'express'
import repository from '../models/messageRepository'
import controllerCommons from 'commons/api/controllers/controller'
import { TokenProps } from 'commons/api/auth'
import { IMessage } from 'src/models/message'

async function getMessages(req: Request, res: Response, next: NextFunction) {
  try {
    const token = controllerCommons.getToken(res) as TokenProps
    const messages = await repository.findAll(token.accountId)
    res.json(messages)
  } catch (error) {
    console.log(`getMessages: ${error}`)
    res.status(400).end()
  }
}
/*
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
getContact, addContact, setContact
*/
export default { getMessages }