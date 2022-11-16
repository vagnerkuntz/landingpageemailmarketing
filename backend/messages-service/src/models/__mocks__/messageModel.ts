import { IMessage } from '../message'
import { MessageStatus } from '../messageStatus'

const SequelizeMock = require('sequelize-mock-v5')
const dbMock = new SequelizeMock()

const messageOk = {
  id: 1,
  accountId: 1,
  accountEmailId: 1,
  body: 'mensagem de test',
  subject: 'assunto do jest',
  status: MessageStatus.CREATED,
} as IMessage

const messageQueued = {
  id: 2,
  accountId: 1,
  accountEmailId: 2,
  body: 'mensagem de test',
  subject: 'assunto do jest',
  status: MessageStatus.SCHEDULED,
} as IMessage

const messageSent = {
  id: 1,
  accountId: 1,
  accountEmailId: 1,
  body: 'mensagem de test',
  subject: 'assunto do jest',
  sendDate: new Date(),
  status: MessageStatus.SENT,
} as IMessage

const messageNotOk = {
  id: 1,
  accountId: 1,
  accountEmailId: 1,
  body: 'mensagem de test',
  subject: 'assunto do jest',
  status: MessageStatus.REMOVED,
} as IMessage

const MessageMock = dbMock.define('message', messageOk)

MessageMock.$queryInterface.$useHandler((query: any, queryOptions: any, done: any) => {
  if (query === 'findOne') {
    const id = queryOptions[0].where.id as number
    const accountId = queryOptions[0].where.accountId as number

    if (id && accountId) {
      if (id == 1 && accountId == 1) {
        return MessageMock.build(messageOk)
      } else if (id == 2 && accountId == 1) {
        return MessageMock.build(messageQueued)
      } else {
        return null
      }
    } else {
      return null
    }
  }
})

export default MessageMock