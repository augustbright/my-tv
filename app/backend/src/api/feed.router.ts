import { Router } from 'express';
import { feedService } from '../service/feed.service';

export const feedRouter = Router();

feedRouter.get('/latest', async (req, res) => {
  const result = await feedService.getLatest();
  res.json(result);
});
