import express from 'express';
import { signUp, verify } from '../controllers/authController.js';
import { checkDuplicateUser } from '../middlewares/userMiddleware.js';
import { login, logout} from '../controllers/authController.js';
import { checkEmailExists } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signUp', checkDuplicateUser, signUp);

router.post('/login', checkEmailExists, login);

router.post('/logout', logout);

router.get('/verify', verify);

export default router;