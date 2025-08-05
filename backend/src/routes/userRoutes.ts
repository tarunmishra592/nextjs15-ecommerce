import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  addAddress,
  listAddresses,
} from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validate';
import { updateProfileSchema, changePasswordSchema, addressSchema } from '../schemas/userSchemas';

const router = Router();

router.use(authMiddleware);

router.get('/profile', getProfile);
router.patch('/profile', validate(updateProfileSchema), updateProfile);
router.patch('/change-password', validate(changePasswordSchema), changePassword);

router.post('/addresses', validate(addressSchema), addAddress);
router.get('/addresses', listAddresses);

export default router;
