import messageModel, { IMessageModel } from "./messageModel"
import { IMessage } from "./message"
import { MessageStatus } from "./messageStatus"

function findAll(accountId: number, includeRemoved: boolean) {
  if (includeRemoved) {
    return messageModel.findAll<IMessageModel>({ where: { accountId }})
  }
  return messageModel.findAll<IMessageModel>({ where: { accountId, status: [MessageStatus.SENT, MessageStatus.CREATED] } })
}

async function add(message: IMessage, accountId: number) {
  message.accountId = accountId
  const result = await messageModel.create(message)
  message.id = result.id
  return message
}

async function set(messageId: number, message: IMessage, accountId: number) {
  const originalMessage = await messageModel.findOne({where: { id: messageId, accountId }})

  if (!originalMessage) {
    return null;
  }
  
  if (message.subject && message.subject !== originalMessage.subject) {
    originalMessage.subject = message.subject
  }

  if (message.body && message.body !== originalMessage.body) {
    originalMessage.body = message.body
  }

  if (message.accountEmailId && message.accountEmailId !== originalMessage.accountEmailId) {
    originalMessage.accountEmailId = message.accountEmailId
  }

  if (message.status && message.status !== originalMessage.status) {
    originalMessage.status = message.status
  }

  if (message.sendDate && message.sendDate !== originalMessage.sendDate) {
    originalMessage.sendDate = message.sendDate
  }

  const result = await originalMessage.save()
  message.id = result.id

  return message
}

async function findById(messageId: number, accountId: number) {
  try {
    const message = await messageModel.findOne<IMessageModel>({ where: { id: messageId, accountId: accountId } })
    return message
  } catch (error) {
    console.log(`messageRepository.findById ${error}`)
    return null
  }
}

function removeById(messageId: number, accountId: number) {
  return messageModel.destroy({ where: { id: messageId, accountId } })
}

export default { findAll, add, removeById, findById, set }