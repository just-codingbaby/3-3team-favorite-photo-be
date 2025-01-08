import express from 'express';
import { signUp } from '../controllers/authController.js';
import { checkDuplicateUser } from '../middlewares/userMiddleware.js';
import { login } from '../controllers/authController.js';
import { checkEmailExists } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signUp', checkDuplicateUser, signUp);

router.post('/login', checkEmailExists, login);

export default router;