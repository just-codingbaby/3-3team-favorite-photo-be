import express from 'express';
import { signUp } from '../controllers/authController.js';
import { checkDuplicateUser } from '../middlewares/userMiddleware.js';
import { login } from '../controllers/authController.js';

const router = express.Router();

router.post('/signUp', checkDuplicateUser, signUp);

//로그인
router.post('/login', login);

export default router;