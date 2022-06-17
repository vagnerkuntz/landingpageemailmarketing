import { Router } from 'express'
import middlewareCommons from 'commons/api/routes/midlewares'
import controller from '../controllers/payments'

const router = Router()

router.get('/payment/', middlewareCommons.validateAuth, controller.addPayment)

router.post('/checkout', middlewareCommons.validateAuth, controller.checkout)

router.post('/webhook', middlewareCommons.validateAuth, controller.webhook)

export default router
