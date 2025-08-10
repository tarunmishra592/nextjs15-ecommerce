import { Router } from 'express';
import {
  createProduct,
  listProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  searchProducts
} from '../controllers/productController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validate';
import { createProductSchema, updateProductSchema } from '../schemas/productSchemas';
import { createReviewSchema, reviewIdParamSchema } from '../schemas/reviewSchemas';
import { addReview, deleteReview, listReviews } from '../controllers/reviewController';

const router = Router();

// Public endpoints
router.get('/', listProducts);
router.get('/search', searchProducts);
router.get('/:id', getProduct);
router.get('/:id/reviews', listReviews);


router.use(authMiddleware);
router.post('/', validate(createProductSchema), createProduct);
router.post('/:id/reviews', validate(createReviewSchema), addReview);
router.put('/:id', validate(updateProductSchema), updateProduct);
router.delete('/:id', deleteProduct);
router.delete('/reviews/:id', validate(reviewIdParamSchema), deleteReview);


export default router;
