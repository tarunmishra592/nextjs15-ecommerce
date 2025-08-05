import { Router } from 'express';
import { signup, login } from '../controllers/authController';
import { validate } from '../middlewares/validate';
import { signupSchema, loginSchema } from '../schemas/authSchemas';

const router = Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);

export default router;
