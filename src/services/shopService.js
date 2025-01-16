import shopRepository from '../repositories/shopRepository.js';

async function getCardList(skip, limit) {
  return shopRepository.getFilteredCards(skip, limit);
}

async function createCard() {
  return shopRepository.create();
}

export default {
  getCardList,
  createCard,
};