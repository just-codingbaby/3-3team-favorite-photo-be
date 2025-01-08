import express from 'express';
import { signUp } from '../controllers/authController.js';
import { checkDuplicateUser } from '../middlewares/userMiddleware.js';

const router = express.Router();

router.post('/signUp', checkDuplicateUser, signUp);

export default router;