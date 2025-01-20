import express from 'express';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('req.file:', req.file);
    }

    if (!req.file) {
      return res.status(400).json({ message: '파일 업로드 실패. 파일을 확인하세요.' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`; // 절대 경로 생성
    res.status(201).json({ imageUrl }); // 파일 경로를 반환
  } catch (error) {
    console.error('이미지 업로드 오류:', error);
    res.status(500).json({ message: '이미지 업로드 실패' });
  }
});

export default router;
