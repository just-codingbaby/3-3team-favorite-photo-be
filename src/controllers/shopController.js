import express from 'express';
import shopService from '../services/shopService.js';

const shopController = express.Router();

shopController.get('/', async (req, res) => {
  // #swagger.tags = ['Shop']
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 30;
  const skip = (page - 1) * limit;
  const keyword = req.query.keyword?.trim() || '';
  const sortField = req.query.sortField || 'createdAt';
  const sortOrder = req.query.sortOrder || 'desc';
  const validSortFields = ['createdAt', 'price'];
  const validSortOrders = ['asc', 'desc'];
  if (!validSortFields.includes(sortField)) {
    return res.status(400).json({ message: '유효하지 않은 정렬 필드입니다.' });
  }

  if (!validSortOrders.includes(sortOrder)) {
    return res.status(400).json({ message: '유효하지 않은 정렬 순서입니다.' });
  }
  try {
    const cards = await shopService.getCardList(skip, limit, keyword, sortField, sortOrder);
    res.json(cards);
  } catch (e) {
    console.error('카드 목록 조회 중 오류 발생:', e);
    res
      .status(500)
      .json({ message: '카드 목록을 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
  }
});

shopController.post('/', async (req, res) => {
  // #swagger.tags = ['Shop']
  const card = await shopService.createCard();
  return res.json(card);
});

export default shopController;