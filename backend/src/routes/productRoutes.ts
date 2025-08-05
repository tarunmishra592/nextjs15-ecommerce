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

const router = Router();

// Public endpoints
router.get('/', listProducts);
router.get('/:id', getProduct);

// Admin-only endpoints (for teaching, user with isAdmin flag)
router.use(authMiddleware);
router.post('/', validate(createProductSchema), createProduct);
router.put('/:id', validate(updateProductSchema), updateProduct);
router.delete('/:id', deleteProduct);

export default router;
