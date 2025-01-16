import prisma from '../config/prisma.js';

export const checkDuplicateUser = async (req, res, next) => {
  const { email, nickName } = req.body;

  try {
    // 이메일 중복 확인
    if (email) {
      const existingEmail = await prisma.user.findUnique({ where: { email } });
      if (existingEmail) {
        return res.status(409).json({ message: '이미 사용 중인 이메일입니다.' });
      }
    }

    // 닉네임 중복 확인
    if (nickName) {
      const existingNickName = await prisma.user.findUnique({ where: { nickName } });
      if (existingNickName) {
        return res.status(409).json({ message: '이미 사용 중인 닉네임입니다.' });
      }
    }

    next();
  } catch (error) {
    console.error('중복 확인 중 에러:', error);
    return res.status(500).json({ message: '중복 확인 중 에러가 발생했습니다.' });
  }
};
