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
    });
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.status(200).json(card);
  } catch (e) {
    console.error('error', e);
    res.status(500).json({ error: 'Server error' });
  }
});

export default detail;
