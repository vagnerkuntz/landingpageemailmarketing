import { Request, Response, NextFunction } from 'express'
import repository from '../models/contactRepository'
import controllerCommons from 'commons/api/controllers/controller'
import { TokenProps } from 'commons/api/auth/accountsAuth'
import { IContact } from '../models/contact'
import { ContactStatus } from '../models/contactStatus'
import { ReqParamNotFoundError } from 'commons/api/errors/ReqParamNotFoundError'
import { ForbiddenError } from 'commons/api/errors/ForbiddenError'
import { ResourceNotFoundError } from 'commons/api/errors/ResourceNotFoundError'
import { AlteradyExistsError } from 'commons/api/errors/AlteradyExistsError';

async function getContacts(req: Request, res: Response, next: NextFunction) {
  const includeRemoved = req.query.includeRemove == 'true'
  const token = controllerCommons.getToken(res) as TokenProps
  const contacts = await repository.findAll(token.accountId, includeRemoved)
  return res.status(200).json(contacts)
}

async function getContact(req: Request, res: Response, next: NextFunction) {
  const contactId = parseInt(req.params.id) as number
  if (!contactId) {
    return next(new ReqParamNotFoundError(
      'contactId',
      'contactId is required'
    ))
  }

  let accountId = parseInt(req.params.accountId) as number
  if (!accountId) {
    const token = controllerCommons.getToken(res) as TokenProps
    accountId = token.accountId
  }

  const contact = await repository.findById(contactId, accountId)
  if (!contact) {
    return next(new ResourceNotFoundError(
      'contact',
      'contact not found'
    ))
  } else {
    return res.status(200).json(contact)
  }
}

async function addContact(req: Request, res: Response, next: NextFunction) {
  const token = controllerCommons.getToken(res) as TokenProps
  const contact = req.body as IContact

  const alreadyExists = await repository.findByEmail(contact.email, token.accountId)
  if (alreadyExists) {
    return next(new AlteradyExistsError(
      'addContact',
      'contato já existe'
    ))
  }

  const result = await repository.add(contact, token.accountId)
  return res.status(201).json(result)
}

async function setContact(req: Request, res: Response, next: NextFunction){
  const contactId = parseInt(req.params.id)
  if (!contactId) {
    return next(new ReqParamNotFoundError(
      'contactId',
      'contactId is required'
    ))
  }

  const token = controllerCommons.getToken(res) as TokenProps
  const contact = req.body as IContact
  const result = await repository.set(contactId, contact, token.accountId)

  if (!result) {
    return next(new ResourceNotFoundError(
      'setContact',
      'result not found'
    ))
  }

  return res.status(200).json(result)
}

async function deleteContact(req: Request, res: Response, next: NextFunction) {
  const contactId = parseInt(req.params.id)
  if (!contactId) {
    return next(new ReqParamNotFoundError(
      'contactId',
      'contactId is required'
    ))
  }

  const token = controllerCommons.getToken(res) as TokenProps

  if (req.query.force === 'true') {
    await repository.removeById(contactId, token.accountId)
    return res.sendStatus(204)
  } else {
    const contactParams = {
      status: ContactStatus.REMOVED
    } as IContact;

    const updatedContact = await repository.set(contactId, contactParams, token.accountId);

    if (updatedContact) {
      return res.status(200).json(updatedContact)
    } else {
      return next(new ForbiddenError(
        token.accountId,
        'deleteContact'
      ))
    }
  }
}

export default {
  getContacts,
  getContact,
  addContact,
  setContact,
  deleteContact
}