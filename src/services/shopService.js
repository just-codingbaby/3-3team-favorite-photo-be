import shopRepository from '../repositories/shopRepository.js';

async function getAllCards() {
  return shopRepository.getAll();
}

async function createCard() {
  return await shopRepository.create();
}

export default {
  getAllCards,
  createCard,
};
