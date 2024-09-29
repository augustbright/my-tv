import { Router } from 'express';
import { userRouter } from './user-router';
import { mediaRouter } from './media.router';
import { socketsService } from '../service/sockets.service';

export const apiRouter = Router();

apiRouter.get('/', (req, res) => {
  res.send({ message: 'Welcome to backend!' });
});

apiRouter.use('/user', userRouter);
apiRouter.use('/media', mediaRouter);

apiRouter.get('/send/:uid/:message', async (req, res) => {
  const { uid, message } = req.params;
  const sent = await socketsService.sendToUser(uid, {
    type: 'dummy-notification',
    message,
  });
  res.send({ sent });
});

apiRouter.get('/connections', (req, res) => {
  res.json(socketsService.getConnections());
});
