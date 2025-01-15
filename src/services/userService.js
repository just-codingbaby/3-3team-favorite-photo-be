import userRepository from '../repositories/userRepository.js';
import { findUserByEmail } from './authService.js';
import prisma from '../config/prisma.js';

async function getAllUsers() {
  return userRepository.getAll();
}

async function createUser() {
  return userRepository.create();
}

export const findAllUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        nickName: true,
      },
    });

    return users;
  } catch (error) {
    console.error('Error fetching all users:', error.message);
    throw new Error('Failed to fetch users');
  }
};

export const findUserById = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        nickName: true,
      },
    });

    return user;
  } catch (err) {
    throw new Error('findUserById에서 오류가 발생했습니다');
  }
};

async function getProfile(email) {
  const data = await findUserByEmail(email);
  if (!data) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  const user = {
    email: data.email,
    nickName: data.nickName,
    points: data.points,
  };
  return user;
}

async function createMyCard({ name, description, image, grade, genre, price, quantity, ownerId }) {
  try {
    const newCard = await prisma.card.create({
      data: {
        name,
        description,
        imgUrl: image,
        grade,
        genre,
        price,
        totalQuantity: quantity,
        remainingQuantity: quantity,
        ownerId,
      },
    });

    return newCard;
  } catch (error) {
    console.error('나의 카드 생성 실패 (서비스 계층):', error.message);
    throw new Error('나의 카드 생성 실패');
  }
}

// keyword: 카드 이름에서 특정 키워드가 포함된 항목만 필터링.
// sellout: 매진 여부를 필터링. true인 경우 남은 수량(remainingQuantity)이 0인 카드만 조회
async function getMyCardList({ sort, genre, sellout, grade, ownerId, pageNum, pageSize, keyword }) {
  try {
    // 카드 데이터 가져오기
    const cards = await prisma.card.findMany({
      where: {
        ownerId: ownerId ? parseInt(ownerId, 10) : undefined,
        genre: genre || undefined,
        grade: grade || undefined,
        name: keyword ? { contains: keyword } : undefined,
        remainingQuantity: sellout === 'true' ? 0 : undefined,
      },
      orderBy: sort ? { [sort]: 'desc' } : undefined,
      skip: (pageNum - 1) * pageSize,
      take: parseInt(pageSize, 10),
    });

    // 총 카드 수 계산
    const totalCount = await prisma.card.count({
      where: {
        ownerId: ownerId ? parseInt(ownerId, 10) : undefined,
        genre: genre || undefined,
        grade: grade || undefined,
        name: keyword ? { contains: keyword } : undefined,
        remainingQuantity: sellout === 'true' ? 0 : undefined,
      },
    });

    // 등급별 카드 개수 계산
    const countsGroupByGrade = await prisma.card.groupBy({
      by: ['grade'],
      where: {
        ownerId: ownerId ? parseInt(ownerId, 10) : undefined,
      },
      _count: {
        grade: true,
      },
    });

    // 응답 데이터 형식화
    const counts = {
      COMMON: countsGroupByGrade.find((g) => g.grade === 'COMMON')?._count.grade || 0,
      RARE: countsGroupByGrade.find((g) => g.grade === 'RARE')?._count.grade || 0,
      SUPER_RARE: countsGroupByGrade.find((g) => g.grade === 'SUPER_RARE')?._count.grade || 0,
      LEGENDARY: countsGroupByGrade.find((g) => g.grade === 'LEGENDARY')?._count.grade || 0,
    };

    return { data: { cards, totalCount, countsGroupByGrade: counts } };

    // const result = { data: { cards, totalCount } };
    // console.log('API 응답 데이터 (서비스 계층):', result);
    // return result;
  } catch (error) {
    console.error('나의 카드 데이터 가져오기 실패 (서비스 계층):', error.message);
    throw new Error('나의 카드 데이터 가져오기 실패');
  }
}

async function getMyCardById({ id }) {
  try {
    const card = await prisma.card.findUnique({
      where: {
        id: parseInt(id, 10),
      },
      select: {
        id: true,
        name: true,
        genre: true,
        grade: true,
        remainingQuantity: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return card;
  } catch (error) {
    console.error('보유한 카드 상세 조회 실패 (서비스 계층):', error.message);
    throw new Error('보유한 카드 상세 조회 실패');
  }
}

export const getUserSalesCards = async ({
  sort,
  genre,
  sellout,
  grade,
  ownerId,
  pageNum,
  pageSize,
  keyword,
  cardStatus,
}) => {
  try {
    // 카드 목록 가져오기
    const cards = await prisma.card.findMany({
      where: {
        ownerId: ownerId ? parseInt(ownerId, 10) : undefined,
        genre: genre || undefined,
        grade: grade || undefined,
        name: keyword ? { contains: keyword } : undefined,
        remainingQuantity: sellout === 'true' ? 0 : undefined,
        cardStatus: cardStatus || undefined,
      },
      orderBy: sort ? { [sort]: 'desc' } : undefined,
      skip: (pageNum - 1) * pageSize,
      take: parseInt(pageSize, 10),
    });

    // 총 카드 수 계산
    const totalCount = await prisma.card.count({
      where: {
        ownerId: ownerId ? parseInt(ownerId, 10) : undefined,
        genre: genre || undefined,
        grade: grade || undefined,
        name: keyword ? { contains: keyword } : undefined,
        remainingQuantity: sellout === 'true' ? 0 : undefined,
        cardStatus: cardStatus || undefined,
      },
    });

    // 등급별 카드 개수 계산
    const countsGroupByGrade = await prisma.card.groupBy({
      by: ['grade'],
      where: {
        ownerId: ownerId ? parseInt(ownerId, 10) : undefined,
        genre: genre || undefined,
        grade: grade || undefined,
        name: keyword ? { contains: keyword } : undefined,
        remainingQuantity: sellout === 'true' ? 0 : undefined,
        cardStatus: cardStatus || undefined,
      },
      _count: {
        grade: true,
      },
    });

    // 응답 데이터 형식화
    const counts = {
      COMMON: countsGroupByGrade.find((g) => g.grade === 'COMMON')?._count.grade || 0,
      RARE: countsGroupByGrade.find((g) => g.grade === 'RARE')?._count.grade || 0,
      SUPER_RARE: countsGroupByGrade.find((g) => g.grade === 'SUPER_RARE')?._count.grade || 0,
      LEGENDARY: countsGroupByGrade.find((g) => g.grade === 'LEGENDARY')?._count.grade || 0,
    };

    return { data: { shops: cards, totalCount, countsGroupByGrade: counts } };
  } catch (error) {
    console.error('상점에 등록한 나의 카드 목록 조회 실패 (서비스 계층):', error.message);
    throw new Error('상점에 등록한 나의 카드 목록 조회 실패');
  }
};

export default {
  createUser,
  getAllUsers,
  getProfile,
  findAllUsers,
  getMyCardList,
  getMyCardById,
  getUserSalesCards,
  createMyCard,
};
