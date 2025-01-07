import prisma from '../config/prisma.js';
import { faker } from '@faker-js/faker';

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
  const userList = await prisma.user.findMany();

  return prisma.card.create({
    data: {
      ownerId: userList[0].id,
      name: faker.commerce.productName(),
      price: faker.number.int({ min: 1, max: 10 }),
      grade: faker.helpers.arrayElement(['COMMON', 'RARE', 'SUPER_RARE', 'LEGENDARY']),
      genre: faker.helpers.arrayElement(['TRAVEL', 'LANDSCAPE', 'PORTRAIT', 'OBJECT']),
      description: faker.commerce.productDescription(),
      imgUrl: '',
      remainingQuantity: faker.number.int({ max: 3 }),
      totalQuantity: 3,
    },
  });
}

export default {
  getAll,
  create,
};
