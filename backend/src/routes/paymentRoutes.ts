import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validate';
import { createOrderSchema, verifyPaymentSchema } from '../schemas/paymentSchemas';
import { verifyOrder, webhookHandler, createOrder } from '../controllers/paymentController';

const router = Router();

router.post('/', authMiddleware, validate(createOrderSchema), createOrder);
router.post('/verify', authMiddleware, validate(verifyPaymentSchema), verifyOrder);

// optional webhook endpoint (no auth)
router.post('/webhook', webhookHandler);

export default router;
