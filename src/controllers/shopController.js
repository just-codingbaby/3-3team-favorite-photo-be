import express from 'express';
import shopService from '../services/shopService.js';

const shopController = express.Router();

shopController.get('/', async (req, res) => {
  const { q, grade, genre } = req.query;
  const cards = await shopService.getAllCards();
  return res.json(cards);
});

shopController.post('/', async (req, res) => {
  const card = await shopService.createCard();
  return res.json(card);
});

export default shopController;
