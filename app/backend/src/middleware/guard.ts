import { RequestHandler } from 'express';

export const guard = (): RequestHandler => (req, res, next) => {
  if (!req.user) {
    res.status(401).send('Unauthorized');
    return;
  }
  next();
};
