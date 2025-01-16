import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // 알림 읽기
    const { userId } = req.query;
    try {
      const alarms = await prisma.alarm.findMany({
        where: { user_id: Number(userId) },
        orderBy: { created_at: 'desc' },
      });
      res.status(200).json(alarms);
    } catch (error) {
      console.error('Error fetching alarms:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    // 알림 생성
    const { userId, message, type } = req.body;
    try {
      const alarm = await prisma.alarm.create({
        data: {
          user_id: userId,
          message,
          type,
        },
      });
      res.status(201).json(alarm);
    } catch (error) {
      console.error('Error creating alarm:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}


import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PATCH') {
    // 알림 수정
    try {
      const updatedAlarm = await prisma.alarm.update({
        where: { id: Number(id) },
        data: { is_read: true },
      });
      res.status(200).json(updatedAlarm);
    } catch (error) {
      console.error('Error updating alarm:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    // 알림 삭제
    try {
      await prisma.alarm.delete({
        where: { id: Number(id) },
      });
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting alarm:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}


app.post("/api/claim-points", async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
    }

    const currentTime = Math.floor(Date.now() / 1000); // 현재 시간 (초 단위)
    const oneHour = 3600; // 1시간

    // 1시간 이내에 뽑기 제한
    if (user.lastClaimed && currentTime - user.lastClaimed < oneHour) {
      const remainingTime = oneHour - (currentTime - user.lastClaimed);
      return res.status(403).json({
        message: "아직 뽑을 수 없습니다.",
        remainingTime,
      });
    }

    // 랜덤 포인트 생성
    const randomPoints = [500, 1000, 1500];
    const earnedPoints =
      randomPoints[Math.floor(Math.random() * randomPoints.length)];

    // 포인트 적립 및 마지막 뽑기 시간 갱신
    const updatedUser = await prismaClient.user.update({
      where: { id: userId },
      data: {
        points: (user.points || 0) + earnedPoints,
        lastClaimed: currentTime,
      },
    });

    // **알림 생성**
    await prismaClient.alarm.create({
      data: {
        user_id: userId,
        message: `🎉 랜덤포인트를 얻을 시간이에요! ${earnedPoints} 포인트를 획득했습니다!`,
        type: "reward",
      },
    });

    res.json({
      message: "포인트를 성공적으로 적립했습니다!",
      earnedPoints,
      totalPoints: updatedUser.points,
    });
  } catch (error) {
    console.error("포인트 뽑기 실패:", error);
    res.status(500).json({ message: "서버 에러" });
  }
});
