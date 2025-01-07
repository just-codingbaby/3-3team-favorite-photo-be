import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../services/authService.js';
import prisma from '../config/prisma.js';

export const signUp = async (req, res) => {
  try {
    const { email, password, nickName } = req.body;

    if (!email || !password || !nickName) {
      return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
    }
    
    const newUser = await createUser({ email, password, nickName });

    // JWT 생성
    const accessToken = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET, // .env 파일에 JWT_SECRET을 설정해야 함
      { expiresIn: '1h' }, // 토큰 만료 시간
    );

    const refreshToken = jwt.sign(
      { id: newUser.id },
      process.env.JWT_REFRESH_SECRET, // 리프레시 토큰 비밀 키
      { expiresIn: '7d' }, // 리프레시 토큰 만료 시간
    );

    // 응답 반환
    return res.status(201).json({
      message: '회원가입이 완료되었습니다.',
      accessToken, 
      refreshToken, 
      user: { id: newUser.id, email: newUser.email, nickName: newUser.nickName },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '회원가입 실패' });
  }
};
