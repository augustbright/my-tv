import { Router } from 'express';
import { userRouter } from './userRouter';
import { mediaRouter } from './mediaRouter';

export const apiRouter = Router();

apiRouter.get('/', (req, res) => {
  res.send({ message: 'Welcome to backend!' });
});

apiRouter.use('/user', userRouter);
apiRouter.use('/media', mediaRouter);
