import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import {
  getWishlist,
  addWishlist,
  deleteWishlist,
} from '../controllers/wishlistController';
import { validate } from '../middlewares/validate';
import { wishlistParamSchema } from '../schemas/wishlistSchemas';

const router = Router();
router.use(authMiddleware);

router.get('/', getWishlist);
router.post('/:productId', validate(wishlistParamSchema), addWishlist);
router.delete('/:productId', validate(wishlistParamSchema), deleteWishlist);

export default router;
