/*
 * Copyright 2023 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import http from 'node:http';
import { once } from 'node:events';
import request from 'supertest';
import { WebSocket, WebSocketServer } from 'ws';
import {
  mockCredentials,
  mockServices,
  startTestBackend,
} from '@backstage/backend-test-utils';
import { signalsPlugin } from '../plugin';

async function connectWebSocket(
  server: http.Server,
  protocols?: string | string[],
): Promise<{ ws?: WebSocket; error?: Error; statusCode?: number }> {
  const { port } = server.address() as { port: number };

  return new Promise(resolve => {
    const ws = new WebSocket(`ws://127.0.0.1:${port}/api/signals`, protocols);
    let settled = false;

    const settle = (result: {
      ws?: WebSocket;
      error?: Error;
      statusCode?: number;
    }) => {
      if (settled) {
        return;
      }
      settled = true;
      if (!result.ws) {
        ws.terminate();
      }
      resolve(result);
    };

    ws.once('open', () => {
      settle({ ws });
    });

    ws.once('unexpected-response', (_req, res) => {
      settle({ statusCode: res.statusCode });
      res.resume();
    });

    ws.once('error', error => {
      // Prefer unexpected-response for HTTP upgrade failures; only fall back
      // to the error event when no response was received.
      setImmediate(() => {
        if (!settled) {
          settle({ error });
        }
      });
    });
  });
}

describe('signals framework router', () => {
  it('accepts the first WebSocket connection, authenticates users, and preserves protocol compatibility', async () => {
    const userInfo = mockServices.userInfo.mock({
      getUserInfo: async () => ({
        userEntityRef: 'user:default/test',
        ownershipEntityRefs: ['user:default/test'],
      }),
    });
    const backend = await startTestBackend({
      features: [
        signalsPlugin,
        userInfo.factory,
        mockServices.httpAuth.factory({
          defaultCredentials: mockCredentials.none(),
        }),
      ],
    });
    // No HTTP request is needed before the first upgrade.
    const first = await connectWebSocket(
      backend.server,
      mockCredentials.user.token(),
    );
    expect(first.ws?.readyState).toBe(WebSocket.OPEN);
    expect(first.ws?.protocol).toBe(mockCredentials.user.token());
    expect(userInfo.getUserInfo).toHaveBeenCalledWith(mockCredentials.user());
    first.ws?.close();
    for (const protocols of [
      undefined,
      mockCredentials.user.invalidToken(),
      mockCredentials.service.token(),
      'application-protocol',
    ]) {
      const result = await connectWebSocket(backend.server, protocols);
      expect(result.statusCode).toBe(401);
      expect(result.ws).toBeUndefined();
    }
    const mixed = await connectWebSocket(backend.server, [
      'application-protocol',
      mockCredentials.service.token(),
      mockCredentials.user.token(),
    ]);
    expect(mixed.ws?.readyState).toBe(WebSocket.OPEN);
    expect(mixed.ws?.protocol).toBe(mockCredentials.user.token());
    mixed.ws?.close();
    await request(backend.server)
      .get('/api/signals/health')
      .expect(200, { status: 'ok' });
    await request(backend.server).get('/api/signals/not-public').expect(401);
    const port = (backend.server.address() as { port: number }).port;
    const unmatched = new WebSocket(
      `ws://127.0.0.1:${port}/api/signals/unmatched`,
      mockCredentials.user.token(),
    );
    await expect(once(unmatched, 'open')).rejects.toThrow('404');
  });

  it('delivers signals only to subscribed eligible users and closes connections on shutdown', async () => {
    const events = mockServices.events();
    const backend = await startTestBackend({
      features: [
        signalsPlugin,
        mockServices.events.mock({
          publish: events.publish.bind(events),
          subscribe: events.subscribe.bind(events),
        }).factory,
      ],
    });
    const result = await connectWebSocket(
      backend.server,
      mockCredentials.user.token(),
    );
    const connection = result.ws;
    if (!connection) {
      throw new Error('Expected a WebSocket connection');
    }
    const port = (backend.server.address() as { port: number }).port;
    const other = new WebSocket(`ws://127.0.0.1:${port}/api/signals`, {
      headers: {
        authorization: mockCredentials.user.header('user:default/other'),
      },
    });
    await once(other, 'open');
    expect(other.protocol).toBe('');
    const received: string[] = [];
    other.on('message', data => received.push(data.toString()));
    connection.send(JSON.stringify({ action: 'subscribe', channel: 'test' }));
    other.send(JSON.stringify({ action: 'subscribe', channel: 'test' }));
    // A pong follows the preceding subscription frames on the same connection.
    const pong = once(connection, 'pong');
    connection.ping();
    await pong;
    const otherPong = once(other, 'pong');
    other.ping();
    await otherPong;
    const message = once(connection, 'message');
    await events.publish({
      topic: 'signals',
      eventPayload: {
        channel: 'test',
        message: { value: 'hello' },
        recipients: { type: 'user', entityRef: 'user:default/mock' },
      },
    });
    expect(JSON.parse((await message)[0].toString())).toEqual({
      channel: 'test',
      message: { value: 'hello' },
    });
    const broadcast = once(connection, 'message');
    const otherBroadcast = once(other, 'message');
    await events.publish({
      topic: 'signals',
      eventPayload: {
        channel: 'test',
        message: { value: 'everyone' },
        recipients: { type: 'broadcast' },
      },
    });
    await broadcast;
    await otherBroadcast;
    expect(received.map(value => JSON.parse(value))).toEqual([
      { channel: 'test', message: { value: 'everyone' } },
    ]);
    const closed = once(connection, 'close');
    const otherClosed = once(other, 'close');
    await backend.stop();
    await Promise.all([closed, otherClosed]);
    expect(connection.readyState).toBe(WebSocket.CLOSED);
    expect(other.readyState).toBe(WebSocket.CLOSED);
  });

  it('returns 500 when the WebSocket library fails during the handshake', async () => {
    const backend = await startTestBackend({ features: [signalsPlugin] });
    const spy = jest
      .spyOn(WebSocketServer.prototype, 'handleUpgrade')
      .mockImplementation(() => {
        throw new Error('Handshake failed');
      });
    try {
      const result = await connectWebSocket(
        backend.server,
        mockCredentials.user.token(),
      );
      expect(result.statusCode).toBe(500);
      expect(result.ws).toBeUndefined();
    } finally {
      spy.mockRestore();
    }
  });
});
