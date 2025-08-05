import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validate';
import { createReviewSchema, reviewIdParamSchema } from '../schemas/reviewSchemas';
import { addReview, listReviews, deleteReview } from '../controllers/reviewController';

const router = Router({ mergeParams: true }); // merge productId if nested

router.use(authMiddleware);

// POST /api/products/:productId/reviews
router.post('/', validate(createReviewSchema), addReview);

// GET /api/products/:productId/reviews
router.get('/', listReviews);

// DELETE /api/products/:productId/reviews/:id
router.delete('/:id', validate(reviewIdParamSchema), deleteReview);

export default router;
