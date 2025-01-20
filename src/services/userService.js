import prisma from '#config/prisma.js';
import { getBasicFilters, getMyCardFilters } from '#helpers/cardFilters.js';
import { getGradeCounts } from '#helpers/getGradeCounts.js';
import userRepository from '#repositories/userRepository.js';
import { findUserByEmail } from '#services/authService.js';
import sortMapping from '#utils/sortMapping.js';

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

async function createCardService({
  name,
  description,
  image,
  grade,
  genre,
  price,
  quantity,
  ownerId,
}) {
  try {
    if (!ownerId) {
      throw new Error('ownerId가 제공되지 않았습니다.');
    }

    const newCard = await prisma.card.create({
      data: {
        name,
        description,
        imgUrl: image, // 업로드된 이미지 경로 저장
        grade,
        genre,
        price,
        totalQuantity: quantity,
        remainingQuantity: quantity,
        ownerId, // 카드 소유자의 ID
        creatorId: ownerId, // 카드 생성자의 ID
      },
    });

    return newCard;
  } catch (error) {
    console.error('포토카드 생성 실패 (서비스 계층):', error.message);
    throw new Error('포토카드 생성 실패');
  }
}

async function getMyCardList({ sort, genre, grade, ownerId, pageNum, pageSize, keyword }) {
  try {
    sort = sort && sortMapping[sort] ? sort : 'recent';
    const orderBy = sortMapping[sort];

    // 기본 필터 설정
    const filters = {
      ownerId: parseInt(ownerId, 10),
      genre: genre || undefined,
      grade: grade || undefined,
      name: keyword ? { contains: keyword } : undefined,
      // 판매 중 및 교환 중 상태를 제외
      NOT: [
        { status: 'AVAILABLE', shops: { some: {} } }, // 판매 중
        { status: 'IN_TRADE' }, // 교환 중
      ],
    };
    //  "remainingQuantity" > 0; 이 조건 추가?

    // 카드 데이터 가져오기
    const cards = await prisma.card.findMany({
      where: filters,
      include: {
        creator: {
          select: {
            id: true,
            nickName: true,
          },
        },
        shops: {
          select: {
            id: true,
          },
        },
      },
      orderBy, // 정렬 조건 적용
      skip: (pageNum - 1) * pageSize,
      take: parseInt(pageSize, 10),
    });

    // 총 카드 수 계산
    const totalCount = await prisma.card.count({ where: filters });

    // 등급별 카드 개수 계산
    const counts = await getGradeCounts(ownerId, genre, grade);

    return { data: { cards, totalCount, countsGroupByGrade: counts } };

    // const result = { data: { cards, totalCount } };
    // console.log('API 응답 데이터 (서비스 계층):', result);
    // return result;
  } catch (error) {
    console.error('MyGallery 카드 조회 실패:', error.message);
    throw new Error(`카드 데이터 처리 실패: ${error.message}`);
  }
}

async function getMyCardById({ id }) {
  try {
    if (!id || isNaN(id)) {
      throw new Error('유효하지 않은 카드 ID입니다.');
    }

    const card = await prisma.card.findUnique({
      where: {
        id: parseInt(id, 10),
      },
      select: {
        id: true,
        name: true,
        genre: true,
        grade: true,
        description: true,
        remainingQuantity: true,
        ownerId: true,
        price: true,
        totalQuantity: true,
        imgUrl: true,
        createdAt: true,
        updatedAt: true,
        owner: {
          select: {
            id: true,
            nickName: true,
          },
        },
        creator: {
          select: {
            id: true,
            nickName: true,
          },
        },
      },
    });

    // 카드가 없는 경우 처리
    if (!card) {
      throw new Error('해당 ID의 카드를 찾을 수 없습니다.');
    }

    return card;
  } catch (error) {
    console.error('보유한 카드 상세 조회 실패 (서비스 계층):', error.message);
    throw new Error('보유한 카드 상세 조회 실패');
  }
}

export const getUserSalesCards = async ({
  sort,
  genre,
  sellout, // 매진 여부
  grade,
  ownerId,
  pageNum = 1,
  pageSize = 10,
  keyword,
  cardStatus, // 판매 상태: 판매 중, 교환 대기 중
}) => {
  try {
    // 정렬 설정
    sort = sort && sortMapping[sort] ? sort : 'recent';
    const orderBy = sortMapping[sort];

    // 기본 필터 생성
    const filters = {
      ownerId: parseInt(ownerId, 10),
      genre: genre || undefined,
      grade: grade || undefined,
      name: keyword ? { contains: keyword } : undefined,
    };

    // 상태 필터 추가 (판매 중, 교환 대기 중)
    if (cardStatus) {
      filters.status = cardStatus; // 요청된 cardStatus만 필터
    } else {
      filters.status = { in: ['AVAILABLE', 'IN_TRADE'] }; // 기본 상태 필터
    }

    // 매진 여부 추가
    if (sellout === 'true') {
      filters.remainingQuantity = 0;
    } else {
      filters.remainingQuantity = { gt: 0 }; // 기본적으로 남은 수량이 0보다 큰 경우만
    }

    // 카드 데이터 가져오기
    const cards = await prisma.card.findMany({
      where: filters,
      include: {
        creator: {
          select: {
            id: true,
            nickName: true,
          },
        },
      },
      orderBy,
      skip: (pageNum - 1) * pageSize,
      take: parseInt(pageSize, 10),
    });

    // 총 카드 수 계산
    const totalCount = await prisma.card.count({ where: filters });

    // 등급별 카드 수 계산
    const counts = await getGradeCounts(ownerId, genre, grade);

    // 응답 반환
    return { data: { cards, totalCount, countsGroupByGrade: counts } };
  } catch (error) {
    console.error('MySales 카드 조회 실패:', error.message);
    throw new Error(`카드 목록 조회 실패: ${error.message}`);
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
  createCardService,
};
