import express from 'express';
import shopService from '../services/shopService.js';

const shopController = express.Router();

shopController.get('/', async (req, res) => {
  // #swagger.tags = ['Shop']
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const skip = (page - 1) * limit;

  try {
    const cards = await shopService.getCardList(skip, limit);
    res.json(cards);
  } catch (e) {
    res.status(500).json({ message: 'Error fetching cards', e });
  }
});

shopController.post('/', async (req, res) => {
  // #swagger.tags = ['Shop']
  const card = await shopService.createCard();
  return res.json(card);
});

export default shopController;