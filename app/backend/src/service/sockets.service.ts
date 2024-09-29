import WebSocket from 'ws';
import { TMessage } from 'types';

export const socketsService = {
  connections: new Map<
    string,
    {
      ws: WebSocket;
      user: any;
    }
  >(),
  initSocket(ws: WebSocket, user) {
    socketsService.connections.set(user.uid, { ws, user });
    ws.on('message', (msg) => {
      ws.send(msg);
    });
    ws.on('close', () => {
      socketsService.connections.delete(user.uid);
    });
  },

  async sendToUser(uid: string, message: TMessage) {
    return new Promise<boolean>((resolve, reject) => {
      const connection = socketsService.connections.get(uid);
      if (connection) {
        connection.ws.send(JSON.stringify(message), (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        });
      } else {
        resolve(false);
      }
    });
  },

  getConnections() {
    return Array.from(socketsService.connections.values()).map((c) => ({
      user: c.user,
    }));
  },
} as const;
