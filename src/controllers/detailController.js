import { PrismaClient } from '@prisma/client';
import express from 'express';

const detail = express.Router();

const prisma = new PrismaClient();

detail.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const card = await prisma.card.findUnique({
      where: { id: Number(id) },
      include: {
        exchangesTarget: {
          include: {
            offeredCard: true,
          },
        },
      },
    });

    const requesterId = card.exchangesTarget.map((v) => {
      return v.requesterId;
    });
    const owner = await prisma.user.findMany({
      where: {
        id: {
          in: requesterId,
        },
      },
    });
    const exchangerNickName = owner.map((v) => {
      return v.nickName;
    });
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.status(200).json({ ...card, exchangerNickName });
  } catch (e) {
    console.error('error', e);
    res.status(500).json({ error: 'Server error' });
  }
});

detail.get('/mycard/:id', async (req, res) => {
  try {
    const { id } = req.params; //userId
    const cardList = await prisma.card.findMany({
      where: {
        ownerId: parseInt(id), //7
      },
    });
    res.status(201).json(cardList);
  } catch (e) {
    console.error('error', e);
  }
});

detail.post('/purchase', async (req, res) => {
  const { userId, cardId, quantity } = req.body;
  try {
    // 구매자 조회
    const purchaseUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!purchaseUser) {
      return res.status(404).send('사용자를 찾을 수 없습니다.');
    }

    // 구매대상 카드 조회
    const card = await prisma.card.findUnique({
      where: { id: cardId },
    });
    if (!card) {
      return res.status(404).send('카드를 찾을 수 없습니다.');
    }

    if (card.remainingQuantity < quantity) {
      return res.status(400).send('구매할 수량이 부족합니다.');
    }

    // 판매자의 보유 카드 수량 감소
    await prisma.card.update({
      where: { id: cardId },
      data: {
        remainingQuantity: card.remainingQuantity - quantity,
      },
    });

    // 판매자 포인트 증가
    const seller = await prisma.user.findUnique({
      where: { id: Number(card.ownerId) },
    });

    await prisma.user.update({
      where: { id: Number(seller.id) },
      data: {
        points: seller.points + card.price * quantity,
      },
    });

    // 구매자에게 카드 추가
    await prisma.card.create({
      data: {
        ownerId: Number(purchaseUser.id),
        name: card.name,
        price: card.price,
        grade: card.grade,
        genre: card.genre,
        description: card.description,
        totalQuantity: quantity,
        remainingQuantity: quantity,
        imgUrl: card.imgUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: card.status,
        creatorId: Number(purchaseUser.id),
        tradeStatus: card.tradeStatus,
      },
    });

    // 구매자 포인트 차감
    await prisma.user.update({
      where: { id: Number(purchaseUser.id) },
      data: {
        points: purchaseUser.points - card.price * quantity,
      },
    });

    // 구매 기록 생성
    await prisma.purchase.create({
      data: {
        buyerId: Number(purchaseUser.id),
        cardId: cardId,
      },
    });

    res.status(201).send(true);
  } catch (e) {
    console.error('카드 구매 에러:', e);
    res.status(500).send('서버 오류로 요청을 처리할 수 없습니다.');
  }
});

detail.post('/exchange', async (req, res) => {
  const { requesterId, targetCardId, offeredCardId } = req.body;

  try {
    // 요청자 확인
    const requester = await prisma.user.findUnique({
      where: { id: requesterId },
    });
    if (!requester) {
      return res.status(404).send('요청자를 찾을 수 없습니다.');
    }

    // 카드 확인
    const offeredCard = await prisma.card.findUnique({
      where: { id: offeredCardId },
    });
    if (!offeredCard) {
      return res.status(404).send('제공된 카드를 찾을 수 없습니다.');
    }

    const targetCard = await prisma.card.findUnique({
      where: { id: targetCardId },
    });
    if (!targetCard) {
      return res.status(404).send('대상 카드를 찾을 수 없습니다.');
    }

    // Exchange 생성
    await prisma.exchange.create({
      data: {
        requesterId, // Foreign key
        targetCardId, // Foreign key
        offeredCardId, // Foreign key
      },
    });

    res.status(202).send(true);
  } catch (e) {
    console.error('교환 요청 에러:', e);
    res.status(500).send('서버 오류로 요청을 처리할 수 없습니다.');
  }
});

detail.post('/exchange/list', async (req, res) => {
  const { requesterId, targetCardId } = req.body;

  try {
    // 조건에 맞는 exchange 가져오기
    const exchanges = await prisma.exchange.findMany({
      where: {
        requesterId,
        targetCardId,
      },
    });

    // 각 exchange의 targetCardId로 카드 목록 가져오기
    const offeredCards = await Promise.all(
      exchanges.map((exchange) =>
        prisma.card.findUnique({
          where: {
            id: exchange.offeredCardId, // 각 offeredCardId에 해당하는 카드 조회
          },
          include: {
            owner: true,
          },
        }),
      ),
    );
    console.log(offeredCards);
    res.status(201).json({ exchanges, offeredCards });
  } catch (e) {
    console.error(e);
    res.status(500).send('서버 오류로 요청을 처리할 수 없습니다.');
  }
});

detail.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params; // exchnage id
  } catch (e) {
    console.error(e);
  }
});
export default detail;
