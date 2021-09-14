import { Router } from 'express'
import midlewareCommons from 'commons/api/routes/midlewares'

import controller from '../controllers/contacts'

const router = Router()

router.get('/contacts/', midlewareCommons.validateAuth, controller.getContacts)

export default router
