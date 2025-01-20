import prisma from '#config/prisma.js';
import userService from '#services/userService.js';
import { faker } from '@faker-js/faker';
import { Genre, Grade } from '@prisma/client';

async function getFilteredCards(
  skip,
  limit,
  keyword,
  filterName,
  filterValue,
  sortField,
  sortOrder,
) {
  const filter = [];
  if (filterName && filterValue) {
    filter.push({
      [filterName]: {
        equals: filterValue,
      },
    });
  }
  // console.log(filter);
  return prisma.card.findMany({
    skip,
    take: limit,
    where: {
      AND: [
        {
          name: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
        ...(filter || null),
      ],
    },
    orderBy: {
      [sortField]: sortOrder,
    },
    include: {
      owner: {
        select: {
          nickName: true,
        },
      },
    },
  });
}

async function create() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
    },
  });

  let randomUser;
  let randomCreator;

  if (users.length < 1) {
    randomUser = await userService.createUser();
  } else {
    randomUser = faker.helpers.arrayElement(users);
    randomCreator = faker.helpers.arrayElement(users);
  }

  const randomGenre = faker.helpers.enumValue(Genre);
  const randomGrade = faker.helpers.enumValue(Grade);
  const totalQuantity = faker.number.int({ min: 1, max: 3 });
  const remainingQuantity = faker.number.int({ min: 0, max: totalQuantity });

  const mockCardData = {
    ownerId: randomUser.id,
    creatorId: randomCreator.id,
    name: faker.music.songName(),
    price: faker.number.int({ min: 1, max: 10 }),
    grade: randomGrade,
    genre: randomGenre,
    description: faker.commerce.productDescription(),
    totalQuantity: totalQuantity,
    remainingQuantity: remainingQuantity,
    imgUrl: `/images/card/img_default-${randomGenre.toLowerCase()}.webp`,
    status: 'AVAILABLE',
    tradeStatus: 'CREATED',
  };

  return prisma.card.create({
    data: mockCardData,
  });
}

export default {
  getFilteredCards,
  create,
};