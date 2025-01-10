import prisma from '../config/prisma.js';

export const checkEmailExists = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: '존재하지 않는 이메일입니다.' });
    }
    req.user = user; // 다음 단계에서 사용하기 위해 사용자 정보를 req에 저장
    next();
  } catch (error) {
    return res.status(500).json({ message: '이메일 확인 중 문제가 발생했습니다.' });
  }
};
