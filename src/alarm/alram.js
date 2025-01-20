import prisma from '#config/prisma.js';
import express from "express";

const app = express();
app.use(express.json());

// GET: 알림 목록 가져오기
app.get("/api/notifications", async (req, res) => {
  const { userId } = req.query;
  try {
    const alarms = await prisma.alarm.findMany({
      where: { user_id: Number(userId) },
      orderBy: { created_at: "desc" },
    });
    res.status(200).json({ success: true, data: alarms });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ success: false, message: "알림을 불러오는 데 실패했습니다." });
  }
});

// POST: 알림 생성
app.post("/api/alarms", async (req, res) => {
  const { userId, message, type } = req.body;
  try {
    const alarm = await prisma.alarm.create({
      data: {
        user_id: userId,
        message,
        type,
        is_read: false,
      },
    });
    res.status(201).json(alarm);
  } catch (error) {
    console.error("Error creating alarm:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PATCH: 알림 읽음 처리
app.patch("/api/alarms/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedAlarm = await prisma.alarm.update({
      where: { id: Number(id) },
      data: { is_read: true },
    });
    res.status(200).json({
      message: "알림이 읽음 처리되었습니다.",
      updatedAlarm,
    });
  } catch (error) {
    console.error("Error updating alarm:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE: 알림 삭제
app.delete("/api/alarms/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.alarm.delete({
      where: { id: Number(id) },
    });
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting alarm:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST: 랜덤 포인트 생성
app.post("/api/claim-points", async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const oneHour = 3600;

    if (user.lastClaimed && currentTime - user.lastClaimed < oneHour) {
      const remainingTime = oneHour - (currentTime - user.lastClaimed);
      return res.status(403).json({
        message: "아직 뽑을 수 없습니다.",
        remainingTime,
      });
    }

    const randomPoints = [500, 1000, 1500];
    const earnedPoints = randomPoints[Math.floor(Math.random() * randomPoints.length)];

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        points: (user.points || 0) + earnedPoints,
        lastClaimed: currentTime,
      },
    });

    const alarm = await prisma.alarm.create({
      data: {
        user_id: userId,
        message: `랜덤 포인트 ${earnedPoints}점을 획득했습니다!`,
        type: "REWARD",
        is_read: false,
      },
    });

    res.status(201).json({
      message: "포인트를 성공적으로 적립했습니다!",
      earnedPoints,
      totalPoints: updatedUser.points,
      alarm,
    });
  } catch (error) {
    console.error("포인트 뽑기 실패:", error);
    res.status(500).json({ message: "서버 에러" });
  }
});

// 알림 관련 포토 카드 작업
const photoCardNotifications = [
  { endpoint: "/api/photo-card-exchange-success", message: "포토 카드 교환 제안이 승인되었습니다.", type: "PHOTO_CARD_EXCHANGE_SUCCESS" },
  { endpoint: "/api/photo-card-exchange-proposal", message: "포토 카드 교환 제안이 왔습니다.", type: "PHOTO_CARD_EXCHANGE_PROPOSAL" },
  { endpoint: "/api/photo-card-purchase-complete", message: "포토 카드 구매가 완료되었습니다.", type: "PHOTO_CARD_PURCHASE_COMPLETE" },
  { endpoint: "/api/photo-card-sale-success", message: "포토 카드가 판매되었습니다.", type: "PHOTO_CARD_SALE_SUCCESS" },
  { endpoint: "/api/photo-card-out-of-stock", message: "판매 중인 포토 카드가 품절되었습니다.", type: "PHOTO_CARD_OUT_OF_STOCK" },
];

photoCardNotifications.forEach(({ endpoint, message, type }) => {
  app.post(endpoint, async (req, res) => {
    const { userId } = req.body;
    try {
      const alarm = await prisma.alarm.create({
        data: {
          user_id: userId,
          message,
          type,
          is_read: false,
        },
      });
      res.status(201).json({
        message: `${message} 알림이 생성되었습니다.`,
        alarm,
      });
    } catch (error) {
      console.error("알림 생성 실패:", error);
      res.status(500).json({ message: "서버 에러" });
    }
  });
});

export default app;
