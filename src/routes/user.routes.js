import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import {
  getAllUsers,
  getProfile,
  getMyCardList,
  getMyCardById,
  getUserSalesCards,
  createMyCard,
} from '../controllers/userController.js';

const router = express.Router();

// 나의 포토 카드 생성
router.post('/my-cards', authMiddleware, createMyCard);

// 사용자 전체 목록 조회 및 사용자 생성
router.get('/', getAllUsers);

router.get('/profile/:email', getProfile);

// /users/my-cards 경로로 보유한 카드목록 요청
router.get('/my-cards', getMyCardList);

// 내가 상점에 등록한 포토 카드 목록 조회
router.get('/my-cards/sales', getUserSalesCards);

// 보유한 포토카드 카드상세 조회 라우트
router.get('/my-cards/:id', getMyCardById);

export default router;
