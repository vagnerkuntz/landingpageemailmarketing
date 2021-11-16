import { Router } from 'express'
import middlewareCommons from 'commons/api/routes/midlewares'
// import { validateMessageSchema, validateUpdateMessageSchema } from './middlewares'
import controller from '../controllers/messages'

const router = Router()

router.get('/contacts/', middlewareCommons.validateAuth, controller.getMessages)

export default router
