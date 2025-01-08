import prisma from '../config/prisma.js';
import { faker } from '@faker-js/faker';

async function getAll() {
  return prisma.user.findFirst();
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