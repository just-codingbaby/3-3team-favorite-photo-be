import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../services/authService.js';
import bcrypt from 'bcrypt';
import prisma from '../config/prisma.js';
import { findUserById } from '../services/userService.js';

export const signUp = async (req, res) => {
  // #swagger.tags = ['Auth']
  try {
    const { email, password, nickName } = req.body;

    if (!email || !password || !nickName) {
      return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
    }

    const newUser = await createUser({ email, password, nickName });

    // 응답 반환
    return res.status(201).json({
      message: '회원가입이 완료되었습니다.',
      user: { id: newUser.id, email: newUser.email, nickName: newUser.nickName },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '회원가입 실패' });
  }
};

export const login = async (req, res) => {
  // #swagger.tags = ['Auth']
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
    }

    // 이메일로 유저 조회
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: '존재하지 않는 이메일입니다.' });
    }

    // 비밀번호 검증 (비밀번호 암호화 사용 시, bcrypt를 사용하여 비교해야 함)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: '비밀번호가 올바르지 않습니다.' });
    }

    // JWT 생성
    const accessToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET, // .env 파일의 JWT_SECRET 값
      { expiresIn: '1h' },
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET, // .env 파일의 JWT_REFRESH_SECRET 값
      { expiresIn: '7d' },
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 쿠키 유효 기간 1시간
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 쿠키 유효 기간 7일
    });

    // 응답 반환
    return res.status(200).json({
      message: '로그인 성공',
      user: { id: user.id, email: user.email, nickName: user.nickName },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '로그인 실패' });
  }
};

export const verify = async (req, res) => {
  // #swagger.tags = ['Auth']
  if (process.env.NODE_ENV == 'development') {
    console.log('요청 쿠키: ', req.cookies);
  }
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(401).json({ message: '토큰이 존재하지 않습니다' });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    const user = await findUserById(decoded.id);
    return res.status(200).json({
      message: '인증 성공',
      user,
    });
  } catch (error) {
    console.error('토큰 검증 실패:', error);
    return res.status(401).json({ message: '토큰이 유효하지 않습니다.' });
  }
};

export const logout = (req, res) => {
  // #swagger.tags = ['Auth']
  try {
    // 쿠키 삭제
    res.clearCookie('accessToken', { httpOnly: true, secure: true, sameSite: 'Strict' });
    res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'Strict' });

    // 로그아웃 완료 응답
    return res.status(200).json({ message: '로그아웃 성공' });
  } catch (error) {
    console.error('로그아웃 실패:', error);
    return res.status(500).json({ message: '로그아웃 실패' });
  }
};

export const refresh = async (req, res) => {
  // #swagger.tags = ['Auth']
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: '리프레시 토큰이 존재하지 않습니다.' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 쿠키 유효 기간 1시간
    });

    return res.status(200).json({
      message: '토큰 갱신 성공',
    });
  } catch (error) {
    console.error('토큰 갱신 실패:', error);
    return res.status(401).json({ message: '리프레시 토큰이 유효하지 않습니다.' });
  }
};
