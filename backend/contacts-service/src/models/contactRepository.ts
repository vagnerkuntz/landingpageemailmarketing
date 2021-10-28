import contactModel, { IContactModel } from "./contactModel"
import { IContact } from "./contact"

function findAll(accountId: number) {
  return contactModel.findAll<IContactModel>({ where: { accountId } })
}

async function add(contact: IContact, accountId: number) {
  contact.accountId = accountId
  const result = await contactModel.create(contact)
  contact.id = result.id
  return contact
}

function findById(contactId: number, accountId: number) {
  return contactModel.findOne<IContactModel>({ where: { id: contactId, accountId } })
}

function removeById(contactId: number, accountId: number) {
  return contactModel.destroy({ where: { id: contactId, accountId } })
}

function removeByEmail(email: string, accountId: number) {
  return contactModel.destroy({ where: { email, accountId } })
}

export default { findAll, add, removeByEmail, findById }