import { Router } from 'express'
import midlewareCommons from 'commons/api/routes/midlewares'
import { validateContactSchema, validateUpdateContactSchema } from './middlewares'
import controller from '../controllers/contacts'

const router = Router()

router.get('/contacts/:id', midlewareCommons.validateAuth, controller.getContact)
router.get('/contacts/', midlewareCommons.validateAuth, controller.getContacts)
router.post('/contacts/', midlewareCommons.validateAuth, validateContactSchema, controller.addContact)

export default router
