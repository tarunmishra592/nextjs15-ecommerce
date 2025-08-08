import { Router } from 'express';
import {
  createOrder,
  listOrders,
  getOrder
} from '../controllers/orderController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validate';
import { createOrderSchema, orderIdParamSchema } from '../schemas/orderSchemas';

const router = Router();

router.use(authMiddleware);

router.post('/', validate(createOrderSchema), createOrder);
router.get('/', listOrders);
router.get('/:id', validate(orderIdParamSchema), getOrder);

export default router;
