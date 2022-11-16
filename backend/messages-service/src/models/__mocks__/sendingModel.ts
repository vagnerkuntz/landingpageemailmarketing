import { ISending } from '../sending'
import { SendingStatus } from '../sendingStatus'

const SequelizeMock = require('sequelize-mock-v5')
const dbMock = new SequelizeMock()

const sendingOk = {
  id: 'a302c7e5-6399-4630-a2a8-b4a5cd478bdb',
  accountId: 1,
  contactId: 1,
  messageId: 1,
  status: SendingStatus.QUEUED
} as ISending

const sendingOk2 = {
  id: 'a302c7e5-6399-4630-a2a8-b4a5cd478bdb',
  accountId: 1,
  contactId: 1,
  messageId: 2,
  status: SendingStatus.QUEUED
} as ISending

const sendingSent = {
  id: 'a302c7e5-6399-4630-a2a8-b4a5cd478bdb',
  accountId: 1,
  contactId: 1,
  messageId: 1,
  sendDate: new Date(),
  status: SendingStatus.SENT
} as ISending

const sendingNotOk = {
  id: 'a302c7e5-6399-4630-a2a8-b4a5cd478bdb',
  accountId: 1,
  contactId: 1,
  messageId: 1,
  sendDate: new Date(),
  status: SendingStatus.ERROR
} as ISending


const SendingMock = dbMock.define('sending', sendingOk)

SendingMock.count = () => {
  return 0
}

SendingMock.bulkCreate = () => [sendingOk]

SendingMock.$queryInterface.$useHandler((query: any, queryOptions: any, done: any) => {
  if (query === 'findOne') {
    const id = queryOptions[0].where.id as string
    const accountId = queryOptions[0].where.accountId as number
    const contactId = queryOptions[0].where.contactId as number
    const messageId = queryOptions[0].where.messageId as number

    if (id && accountId && contactId && messageId) {
      if (id == sendingOk.id && accountId == 1 && contactId == 1 && messageId == 1) {
        return SendingMock.build(sendingOk)
      } else if (id == sendingOk.id && accountId == 1 && contactId == 1 && messageId == 2) {
        return SendingMock.build(sendingOk2)
      } else {
        return null
      }
    } else {
      return null
    }
  }
})

export default SendingMock