import { Router } from 'express'
import authMiddleware from 'commons/api/middlewares/authMiddleware'
import { validateContactSchema, validateUpdateContactSchema } from './middlewares'
import controller from '../controllers/contacts'

const router = Router()

/**
 * GET /contacts/:id/account/:accountId
 * Only microservices call this route
 * Returns one contact from the account
 */
router.get('/contacts/:id/account/:accountId', authMiddleware.validateMicroserviceAuth, controller.getContact)

/**
 * GET /contacts/:id
 * Retuns one contact from the account
 */
router.get('/contacts/:id', authMiddleware.validateAccountAuth, controller.getContact)

/**
 * GET /contacts/
 * Returns all contacts from the account
 */
router.get('/contacts/', authMiddleware.validateAccountAuth, controller.getContacts)

/**
 * POST /contacts/
 * Save a contact to an account
 */
router.post('/contacts/', authMiddleware.validateAccountAuth, validateContactSchema, controller.addContact)

/**
 * PATCH /contacts/:id
 * Updates a contact from the account
 */
router.patch('/contacts/:id', authMiddleware.validateAccountAuth, validateUpdateContactSchema, controller.setContact)

/**
 * DELETE /contacts/:id
 * Soft-delete one contact from the account
 * ?force=true to really remove
 */
router.delete('/contacts/:id', authMiddleware.validateAccountAuth, controller.deleteContact)

export default router
