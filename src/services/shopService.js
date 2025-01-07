import shopRepository from '../repositories/shopRepository.js';

async function getAllCards() {
  return shopRepository.getAll();
}

async function createCard() {
  return shopRepository.create();
}

export default {
  getAllCards,
  createCard,
};
