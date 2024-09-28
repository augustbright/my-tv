import { useAuthState } from 'react-firebase-hooks/auth';
import { useMutation } from '@tanstack/react-query';
import { API, apiClient } from '../api';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

export const useAuthentication = () => {
  const [user, loadingAuthState, errorAuthState] = useAuthState(auth);
  const {
    mutate: signInWithGoogle,
    data: userCredentialWithGoogle,
    isLoading: isSigningInWithGoogle,
    error: errorWithGoogle,
  } = useMutation(async () => {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const idToken = await userCredential.user.getIdToken();
    const result = await apiClient.post(API.sessionLogin(), { idToken });
    return userCredential;
  });

  return {
    authState: { user, isLoading: loadingAuthState, error: errorAuthState },
    google: {
      signIn: signInWithGoogle,
      userCredentials: userCredentialWithGoogle,
      isSigningIn: isSigningInWithGoogle,
      error: errorWithGoogle,
    },
    isLoading: [loadingAuthState, isSigningInWithGoogle].some(Boolean),
    auth,
  };
};
