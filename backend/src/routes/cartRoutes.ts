import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validate';
import {
  getCart,
  addCart,
  updateCart,
  deleteCartItem,
  clearCart
} from '../controllers/cartController';
import {
  addCartItemSchema,
  updateCartItemSchema,
  removeCartItemSchema,
} from '../schemas/cartSchemas';

const router = Router();
router.use(authMiddleware);

router.get('/', getCart);
router.post('/', validate(addCartItemSchema), addCart);
router.patch('/:productId', validate(updateCartItemSchema), updateCart);
router.delete('/empty', clearCart);
router.delete('/:productId', validate(removeCartItemSchema), deleteCartItem);

export default router;
