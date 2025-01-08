import prisma from '../config/prisma.js';
import { faker } from '@faker-js/faker';
import { Genre, Grade } from '@prisma/client';
import userService from '../services/userService.js';

async function getAll() {
  return prisma.card.findMany({
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
  let randomUser = await prisma.user.findFirst({
    orderBy: {
      id: ['asc', 'desc'].at(Number(faker.number.binary({ max: 1 }))),
    },
    select: {
      id: true,
    },
  });
  if (randomUser === null) {
    await userService.createUser();
    randomUser = await prisma.user.findFirst({
      orderBy: {
        id: ['asc', 'desc'].at(Number(faker.number.binary({ max: 1 }))),
      },
      select: {
        id: true,
      },
    });
  }

  const mockData = {
    ownerId: randomUser.id,
    name: faker.commerce.productName(),
    price: faker.number.int({ min: 1, max: 10 }),
    grade: faker.helpers.enumValue(Grade),
    genre: faker.helpers.enumValue(Genre),
    description: faker.commerce.productDescription(),
    imgUrl: `/images/card/img_default-${['travel', 'landscape', 'portrait', 'object'].at(0)}.webp`,
    remainingQuantity: faker.number.int({ max: 3 }),
    totalQuantity: 3,
  };

  return prisma.card.create({
    data: mockData,
  });
}

export default {
  getAll,
  create,
};