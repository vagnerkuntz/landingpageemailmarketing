import { Router } from 'express'
import middlewareCommons from 'commons/api/middlewares/authMiddleware'
import controller from '../controllers/payments'

const router = Router()

router.get('/payment/', middlewareCommons.validateAuth, controller.addPayment)

router.post('/checkout', middlewareCommons.validateAuth, controller.checkout)

router.post('/webhook', middlewareCommons.validateAuth, controller.webhook)

export default router
