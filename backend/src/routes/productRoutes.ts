import { Router } from 'express';
import {
  createProduct,
  listProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validate';
import { createProductSchema, updateProductSchema } from '../schemas/productSchemas';
import { createReviewSchema, reviewIdParamSchema } from '../schemas/reviewSchemas';
import { addReview, deleteReview, listReviews } from '../controllers/reviewController';

const router = Router();

// Public endpoints
router.get('/', listProducts);
router.get('/:id', getProduct);


// POST /api/products/:productId/reviews
router.post('/:id/reviews', validate(createReviewSchema), addReview);

// GET /api/products/:productId/reviews
router.get('/:id/reviews', listReviews);

// DELETE /api/products/:productId/reviews/:id
router.delete('/reviews/:id', validate(reviewIdParamSchema), deleteReview);

// Admin-only endpoints (for teaching, user with isAdmin flag)
router.use(authMiddleware);
router.post('/', validate(createProductSchema), createProduct);
router.put('/:id', validate(updateProductSchema), updateProduct);
router.delete('/:id', deleteProduct);

export default router;
