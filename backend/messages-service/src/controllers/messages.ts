import {NextFunction, Request, Response} from 'express'
import repository from '../models/messageRepository'
import messageRepository from '../models/messageRepository'
import controllerCommons from 'commons/api/controllers/controller'
import {TokenProps} from 'commons/api/auth/accountsAuth'
import {IMessage} from 'src/models/message'
import {MessageStatus} from '../models/messageStatus'
import {getContact, getContacts} from 'commons/clients/contactsService'
import queueService from 'commons/clients/queueService'
import {getAccountEmail} from 'commons/clients/accountService'
import sendingRepository from '../models/sendingRepository'
import {SendingStatus} from '../models/sendingStatus'
import {ISending} from "../models/sending";
import emailService from 'commons/clients/emailService'

async function getMessages(req: Request, res: Response, next: NextFunction) {
  try {
    const token = controllerCommons.getToken(res) as TokenProps
    const includeRemoved = req.query.includeRemoved == 'true'
    const messages = await repository.findAll(token.accountId, includeRemoved)
    return res.status(200).json(messages)
  } catch (error) {
    console.log(`getMessages: ${error}`)
    res.sendStatus(400)
  }
}

async function getMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    if (!id) {
      return res.status(400).json({
        message: 'ID is a required'
      })
    }

    const token = controllerCommons.getToken(res) as TokenProps
    const message = await repository.findById(id, token.accountId)
    if (message == null) {
      return res.status(404).json({
        message: 'message not found'
      })
    } else {
      return res.status(200).json(message)
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
    return res.status(201).json(result)
  } catch (error) {
    console.log(`addMessage: ${error}`)
    res.sendStatus(400)
  }
}

async function setMessage(req: Request, res: Response, next: NextFunction){
  try {
    const messageId = parseInt(req.params.id)
    if (!messageId) {
      return res.status(400).json({
        message: 'ID is a required'
      })
    }

    const token = controllerCommons.getToken(res) as TokenProps
    const message = req.body as IMessage
    const result = await repository.set(messageId, message, token.accountId)

    if (!result) {
      return res.status(404).json({
        message: 'message not found'
      })
    }

    return res.status(200).json(result)
  } catch (error) {
    console.log(`setMessage: ${error}`)
    res.sendStatus(400)
  }
}

async function deleteMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const messageId = parseInt(req.params.id)
    if (!messageId) {
      res.status(400).json({
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

async function scheduleMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const token = controllerCommons.getToken(res) as TokenProps

    // getting message
    const messageId = parseInt(req.params.id)
    if (!messageId) {
      return res.status(400).json({
        message: 'ID is a required'
      })
    }

    const message = await repository.findById(messageId, token.accountId)
    if (!message) {
      return res.sendStatus(403)
    }

    // getting contacts
    const contacts = await getContacts(token.jwt!)
    if (!contacts || contacts.length === 0) {
      return res.status(404).json({
        message: 'Não tem contatos para essa conta'
      })
    }

    // create as sendings
    const sendings = await sendingRepository.addAll(contacts.map(contact => {
      return {
        accountId: token.accountId,
        contactId: contact.id,
        messageId,
        status: SendingStatus.QUEUED
      }
    }))

    if (!sendings) {
      return res.status(400).json({
        message: 'Não foi possível salvar os envios'
      })
    }

    // simplify the sendings to the queue
    const messages = sendings.map(item => {
      return {
        id: item.id,
        accountId: item.accountId,
        contactId: item.contactId,
        messageId: item.messageId
      }
    })

    // send message to contacts
    const promises = queueService.sendMessageBatch(messages)
    await Promise.all(promises)

    // update message
    const messageParams = {
      status: MessageStatus.SCHEDULED,
      sendDate: new Date()
    } as IMessage

    const updatedMessage = await repository.set(messageId, messageParams, token.accountId)
    if (updatedMessage) {
      return res.status(202).json(updatedMessage)
    } else {
      return res.sendStatus(403)
    }
  } catch (error) {
    console.log(`sendMessage: ${error}`)
    res.sendStatus(400)
  }
}

async function sendMessage (req: Request, res: Response, next: NextFunction) {
  try {
    const params = req.body as ISending

    // get sending
    const sending = await sendingRepository.findQueuedOne(params.id!, params.messageId, params.accountId, params.contactId)
    if (!sending) {
      return res.status(404).json({
        message: 'sending not found'
      })
    }

    // TODO: implement cache
    // get message
    const message = await messageRepository.findById(sending.messageId, sending.accountId)
    if (!message) {
      return res.status(404).json({
        message: 'message not found'
      })
    }

    // get contact (destinatário)
    const contact = await getContact(sending.contactId, sending.accountId)
    if (!contact) {
      return res.status(404).json({
        message: 'contact not found'
      })
    }

    // get account e-mail (remetente)
    const accountEmail = await getAccountEmail(sending.accountId, message.accountEmailId)
    if (!accountEmail) {
      return res.status(404).json({
        message: 'accountEmail not found'
      })
    }

    //sending e-mail (ses)
    const result = await emailService.sendEmail(
      accountEmail.name,
      accountEmail.email,
      contact.email,
      message.subject,
      message.body
    )
    if (!result.success) {
      return res.status(400).json({
        message: 'Não foi possível enviar a mensagem'
      })
    }

    sending.status = SendingStatus.SENT
    sending.sendDate = new Date()
    await sendingRepository.set(params.id!, sending, sending.accountId)

    // update a message
    const hasMore = await sendingRepository.hasQueuedSendings(sending.messageId, sending.accountId)
    if (!hasMore) {
      message.status = MessageStatus.SENT
      message.sendDate = new Date()
      await repository.set(sending.messageId, message, sending.accountId)
    }

    return res.status(202).json(sending)
  } catch (e) {
    console.log('sendMessage: ', e)
    return res.sendStatus(400)
  }
}

export default {
  getMessages,
  getMessage,
  addMessage,
  setMessage,
  deleteMessage,
  sendMessage,
  scheduleMessage
}