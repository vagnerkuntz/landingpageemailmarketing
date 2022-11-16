import { IContact } from '../contact'
import { ContactStatus } from '../contactStatus'

const SequelizeMock = require('sequelize-mock-v5')
const dbMock = new SequelizeMock()

const contactOk = {
  id: 1,
  accountId: 1,
  email: 'contato@jest.com',
  name: 'Jest',
  phone: '51123456789',
  status: ContactStatus.SUBSCRIBED,
} as IContact

const ContactMock = dbMock.define('contact', contactOk)

ContactMock.$queryInterface.$useHandler((query: any, queryOptions: any, done: any) => {
  if (query === 'findOne') {
    const id = queryOptions[0].where.id as number
    const accountId = queryOptions[0].where.accountId as number
    const email = queryOptions[0].where.email as string

    if (id && accountId) {
      if (id == 1 && accountId == 1) {
        return ContactMock.build(contactOk)
      } else {
        return null
      }
    } else if (accountId && email) {
      if (email === 'repeat@jest.com') {
        return contactOk
      } else {
        return null
      }
    } else {
      return null
    }
  }
})

export default ContactMock