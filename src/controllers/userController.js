import sortMapping from '#utils/sortMapping.js';
import express from 'express';
import userService from '../services/userService.js';

const userController = express.Router();

// 사용자 전체 목록 조회
export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error('사용자 목록 조회 실패:', error.message);
    return res.status(500).json({ message: '사용자 목록 조회 실패' });
  }
};

userController.post('/', async (req, res) => {
  //  #swagger.tags = ['Users']
  const user = await userService.createUser();
  return res.json(user);
});

export const getProfile = async (req, res) => {
  //  #swagger.tags = ['Users']
  const { email } = req.params;

  try {
    if (!email) {
      return res.status(400).json({ message: '이메일이 제공되지 않았습니다' });
    }

    const user = await userService.getProfile(email);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

// 나의 포토카드 생성
export const createMyCard = async (req, res) => {
  try {
    const { name, description, image, grade, genre, price, quantity } = req.body;

    // 사용자 ID 확인
    if (!req.user?.id) {
      return res.status(401).json({ message: '사용자 인증이 필요합니다.' });
    }
    if (process.env.NODE_ENV === 'development') {
      console.log('createMyCard 인증된 사용자:', req.user);
    }

    // 필수 값 검증
    if (!name || !grade || !genre || !price || !quantity) {
      return res.status(400).json({ message: '필수 값이 누락되었습니다.' });
    }

    // 서비스 호출
    const newCard = await userService.createCardService({
      name,
      description,
      image,
      grade,
      genre,
      price,
      quantity,
      ownerId: req.user.id, // 요청 사용자 ID
    });

    return res.status(201).json(newCard);
  } catch (error) {
    console.error('나의 카드 생성 실패:', error.message);
    return res.status(500).json({ message: '나의 카드 생성 실패' });
  }
};

// 나의 카드 목록 조회
export const getMyCardList = async (req, res) => {
  try {
    const { sort, genre, grade, ownerId, pageNum = 1, pageSize = 10, keyword } = req.query;

    // 사용자 ID 확인
    // if (!req.user?.id) {
    //   return res.status(401).json({ message: '사용자 인증이 필요합니다.' });
    // }
    // console.log('인증된 사용자:', req.user);
    // console.log('인증된 사용자 id:', req.user.id);

    // const ownerId = req.user.id;

    if (!ownerId) {
      return res.status(400).json({ message: 'ownerId가 필요합니다.' });
    }

    // 정렬 값 검증
    const prismaSort = sortMapping[sort];
    if (!prismaSort) {
      console.warn(`Invalid sort value: ${sort}. Defaulting to "recent".`);
    }

    // 서비스 호출
    const result = await userService.getMyCardList({
      sort: prismaSort || 'recent', // 검증된 정렬 값 또는 기본값
      genre,
      grade,
      ownerId,
      pageNum,
      pageSize,
      keyword,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('나의 카드 목록 가져오기 실패:', error.message);
    return res.status(500).json({ message: '나의 카드 목록 가져오기 실패' });
  }
};

export const getUserSalesCards = async (req, res) => {
  try {
    const {
      sort,
      genre,
      sellout,
      grade,
      ownerId,
      pageNum = 1,
      pageSize = 10,
      keyword,
      cardStatus,
    } = req.query;

    if (!ownerId) {
      return res.status(400).json({ message: 'ownerId가 필요합니다.' });
    }

    // 정렬 값 검증
    const prismaSort = sortMapping[sort];
    if (!prismaSort) {
      console.warn(`Invalid sort value: ${sort}. Defaulting to "recent".`);
    }

    // 서비스 호출
    const result = await userService.getUserSalesCards({
      sort: prismaSort,
      genre,
      sellout,
      grade,
      ownerId,
      pageNum,
      pageSize,
      keyword,
      cardStatus,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('상점에 등록한 나의 카드 목록 조회 실패:', error.message);
    return res.status(500).json({ message: '상점에 등록한 나의 카드 목록 조회 실패' });
  }
};

// 보유한 포토카드 카드 상세 조회
export const getMyCardById = async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('getMyCardById start');
      console.log('req.params:', req.params);
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: '카드 ID가 제공되지 않았습니다.' });
    }

    // 서비스 호출
    const card = await userService.getMyCardById({ id });

    if (!card) {
      return res.status(404).json({ message: '카드를 찾을 수 없습니다.' });
    }

    return res.status(200).json(card);
  } catch (error) {
    console.error('카드 상세 조회 실패:', error.message);
    return res.status(500).json({ message: '카드 상세 조회 실패' });
  }
};

export default userController;
