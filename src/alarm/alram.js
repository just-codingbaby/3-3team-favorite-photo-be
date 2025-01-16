import prisma from '#config/prisma.js';
import express from "express";

const app = express();
app.use(express.json());

// GET: 알림 목록 가져오기
app.get("/api/alarms", async (req, res) => {
  const { userId } = req.query;
  try {
    const alarms = await prisma.alarm.findMany({
      where: { user_id: Number(userId) },
      orderBy: { created_at: "desc" },
    });
    res.status(200).json(alarms);
  } catch (error) {
    console.error("Error fetching alarms:", error);
    res.status(500).json({ message: "Internal server error" });
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

    const currentTime = Math.floor(Date.now() / 1000); // 현재 시간 (초 단위)
    const oneHour = 3600; // 1시간

    // 1시간 이내 제한
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
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        points: (user.points || 0) + earnedPoints,
        lastClaimed: currentTime,
      },
    });

    // 알림 생성
    const alarm = await prisma.alarm.create({
      data: {
        user_id: userId,
        message: `랜덤 포인트 ${earnedPoints}점을 획득했습니다!`,
        type: "reward",
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

export default app;
