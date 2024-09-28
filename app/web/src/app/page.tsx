'use client';
import { useQuery } from '@tanstack/react-query';
import './firebase';
import { useAuthentication } from './auth/useAuthentication';
import { Button } from '@/components/ui/Button';
import { signOut } from 'firebase/auth';
import { queryCurrentUser } from './queries/currentUser';

export default function Index() {
  const auth = useAuthentication();
  const { data } = useQuery(queryCurrentUser());

  return (
    <div>
      <div className="wrapper">
        <div className="container">
          <pre>{JSON.stringify(data, null, 3)}</pre>
          {auth.isLoading ? (
            <div>Authentication...</div>
          ) : (
            <>
              {!!auth.authState.user && (
                <div>
                  <div>Hi, {auth.authState.user.displayName}</div>
                  <div>
                    <Button onClick={() => signOut(auth.auth)}>Logout</Button>
                  </div>
                </div>
              )}
              {!auth.authState.user && (
                <Button onClick={() => auth.google.signIn()}>Login</Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
