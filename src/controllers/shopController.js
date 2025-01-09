import express from 'express';
import shopService from '../services/shopService.js';

const shopController = express.Router();

shopController.get('/', async (req, res) => {
  // #swagger.tags = ['Shop']
  const { q, grade, genre } = req.query;
  const cards = await shopService.getAllCards();
  return res.json(cards);
});

shopController.post('/', async (req, res) => {
  // #swagger.tags = ['Shop']
  const card = await shopService.createCard();
  return res.json(card);
});

export default shopController;