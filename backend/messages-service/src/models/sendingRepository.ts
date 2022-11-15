import sendingModel, { ISendingModel } from './sendingModel'
import { SendingStatus } from './sendingStatus'
import { ISending } from './sending'
import { v4 as uuid } from 'uuid'

  async function findQueuedOne (id: string, messageId: number, accountId: number, contactId: number) {
  try {
    const sending = sendingModel.findOne<ISendingModel>({
      where: {
        id,
        contactId,
        messageId,
        accountId,
        status: SendingStatus.QUEUED
      }
    })

    return sending
  } catch (e) {
    console.log('findQueuedOne: ', e)
    return null
  }
}

async function findByMessageId (messageId: number, accountId: number) {
  try {
    const sendings = await sendingModel.findAll<ISendingModel>({
      where: {
        messageId,
        accountId
      }
    })

    return sendings
  } catch (e) {
    console.log('findByMessageId', e)
    return null
  }
}

async function findByContactId (contactId: number, accountId: number) {
  try {
    const sendings = await sendingModel.findAll<ISendingModel>({
      where: {
        contactId,
        accountId
      }
    })

    return sendings
  } catch (e) {
    console.log('findByMessageId', e)
    return null
  }
}

async function add (sending: ISending) {
  try {
    sending.id = uuid()
    const result = await sendingModel.create(sending)
    return result
  } catch (e) {
    console.log('add: ', e)
    return null
  }
}

async function addAll (sendings: ISending[]) {
  if (!sendings || sendings.length === 0) {
    return null
  }

  try {
    sendings.forEach(item => item.id = uuid())

    const result = await sendingModel.bulkCreate(sendings)
    return result
  } catch (e) {
    console.log('add: ', e)
    return null
  }
}

async function set(sendingId: string, sending: ISending, accountId: number) {
  try {
    const originalSending = await sendingModel.findOne({
      where: {
        accountId, id: sendingId
      }
    })

    if (!originalSending) {
      return null
    }

    if (sending.status && sending.status != originalSending.status) {
      originalSending.status = sending.status
    }

    if (sending.sendDate && sending.sendDate != originalSending.sendDate) {
      originalSending.sendDate = sending.sendDate
    }

    const result = await originalSending.save()
    return result
  } catch (e) {
    console.log('set:', e)
    return null
  }
}

async function removeById (sendingId: string, accountId: number) {
  try {
    return sendingModel.destroy({
      where: {
        accountId,
        id: sendingId
      }
    })
  } catch (e) {
    console.log('removeById: ', e)
    return null
  }
}

async function hasQueuedSendings (messageId: number, accountId: number) {
  try {
    return await sendingModel.count({
      where: {
        accountId,
        messageId,
        status: SendingStatus.QUEUED
      }
    }) > 0
  } catch (e) {
    console.log('hasQueuedSendings: ', e)
    return null
  }
}

export default {
  findQueuedOne,
  findByMessageId,
  findByContactId,
  add,
  addAll,
  set,
  removeById,
  hasQueuedSendings
}