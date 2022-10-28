import {NextFunction, Request, Response} from 'express'
import repository from '../models/messageRepository'
import controllerCommons from 'commons/api/controllers/controller'
import {TokenProps} from 'commons/api/auth'
import {IMessage} from 'src/models/message'
import {MessageStatus} from "../models/messageStatus";
import {getContacts} from "commons/clients/contactsService";
import queueService from "../queueService";
import { IQueueMessage} from "../models/queueMessage";

async function getMessages(req: Request, res: Response, next: NextFunction) {
  try {
    const token = controllerCommons.getToken(res) as TokenProps
    const includeRemoved = req.query.includeRemoved == 'true'
    const messages = await repository.findAll(token.accountId, includeRemoved)
    res.status(200).json(messages)
  } catch (error) {
    console.log(`getMessages: ${error}`)
    res.sendStatus(400)
  }
}

async function getMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    if (!id) {
      res.sendStatus(400).json({
        message: 'ID is a required'
      })
    }

    const token = controllerCommons.getToken(res) as TokenProps
    const message = await repository.findById(id, token.accountId)
    if (message === null) {
      return res.sendStatus(404)
    } else {
      res.json(message)
    }
  } catch (error) {
    console.log(`getMessage: ${error}`)
    res.sendStatus(400)
  }
}

async function addMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const token = controllerCommons.getToken(res) as TokenProps
    const message = req.body as IMessage
    const result = await repository.add(message, token.accountId)
    res.sendStatus(201).json(result)
  } catch (error) {
    console.log(`addMessage: ${error}`)
    res.sendStatus(400)
  }
}

async function setMessage(req: Request, res: Response, next: NextFunction){
  try {
    const messageId = parseInt(req.params.id)
    if (!messageId) {
      res.sendStatus(400).json({
        message: 'ID is a required'
      })
    }

    const token = controllerCommons.getToken(res) as TokenProps
    const message = req.body as IMessage
    const result = await repository.set(messageId, message, token.accountId)

    if (!result) {
      return res.sendStatus(404)
    }

    res.json(result)
  } catch (error) {
    console.log(`setMessage: ${error}`)
    res.sendStatus(400)
  }
}

async function deleteMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const messageId = parseInt(req.params.id)
    if (!messageId) {
      res.sendStatus(400).json({
        message: 'ID is a required'
      })
    }

    const token = controllerCommons.getToken(res) as TokenProps

    if (req.query.force === 'true') {
      await repository.removeById(messageId, token.accountId)
      res.sendStatus(204)
    } else {
      const messageParams = {
        status: MessageStatus.REMOVED
      } as IMessage

      const updatedMessage = await repository.set(messageId, messageParams, token.accountId)

      if (updatedMessage) {
        res.status(200).json(updatedMessage)
      } else {
        res.sendStatus(403)
      }
    }
  } catch (error) {
    console.log(`deleteMessage: ${error}`)
    res.sendStatus(400)
  }
}

async function sendMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const token = controllerCommons.getToken(res) as TokenProps

    // getting message
    const messageId = parseInt(req.params.id)
    if (!messageId) {
      return res.sendStatus(400).json({
        message: 'ID is a required'
      })
    }

    const message = repository.findById(messageId, token.accountId)
    if (!message) {
      return res.sendStatus(403)
    }

    // getting contacts
    const contacts = await getContacts(token.jwt!)
    if (!contacts || contacts.length === 0) {
      return res.sendStatus(400)
    }

    // send message to contacts
    const promises = contacts.map(item => {
      return queueService.sendMessage({
        accountId: token.accountId,
        contactId: item.id,
        messageId
      } as IQueueMessage)
    })

    await Promise.all(promises)

    // update message
    const messageParams = {
      status: MessageStatus.SENT,
      sendDate: new Date()
    } as IMessage

    const updatedMessage = await repository.set(messageId, messageParams, token.accountId)
    if (updatedMessage) {
      return res.status(200).json(updatedMessage)
    } else {
      return res.sendStatus(403)
    }
  } catch (error) {
    console.log(`sendMessage: ${error}`)
    res.sendStatus(400)
  }
}

export default {
  getMessages,
  getMessage,
  addMessage,
  setMessage,
  deleteMessage,
  sendMessage
}