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

async function getMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    if (!id) {
      res.status(400).end()
    }

    const token = controllerCommons.getToken(res) as TokenProps
    const message = await repository.findById(id, token.accountId)
    if (message === null) {
      return res.status(404).end()
    } else {
      res.json(message)
    }
  } catch (error) {
    console.log(`getMessage: ${error}`)
    res.status(400).end()
  }
}

async function addMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const token = controllerCommons.getToken(res) as TokenProps
    const message = req.body as IMessage
    const result = await repository.add(message, token.accountId)
    res.status(201).json(result)
  } catch (error) {
    console.log(`addMessage: ${error}`)
    res.status(400).end()
  }
}

async function setMessage(req: Request, res: Response, next: NextFunction){
  try {
    const messageId = parseInt(req.params.id)
    if (!messageId) {
      res.status(400).end()
    }

    const token = controllerCommons.getToken(res) as TokenProps
    const message = req.body as IMessage
    const result = await repository.set(messageId, message, token.accountId)

    if (!result) {
      return res.status(404).end()
    }

    res.json(result)
  } catch (error) {
    console.log(`setMessage: ${error}`)
    res.status(400).end()
  }
}

export default { getMessages, getMessage, addMessage, setMessage }