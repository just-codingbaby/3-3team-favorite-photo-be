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
  const users = await prisma.user.findMany({
    select: {
      id: true,
    },
  });

  let randomUser;

  if (users.length < 1) {
    randomUser = await userService.createUser();
  } else {
    randomUser = faker.helpers.arrayElement(users);
  }

  const randomGenre = faker.helpers.enumValue(Genre);
  const remainingQuantity = faker.number.int({ min: 0, max: 3 });
  const totalQuantity = faker.number.int({ min: 1, max: 3 });

  const mockData = {
    ownerId: randomUser.id,
    name: faker.commerce.productName(),
    price: faker.number.int({ min: 1, max: 10 }),
    grade: faker.helpers.enumValue(Grade),
    genre: randomGenre,
    description: faker.commerce.productDescription(),
    imgUrl: `/images/card/img_default-${randomGenre.toLowerCase()}.webp`,
    remainingQuantity: Math.min(remainingQuantity, totalQuantity),
    totalQuantity: Math.max(remainingQuantity, totalQuantity),
  };

  return prisma.card.create({
    data: mockData,
  });
}

export default {
  getAll,
  create,
};