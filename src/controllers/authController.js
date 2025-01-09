import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../services/authService.js';

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

export const login = async (req, res) => {
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
    const isPasswordValid = user.password === password; // 암호화된 경우 bcrypt.compare 사용 필요
    if (!isPasswordValid) {
      return res.status(401).json({ message: '비밀번호가 올바르지 않습니다.' });
    }

    // JWT 생성
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET, // .env 파일의 JWT_SECRET 값
      { expiresIn: '1h' },
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET, // .env 파일의 JWT_REFRESH_SECRET 값
      { expiresIn: '7d' },
    );

    // 응답 반환
    return res.status(200).json({
      message: '로그인 성공',
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, nickName: user.nickName },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '로그인 실패' });
  }
};