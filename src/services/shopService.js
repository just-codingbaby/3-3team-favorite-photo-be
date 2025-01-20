import { CardStatus, Genre, Grade } from '@prisma/client';
import shopRepository from '../repositories/shopRepository.js';

const CardStatusFilterEnum = {
  onSale: CardStatus.AVAILABLE,
  soldOut: CardStatus.SOLD_OUT,
};

const CardGenreFilterEnum = {
  travel: Genre.TRAVEL,
  portrait: Genre.PORTRAIT,
  landscape: Genre.LANDSCAPE,
  object: Genre.OBJECT,
};

const CardGradeFilterEnum = {
  common: Grade.COMMON,
  rare: Grade.RARE,
  'super-rare': Grade.SUPER_RARE,
  legendary: Grade.LEGENDARY,
};

async function getCardList(skip, limit, keyword, filterName, filterValue, sortField, sortOrder) {
  let convertStrToEnum;

  if (filterName === 'status') {
    convertStrToEnum = CardStatusFilterEnum[filterValue];
  }
  if (filterName === 'genre') {
    convertStrToEnum = CardGenreFilterEnum[filterValue];
  }
  if (filterName === 'grade') {
    convertStrToEnum = CardGradeFilterEnum[filterValue];
  }

  // console.log(convertStrToEnum);

  return shopRepository.getFilteredCards(
    skip,
    limit,
    keyword,
    filterName,
    convertStrToEnum,
    sortField,
    sortOrder,
  );
}

async function createCard() {
  return shopRepository.create();
}

export default {
  getCardList,
  createCard,
};