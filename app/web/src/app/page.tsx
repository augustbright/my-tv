'use client';
import { getAuth, signInAnonymously } from 'firebase/auth';
import './firebase';
import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { useMutation } from 'react-query';

const auth = getAuth();

export default function Index() {
  const [user, loading, error] = useAuthState(auth);
  const [signIn, userCredential, isSigningIn, isLoading] = useSignInWithGoogle(auth);

  return (
    <div>
      <div className="wrapper">
        <div className="container">
          {(loading || isSigningIn) && (
            <div>Hold on...</div>
          )}
          {user && <>Hi, {user.displayName}</>}
          {!user && !loading && !isSigningIn && !error && (
            <button onClick={() => signIn()}>Login</button>
          )}
        </div>
      </div>
    </div>
  );
}
