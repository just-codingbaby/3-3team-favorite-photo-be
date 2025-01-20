import prisma from '#config/prisma.js';
import { faker } from '@faker-js/faker';

async function getAll() {
  const [total, users] = await Promise.all([
    prisma.user.count(),
    prisma.user.findMany({
      select: {
        id: true,
        nickName: true,
        email: true,
        points: true,
        cards: true,
        _count: {
          select: {
            cards: true,
          },
        },
      },
    }),
  ]);
  return { total, users };
}

async function create() {
  return prisma.user.create({
    data: {
      nickName: faker.internet.username(),
      password: faker.internet.password(),
      email: faker.internet.email(),
      points: faker.number.int({ min: 0, max: 50 }),
    },
  });
}

export default {
  create,
  getAll,
};
