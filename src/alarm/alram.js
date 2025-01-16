import prisma from '#config/prisma.js';

async function getHandler(req, res) {
  if (req.method === 'GET') {
    const { userId } = req.query; // 요청에서 userId 추출
    const alarms = await prisma.alarm.findMany({
      where: { user_id: Number(userId) },
      orderBy: { created_at: 'desc' },
    });
    res.status(200).json(alarms); // 알림 목록 반환
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

async function postHandler(req, res) {
  if (req.method === 'POST') {
    const { userId, message, type } = req.body; // 클라이언트에서 보낸 데이터

    const alarm = await prisma.alarm.create({
      data: {
        user_id: userId,
        message,
        type,
      },
    });

    res.status(201).json(alarm); // 생성된 알림 반환
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

async function patchHandler(req, res) {
  if (req.method === 'PATCH') {
    const { notificationId } = req.body;

    const updatedAlarm = await prisma.alarm.update({
      where: { id: notificationId },
      data: { is_read: true },
    });

    res.status(200).json(updatedAlarm);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

export { getHandler, postHandler, patchHandler };