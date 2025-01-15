import express from 'express';
import shopController from '../controllers/shopController.js';
import userRoutes from './user.routes.js';
import authRouter from './auth.routes.js';

const router = express.Router();

// const router = express.Router({
//   mergeParams: true,
// });

router.use('/shop/cards', shopController);
router.use('/users', userRoutes);
router.use('/auth', authRouter);

export default router;
