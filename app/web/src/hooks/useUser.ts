import { useMutateSignInWithGoogle } from '../app/mutations/signInWithGoogle';
import { useMutateSignOut } from '../app/mutations/signOut';
import { useQueryCurrentUser } from '../app/queries/currentUser';
import { useEffect } from 'react';
import { ws } from '../app/websocket';

export const useUser = () => {
  const { data: current } = useQueryCurrentUser();
  const initials = current?.name
    .split(' ')
    .map((name: string) => name[0])
    .join('');

  const signIn = {
    google: useMutateSignInWithGoogle(),
  };

  useEffect(() => {
    if (current && !ws.isConnected) {
      ws.connect();
    }
    if (!current && ws.isConnected) {
      ws.disconnect();
    }
  }, [current]);

  const signOut = useMutateSignOut();

  return {
    current,
    initials,
    signIn,
    signOut,
  };
};
