import { Router } from 'express';
import { signup, login, verifyAuth, logout, changePassword, forgotPassword, resetPassword } from '../controllers/authController';
import { validate } from '../middlewares/validate';
import { signupSchema, loginSchema } from '../schemas/authSchemas';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/logout', logout);
router.post('/verify', verifyAuth);
router.post('/change-password', authMiddleware, changePassword);

export default router;