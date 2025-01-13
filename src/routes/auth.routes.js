import express from 'express';
import { signUp, verify } from '../controllers/authController.js';
import { checkDuplicateUser } from '../middlewares/userMiddleware.js';
import { login } from '../controllers/authController.js';
import { checkEmailExists } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signUp', checkDuplicateUser, signUp);

router.post('/login', checkEmailExists, login);

router.get('/verify', verify);

export default router;