import { RequestHandler } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { firebaseApp } from '../firebase';

export const verifySessionMiddleware: RequestHandler = async (
  req,
  res,
  next
) => {
  req.user = null;
  const sessionCookie = req.cookies.session || '';
  if (sessionCookie) {
    try {
      const decodedClaims = await getAuth(firebaseApp).verifySessionCookie(
        sessionCookie,
        true
      );
      req.user = decodedClaims;
    } catch (e) {
      console.error(e);
    }
  }
  next();
};
