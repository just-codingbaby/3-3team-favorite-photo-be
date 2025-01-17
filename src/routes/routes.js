import express from 'express';
import detail from '../controllers/detailController.js';
import shopController from '../controllers/shopController.js';
import authRouter from './auth.routes.js';
import userRoutes from './user.routes.js';

const router = express.Router();

// const router = express.Router({
//   mergeParams: true,
// });

router.use('/shop/cards', shopController);
router.use('/cards/detail', detail);
router.use('/users', userRoutes);
router.use('/auth', authRouter);

export default router;
