import { Router } from 'express';
import { getAuth, DecodedIdToken } from 'firebase-admin/auth';
import { firebaseApp } from '../firebase';

export const userRouter = Router();

const expiresIn = 1000 * 60 * 60 * 24 * 14;

userRouter.post('/sessionLogin', async (req, res) => {
  const idToken = req.body.idToken.toString();
  const sessionCookie = await getAuth(firebaseApp).createSessionCookie(
    idToken,
    { expiresIn }
  );
  const options = { maxAge: expiresIn, httpOnly: true, secure: true };
  res.cookie('session', sessionCookie, options);
  res.end(JSON.stringify({ status: 'success' }));
});

userRouter.get('/current', async (req, res) => {
  res.json(req.user);
});

userRouter.post('/sign-out', async (req, res) => {
  res.clearCookie('session');
  res.end(JSON.stringify({ status: 'success' }));
});
