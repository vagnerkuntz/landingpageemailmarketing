import { Router } from 'express'
import authMiddleware from 'commons/api/routes/authMiddleware'
import {
  validateMessageSchema,
  validateUpdateMessageSchema,
  validateSendingSchema
} from './middlewares'
import controller from '../controllers/messages'

const router = Router()

  /**
   * GET /messages/:id
   * Returns one message from this account
   */
router.get('/messages/:id', authMiddleware.validateAccountAuth, controller.getMessage)

/**
 * GET /messages/
 * Returns all messas from this account
 */
router.get('/messages/', authMiddleware.validateAccountAuth, controller.getMessages)

/**
 * POST /messages/
 * Add one message to this account
 */
router.post('/messages/', authMiddleware.validateAccountAuth, validateMessageSchema, controller.addMessage);

/**
 * PATCH /messages/:id
 * Updates one message from this account
 */
router.patch('/messages/:id', authMiddleware.validateAccountAuth, validateUpdateMessageSchema, controller.setMessage)

/**
 * DELETE /messages/:id
 * Soft-delete one message from this account
 * ?force=true to really remove
 */
router.delete('/messages/:id', authMiddleware.validateAccountAuth, controller.deleteMessage)

/**
 * POST /messages/:id/send
 * Front-end calls this route to send a message to a bunch of contacts
 * In fact, the message will be queued.
 */
router.post('/messages/:id/send', authMiddleware.validateAccountAuth, controller.scheduleMessage)

/**
 * POST /messages/send
 * AWS Lambda calls this route to send a message from the queue to one contact
 * The back-end will send the email
 */
router.post('/messages/sending', authMiddleware.validateMicroserviceAuth, validateSendingSchema, controller.sendMessage)

export default router
