import shopRepository from '../repositories/shopRepository.js';

async function getCardList(skip, limit, keyword, sortField, sortOrder) {
  return shopRepository.getFilteredCards(skip, limit, keyword, sortField, sortOrder);
}

async function createCard() {
  return shopRepository.create();
}

export default {
  getCardList,
  createCard,
};