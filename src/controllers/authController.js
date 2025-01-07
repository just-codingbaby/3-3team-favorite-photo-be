import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';


export const signUp = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
    }

    // 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: '이미 사용 중인 이메일입니다.' });
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // JWT 생성
    const accessToken = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET, // .env 파일에 JWT_SECRET을 설정해야 함
      { expiresIn: '1h' } // 토큰 만료 시간
    );

    const refreshToken = jwt.sign(
      { id: newUser.id },
      process.env.JWT_REFRESH_SECRET, // 리프레시 토큰 비밀 키
      { expiresIn: '7d' } // 리프레시 토큰 만료 시간
    );

    // 응답 반환
    return res.status(201).json({
      message: '회원가입이 완료되었습니다.',
      accessToken, // 액세스 토큰
      refreshToken, // 리프레시 토큰
      user: { id: newUser.id, email: newUser.email, name: newUser.name },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

