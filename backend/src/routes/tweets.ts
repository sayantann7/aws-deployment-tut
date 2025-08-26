import { Router } from 'express';
import { prisma } from '../prisma.js';
import { auth, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', async (_req, res) => {
  const tweets = await prisma.tweet.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { id: true, username: true } } }
  });
  res.json(tweets.map(t => ({
    id: t.id,
    content: t.content,
    createdAt: t.createdAt,
    author: t.author
  })));
});

router.post('/', auth, async (req: AuthRequest, res) => {
  const { content } = req.body;
  if (!content || content.length === 0 || content.length > 280) {
    return res.status(400).json({ error: 'Invalid content' });
  }
  const tweet = await prisma.tweet.create({ data: { content, authorId: req.user!.id } });
  res.json(tweet);
});

export default router;
