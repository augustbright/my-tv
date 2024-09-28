'use client';
import './firebase';
import { useAuthentication } from './auth/useAuthentication';
import { Button } from '@/components/ui/Button';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { useState } from 'react';

export default function Index() {
  const auth = useAuthentication();
  const [wsClient] = useState(() => {
    const client = new W3CWebSocket(
      'ws://localhost:3101/connect',
      'echo-protocol'
    );
    client.onerror = function () {
      console.log('Connection Error');
    };

    client.onopen = function () {
      console.log('WebSocket Client Connected');
    };

    client.onclose = function () {
      console.log('echo-protocol Client Closed');
    };

    client.onmessage = function (e) {
      if (typeof e.data === 'string') {
        console.log("Received: '" + e.data + "'");
      }
    };
  });

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
