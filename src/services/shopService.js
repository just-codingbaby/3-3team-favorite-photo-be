import shopRepository from '../repositories/shopRepository.js';

async function getCardList(skip, limit, sortField, sortOrder) {
  return shopRepository.getFilteredCards(skip, limit, sortField, sortOrder);
}

async function createCard() {
  return shopRepository.create();
}

export default {
  getCardList,
  createCard,
};
