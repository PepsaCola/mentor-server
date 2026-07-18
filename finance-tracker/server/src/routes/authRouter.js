import { Router } from 'express';

import authController from '../controllers/authController.js';
import authenticate from '../middleware/authenticate.js';

const authRouter = Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.get('/me', authenticate, authController.getCurrentUser);

export default authRouter;
