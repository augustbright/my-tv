import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useMutateSignInWithGoogle } from '../mutations/signInWithGoogle';
import { useMutateSignOut } from '../mutations/signOut';
import { useQueryCurrentUser } from '../queries/currentUser';
import { useEffect } from 'react';
import { ws } from '../websocket';

export const useAuthentication = () => {
  const [, loadingAuthState] = useAuthState(auth);
  const { data: user } = useQueryCurrentUser();
  const {
    mutate: signInWithGoogle,
    data: userCredentialWithGoogle,
    isPending: isSigningInWithGoogle,
    error: errorWithGoogle,
  } = useMutateSignInWithGoogle();

  useEffect(() => {
    if (user && !ws.isConnected) {
      ws.connect();
    }
    if (!user && ws.isConnected) {
      ws.disconnect();
    }
  }, [user]);

  const signOut = useMutateSignOut();

  return {
    user,
    google: {
      signIn: signInWithGoogle,
      userCredentials: userCredentialWithGoogle,
      isSigningIn: isSigningInWithGoogle,
      error: errorWithGoogle,
    },
    isLoading: [loadingAuthState, isSigningInWithGoogle].some(Boolean),
    auth,
    signOut,
  };
};
