import prisma from '#config/prisma.js';
import jwt from 'jsonwebtoken';

export const checkEmailExists = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: '이메일이 제공되지 않았습니다.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.log('checkEmailExists - 존재하지 않는 이메일:', email);
      return res.status(404).json({ message: '존재하지 않는 이메일입니다.' });
    }
    req.user = user; // 다음 단계에서 사용하기 위해 사용자 정보를 req에 저장
    next();
  } catch (error) {
    console.error('checkEmailExists - Prisma 에러:', error.message);
    return res.status(500).json({ message: '이메일 확인 중 문제가 발생했습니다.' });
  }
};

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.accessToken;
  // console.log('Token Received:', token); // 받은 토큰 출력
  if (!token) {
    return res.status(401).send('인증이 필요합니다.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('Decoded Token:', decoded);
    req.user = decoded; // JWT에서 디코딩된 사용자 정보
    // console.log('인증된 사용자:', req.user);
    next();
  } catch (error) {
    console.error('JWT 검증 실패:', error);
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
};
