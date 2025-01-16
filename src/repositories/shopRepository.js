import prisma from '../config/prisma.js';
import { faker } from '@faker-js/faker';
import { Genre, Grade } from '@prisma/client';
import userService from '../services/userService.js';

async function getFilteredCards(skip, limit) {
  return prisma.card.findMany({
    skip,
    take: limit,
    include: {
      owner: {
        select: {
          nickName: true,
        },
      },
    },
  });

  // const [total, cards] = await Promise.all([
  //   prisma.card.count(),
  //   prisma.card.findMany({
  //     include: {
  //       owner: {
  //         select: {
  //           nickName: true,
  //         },
  //       },
  //     },
  //   }),
  // ]);
  // return { total, cards };
  // const cards = await prisma.card.findMany({
  //   take: limit + 1,
  //   cursor: cursor ? { id: cursor } : undefined,
  //   include: {
  //     owner: {
  //       select: {
  //         nickName: true,
  //       },
  //     },
  //   },
  // });
  //
  // const count = await prisma.card.count();
  //
  // let nextCursor = undefined;
  // if (count > limit) {
  //   const nextItem = cards.pop();
  //   nextCursor = nextItem.id;
  // }
  // return {
  //   cards,
  //   nextCursor,
  //   hasNextPage: count > limit,
  // };
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
  const totalQuantity = faker.number.int({ min: 1, max: 3 });
  const remainingQuantity = faker.number.int({ min: 0, max: totalQuantity });

  const mockData = {
    ownerId: randomUser.id,
    name: faker.book.title,
    price: faker.number.int({ min: 1, max: 10 }),
    grade: faker.helpers.enumValue(Grade),
    genre: randomGenre,
    description: faker.commerce.productDescription(),
    imgUrl: `/images/card/img_default-${randomGenre.toLowerCase()}.webp`,
    remainingQuantity: remainingQuantity,
    totalQuantity: totalQuantity,
  };

  return prisma.card.create({
    data: mockData,
  });
}

export default {
  getFilteredCards,
  create,
};