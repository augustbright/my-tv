'use client';
import './firebase';
import { useAuthentication } from './auth/useAuthentication';
import { Button } from '@/components/ui/Button';

export default function Index() {
  const auth = useAuthentication();

  return (
    <div>
      <div className="wrapper">
        <div className="container">
          {auth.isLoading ? (
            <div>Authentication...</div>
          ) : (
            <>
              {!!auth.user && (
                <div>
                  <div>Hi, {auth.user.name}</div>
                  <div>
                    <Button onClick={() => auth.signOut.mutate()}>
                      Logout
                    </Button>
                  </div>
                </div>
              )}
              {!auth.user && (
                <Button onClick={() => auth.google.signIn()}>Login</Button>
              )}
            </>
          )}
          <pre>{JSON.stringify(auth.user, null, 3)}</pre>
        </div>
      </div>
    </div>
  );
}
