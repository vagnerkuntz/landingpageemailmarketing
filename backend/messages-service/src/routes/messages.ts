import { Router } from 'express'
import middlewareCommons from 'commons/api/routes/midlewares'
// import { validateMessageSchema, validateUpdateMessageSchema } from './middlewares'
import controller from '../controllers/messages'

const router = Router()

router.get('/messages/', middlewareCommons.validateAuth, controller.getMessages)

export default router
