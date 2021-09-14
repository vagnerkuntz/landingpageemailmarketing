import contactModel, { IContactModel } from "./contactModel"

function findAll(accountId: number) {
  return contactModel.findAll<IContactModel>({ where: { accountId } })
}

export default { findAll}