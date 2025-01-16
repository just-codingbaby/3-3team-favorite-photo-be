import express from 'express';
import upload from '../middlewares/uploadMiddleware.js'; // 파일 업로드 미들웨어
import { authMiddleware } from '../middlewares/authMiddleware.js'; // 사용자 인증 미들웨어
import userService from '../services/userService.js'; // 포토카드 생성 서비스

const createCardRouter = express.Router();

// 통합 API: 이미지 업로드 및 포토카드 생성
createCardRouter.post('/my-cards', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    // 파일 유효성 확인
    if (!req.file) {
      return res.status(400).json({ message: '파일 업로드 실패. 파일을 확인하세요.' });
    }

    const imageUrl = `/uploads/${req.file.filename}`; // 업로드된 파일 경로
    const { name, description, grade, genre, price, quantity } = JSON.parse(req.body.data || '{}');

    // 사용자 인증 확인
    if (!req.user?.id) {
      return res.status(401).json({ message: '사용자 인증이 필요합니다.' });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('파일:', req.file.filename);
      console.log('사용자 ID', req.user.id);      
      }
  

    // 필수 값 검증
    if (!name || !grade || !genre || !price || !quantity) {
      return res.status(400).json({ message: '필수 값이 누락되었습니다.' });
    }

    // 포토카드 생성 서비스 호출
    const newCard = await userService.createCardService({
      name,
      description,
      image: imageUrl,
      grade,
      genre,
      price: parseInt(price, 10),
      quantity: parseInt(quantity, 10),
      ownerId: req.user.id, // 사용자 ID 추가
    });

    // 응답 반환
    return res.status(201).json(newCard);
  } catch (error) {
    console.error('이미지 업로드 및 카드 생성 오류:', error.message);
    return res.status(500).json({ message: '이미지 업로드 및 카드 생성 실패' });
  }
});

export default createCardRouter;
