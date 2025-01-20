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
