import { isServer } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { TMessage } from 'types';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { KEY } from '@/queries/keys';
import { getQueryClient } from '@/queries/queryClient';

function clientOnly(target: WS, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function (...args: unknown[]) {
    if (isServer) {
      return;
    }
    return original.apply(this, args);
  };
}

class WS {
  #client: W3CWebSocket | null = null;

  @clientOnly
  connect() {
    this.disconnect();

    this.#client = new W3CWebSocket(
      `ws://${process.env.NEXT_PUBLIC_SERVICE_WEB_WS_HOSTNAME}:${process.env.NEXT_PUBLIC_SERVICE_WEB_WS_PORT}/${process.env.NEXT_PUBLIC_SERVICE_WEB_WS_PREFIX}`,
      'echo-protocol'
    );

    this.#client.onerror = function (error) {
      console.log('Connection Error');
    };

    this.#client.onopen = function () {
      console.log('WebSocket Client Connected');
    };

    this.#client.onclose = function () {
      console.log('echo-protocol Client Closed');
    };

    this.#client.onmessage = function (e) {
      if (typeof e.data === 'string') {
        const message: TMessage = JSON.parse(e.data);
        switch (message.type) {
          case 'dummy-notification':
            toast(message.message);
            break;
          case 'upload-finished':
            getQueryClient().invalidateQueries({ queryKey: KEY.MY_MEDIA });
            getQueryClient().invalidateQueries({
              queryKey: KEY.VIDEO(message.video.id),
            });
            break;
        }
        console.log("Received: '" + e.data + "'");
      }
    };
  }

  @clientOnly
  disconnect() {
    this.#client?.close();
    this.#client = null;
  }

  get isConnected() {
    return !!this.#client;
  }
}

export const ws = new WS();
