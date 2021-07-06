/*
 * Copyright 2020 The Backstage Authors
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

import ProviderIcon from '@material-ui/icons/AcUnit';
import { DefaultAuthConnector } from './DefaultAuthConnector';
import MockOAuthApi from '../../apis/implementations/OAuthRequestApi/MockOAuthApi';
import * as loginPopup from '../loginPopup';
import { UrlPatternDiscovery } from '../../apis';
import { msw } from '@backstage/test-utils';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const defaultOptions = {
  discoveryApi: UrlPatternDiscovery.compile('http://my-host/api/{{pluginId}}'),
  environment: 'production',
  provider: {
    id: 'my-provider',
    title: 'My Provider',
    icon: ProviderIcon,
  },
  oauthRequestApi: new MockOAuthApi(),
  sessionTransform: ({ expiresInSeconds, ...res }: any) => ({
    ...res,
    scopes: new Set(res.scopes.split(' ')),
    expiresAt: new Date(Date.now() + expiresInSeconds * 1000),
  }),
};

describe('DefaultAuthConnector', () => {
  const server = setupServer();
  msw.setupDefaultHandlers(server);

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should refresh a session', async () => {
    server.use(
      rest.get('*', (_req, res, ctx) =>
        res(
          ctx.json({
            idToken: 'mock-id-token',
            accessToken: 'mock-access-token',
            scopes: 'a b c',
            expiresInSeconds: '60',
          }),
        ),
      ),
    );

    const helper = new DefaultAuthConnector<any>(defaultOptions);
    const session = await helper.refreshSession();
    expect(session.idToken).toBe('mock-id-token');
    expect(session.accessToken).toBe('mock-access-token');
    expect(session.scopes).toEqual(new Set(['a', 'b', 'c']));
    expect(session.expiresAt.getTime()).toBeLessThan(Date.now() + 70000);
    expect(session.expiresAt.getTime()).toBeGreaterThan(Date.now() + 50000);
  });

  it('should handle failure to refresh session', async () => {
    server.use(
      rest.get('*', (_req, res, ctx) =>
        res(ctx.status(500, 'Error: Network NOPE')),
      ),
    );

    const helper = new DefaultAuthConnector(defaultOptions);
    await expect(helper.refreshSession()).rejects.toThrow(
      'Auth refresh request failed, Error: Network NOPE',
    );
  });

  it('should handle failure response when refreshing session', async () => {
    server.use(rest.get('*', (_req, res, ctx) => res(ctx.status(401, 'NOPE'))));

    const helper = new DefaultAuthConnector(defaultOptions);
    await expect(helper.refreshSession()).rejects.toThrow(
      'Auth refresh request failed, NOPE',
    );
  });

  it('should fail if popup was rejected', async () => {
    const mockOauth = new MockOAuthApi();
    const helper = new DefaultAuthConnector({
      ...defaultOptions,
      oauthRequestApi: mockOauth,
    });
    const promise = helper.createSession({ scopes: new Set(['a', 'b']) });
    await mockOauth.rejectAll();
    await expect(promise).rejects.toMatchObject({ name: 'RejectedError' });
  });

  it('should create a session', async () => {
    const mockOauth = new MockOAuthApi();
    const popupSpy = jest
      .spyOn(loginPopup, 'showLoginPopup')
      .mockResolvedValue({
        idToken: 'my-id-token',
        accessToken: 'my-access-token',
        scopes: 'a b',
        expiresInSeconds: 3600,
      });
    const helper = new DefaultAuthConnector({
      ...defaultOptions,
      oauthRequestApi: mockOauth,
    });

    const sessionPromise = helper.createSession({
      scopes: new Set(['a', 'b']),
    });

    await mockOauth.triggerAll();

    expect(popupSpy).toBeCalledTimes(1);
    expect(popupSpy.mock.calls[0][0]).toMatchObject({
      url:
        'http://my-host/api/auth/my-provider/start?scope=a%20b&env=production',
    });

    await expect(sessionPromise).resolves.toEqual({
      idToken: 'my-id-token',
      accessToken: 'my-access-token',
      scopes: expect.any(Set),
      expiresAt: expect.any(Date),
    });
  });

  it('should instantly show popup if option is set', async () => {
    const popupSpy = jest
      .spyOn(loginPopup, 'showLoginPopup')
      .mockResolvedValue('my-session');
    const helper = new DefaultAuthConnector({
      ...defaultOptions,
      oauthRequestApi: new MockOAuthApi(),
      sessionTransform: str => str,
    });

    const sessionPromise = helper.createSession({
      scopes: new Set(),
      instantPopup: true,
    });

    await expect(sessionPromise).resolves.toBe('my-session');

    expect(popupSpy).toBeCalledTimes(1);
  });

  it('should use join func to join scopes', async () => {
    const mockOauth = new MockOAuthApi();
    const popupSpy = jest
      .spyOn(loginPopup, 'showLoginPopup')
      .mockResolvedValue({ scopes: '' });
    const helper = new DefaultAuthConnector({
      ...defaultOptions,
      joinScopes: scopes => `-${[...scopes].join('')}-`,
      oauthRequestApi: mockOauth,
    });

    helper.createSession({ scopes: new Set(['a', 'b']) });

    await mockOauth.triggerAll();

    expect(popupSpy).toBeCalledTimes(1);
    expect(popupSpy.mock.calls[0][0]).toMatchObject({
      url:
        'http://my-host/api/auth/my-provider/start?scope=-ab-&env=production',
    });
  });
});
