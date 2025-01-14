const express = require("express");
const app = express();
const prisma = require("@prisma/client").PrismaClient;
const prismaClient = new prisma();
const cors = require("cors");

app.use(express.json());
app.use(cors());

// 1. 유저 포인트 정보 가져오기
app.get("/api/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
    }

    res.json({ points: user.points, lastClaimed: user.lastClaimed });
  } catch (error) {
    console.error("유저 정보 가져오기 실패:", error);
    res.status(500).json({ message: "서버 에러" });
  }
});

// 2. 랜덤 포인트 뽑기
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
        points: user.points + earnedPoints,
        lastClaimed: currentTime,
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

// 서버 시작
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`));
