import prisma from '#config/prisma.js';
import bcrypt from 'bcrypt';

export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const createUser = async ({ email, password, nickName }) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nickName,
      },
    });

    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);

    if (error.code === 'P2002') {
      throw new Error('이미 존재하는 이메일 혹은 닉네임입니다.');
    }

    throw new Error('회원가입 중 에러가 발생했습니다.');
  }
};
