import prisma from '../config/prisma.js';
import { faker } from '@faker-js/faker';

async function getAll() {
  return prisma.card.findMany({
    orderBy: [
      {
        id: 'asc',
      },
      {
        price: 'asc',
      },
    ],
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
      genre: faker.helpers.arrayElement(['TRAVEL', 'LANDSCAPES', 'PORTRAITS', 'OBJECTS']),
      description: faker.commerce.productDescription(),
      imgUrl: faker.image.urlPicsumPhotos(),
      remainingQuantity: faker.number.int({ max: 3 }),
      totalQuantity: 3,
    },
  });
}

export default {
  getAll,
  create,
};
