// 기본 필터링 함수
export const getBasicFilters = (ownerId, genre, grade, keyword) => {
  return {
    ownerId: ownerId ? parseInt(ownerId, 10) : undefined, // 문자열을 Int로 변환
    genre: genre || undefined,
    grade: grade || undefined,
    name: keyword ? { contains: keyword } : undefined,
    remainingQuantity: { gt: 0 }, // 남은 카드가 있는 경우만
  };
};

// 내가 생성한 카드 필터
// export const getCreatedCardFilters = (ownerId) => {
//   return {
//     creatorId: ownerId ? parseInt(ownerId, 10) : undefined,
//     tradeStatus: 'CREATED',
//   };
// };

// 내가 구매한 카드 필터
export const getPurchasedCardFilters = (ownerId) => {
  return {
    ownerId: ownerId ? parseInt(ownerId, 10) : undefined, // 현재 사용자가 소유자
    // NOT: { creatorId: ownerId }, // 본인이 생성하지 않은 카드
    tradeStatus: 'SOLD', // 판매 완료 상태
  };
};

// 내가 교환 완료한 카드 필터
export const getTradedCardFilters = (ownerId) => {
  return {
    ownerId: ownerId ? parseInt(ownerId, 10) : undefined,
    tradeStatus: 'TRADED',
  };
};

// groupBy 쿼리용 필터
export const getGroupByFilters = (ownerId, genre, grade) => {
  return {
    ownerId: ownerId ? parseInt(ownerId, 10) : undefined,
    genre: genre || undefined,
    grade: grade || undefined,
    OR: [
      // getCreatedCardFilters(ownerId),
      getPurchasedCardFilters(ownerId),
      getTradedCardFilters(ownerId),
    ],
  };
};

// 최종 필터 조합
export const getMyCardFilters = (ownerId, genre, grade, keyword) => {
  const basicFilters = getBasicFilters(ownerId, genre, grade, keyword);
  return {
    ...basicFilters,
    OR: [
      // { ...getCreatedCardFilters(ownerId), status: { not: 'AVAILABLE' } }, // 판매 중이 아닌 본인이 생성한 카드
      getPurchasedCardFilters(ownerId),
      getTradedCardFilters(ownerId),
    ],
  };
};
