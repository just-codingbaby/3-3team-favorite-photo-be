import prisma from '#config/prisma.js';
import { getGroupByFilters } from '#helpers/cardFilters.js';

export const getGradeCounts = async (ownerId, genre, grade) => {
  const groupByFilters = getGroupByFilters(ownerId, genre, grade);
  const countsGroupByGrade = await prisma.card.groupBy({
    by: ["grade"],
    where: groupByFilters,
    _count: { grade: true },
  });

  return {
    COMMON: countsGroupByGrade.find((g) => g.grade === "COMMON")?._count.grade || 0,
    RARE: countsGroupByGrade.find((g) => g.grade === "RARE")?._count.grade || 0,
    SUPER_RARE: countsGroupByGrade.find((g) => g.grade === "SUPER_RARE")?._count.grade || 0,
    LEGENDARY: countsGroupByGrade.find((g) => g.grade === "LEGENDARY")?._count.grade || 0,
  };
};