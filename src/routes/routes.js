import express from 'express';
import shopController from '../controllers/shopController.js';
import userController from '../controllers/userController.js';
import authRouter from './auth.routes.js';

const router = express.Router({
  mergeParams: true,
});

router.use('/shop/cards', shopController);
router.use('/users', userController);
router.use('/auth', authRouter);

export default router;