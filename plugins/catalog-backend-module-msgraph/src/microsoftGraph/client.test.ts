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

import * as msal from '@azure/msal-node';
import { msw } from '@backstage/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { MicrosoftGraphClient } from './client';

describe('MicrosoftGraphClient', () => {
  const confidentialClientApplication: jest.Mocked<msal.ConfidentialClientApplication> = {
    acquireTokenByClientCredential: jest.fn(),
  } as any;
  let client: MicrosoftGraphClient;
  const worker = setupServer();

  msw.setupDefaultHandlers(worker);

  beforeEach(() => {
    confidentialClientApplication.acquireTokenByClientCredential.mockResolvedValue(
      { token: 'ACCESS_TOKEN' } as any,
    );
    client = new MicrosoftGraphClient(
      'https://example.com',
      confidentialClientApplication,
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should perform raw request', async () => {
    worker.use(
      rest.get('https://other.example.com/', (_, res, ctx) =>
        res(ctx.status(200), ctx.json({ value: 'example' })),
      ),
    );

    const response = await client.requestRaw('https://other.example.com/');

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ value: 'example' });
    expect(
      confidentialClientApplication.acquireTokenByClientCredential,
    ).toBeCalledTimes(1);
    expect(
      confidentialClientApplication.acquireTokenByClientCredential,
    ).toBeCalledWith({ scopes: ['https://graph.microsoft.com/.default'] });
  });

  it('should perform simple api request', async () => {
    worker.use(
      rest.get('https://example.com/users', (_, res, ctx) =>
        res(ctx.status(200), ctx.json({ value: 'example' })),
      ),
    );

    const response = await client.requestApi('users');

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ value: 'example' });
  });

  it('should perform api request with filter, select and expand', async () => {
    worker.use(
      rest.get('https://example.com/users', (req, res, ctx) =>
        res(ctx.status(200), ctx.json({ queryString: req.url.search })),
      ),
    );

    const response = await client.requestApi('users', {
      filter: 'test eq true',
      expand: ['children'],
      select: ['id', 'children'],
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      queryString:
        '?$filter=test%20eq%20true&$select=id,children&$expand=children',
    });
  });

  it('should perform collection request for a single page', async () => {
    worker.use(
      rest.get('https://example.com/users', (_, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({
            value: ['first'],
          }),
        ),
      ),
    );

    const values = await collectAsyncIterable(
      client.requestCollection<string>('users'),
    );

    expect(values).toEqual(['first']);
  });

  it('should perform collection request for multiple pages', async () => {
    worker.use(
      rest.get('https://example.com/users', (_, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({
            value: ['first'],
            '@odata.nextLink': 'https://example.com/users2',
          }),
        ),
      ),
    );
    worker.use(
      rest.get('https://example.com/users2', (_, res, ctx) =>
        res(ctx.status(200), ctx.json({ value: ['second'] })),
      ),
    );

    const values = await collectAsyncIterable(
      client.requestCollection<string>('users'),
    );

    expect(values).toEqual(['first', 'second']);
  });

  it('should load user profile', async () => {
    worker.use(
      rest.get('https://example.com/users/user-id', (_, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({
            surname: 'Example',
          }),
        ),
      ),
    );

    const userProfile = await client.getUserProfile('user-id');

    expect(userProfile).toEqual({ surname: 'Example' });
  });

  it('should throw expection if load user profile fails', async () => {
    worker.use(
      rest.get('https://example.com/users/user-id', (_, res, ctx) =>
        res(ctx.status(404)),
      ),
    );

    await expect(() => client.getUserProfile('user-id')).rejects.toThrowError();
  });

  it('should load user profile photo with max size of 120', async () => {
    worker.use(
      rest.get('https://example.com/users/user-id/photos', (_, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({
            value: [
              {
                height: 120,
                id: 120,
              },
              {
                height: 500,
                id: 500,
              },
            ],
          }),
        ),
      ),
    );
    worker.use(
      rest.get(
        'https://example.com/users/user-id/photos/120/*',
        (_, res, ctx) => res(ctx.status(200), ctx.text('911')),
      ),
    );

    const photo = await client.getUserPhotoWithSizeLimit('user-id', 120);

    expect(photo).toEqual('data:image/jpeg;base64,OTEx');
  });

  it('should not fail if user has no profile photo', async () => {
    worker.use(
      rest.get('https://example.com/users/user-id/photos', (_, res, ctx) =>
        res(ctx.status(404)),
      ),
    );

    const photo = await client.getUserPhotoWithSizeLimit('user-id', 120);

    expect(photo).toBeFalsy();
  });

  it('should load user profile photo', async () => {
    worker.use(
      rest.get('https://example.com/users/user-id/photo/*', (_, res, ctx) =>
        res(ctx.status(200), ctx.text('911')),
      ),
    );

    const photo = await client.getUserPhoto('user-id');

    expect(photo).toEqual('data:image/jpeg;base64,OTEx');
  });

  it('should load user profile photo for size 120', async () => {
    worker.use(
      rest.get(
        'https://example.com/users/user-id/photos/120/*',
        (_, res, ctx) => res(ctx.status(200), ctx.text('911')),
      ),
    );

    const photo = await client.getUserPhoto('user-id', '120');

    expect(photo).toEqual('data:image/jpeg;base64,OTEx');
  });

  it('should load users', async () => {
    worker.use(
      rest.get('https://example.com/users', (_, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({
            value: [{ surname: 'Example' }],
          }),
        ),
      ),
    );

    const values = await collectAsyncIterable(client.getUsers());

    expect(values).toEqual([{ surname: 'Example' }]);
  });

  it('should load group profile photo with max size of 120', async () => {
    worker.use(
      rest.get('https://example.com/groups/group-id/photos', (_, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({
            value: [
              {
                height: 120,
                id: 120,
              },
            ],
          }),
        ),
      ),
    );
    worker.use(
      rest.get(
        'https://example.com/groups/group-id/photos/120/*',
        (_, res, ctx) => res(ctx.status(200), ctx.text('911')),
      ),
    );

    const photo = await client.getGroupPhotoWithSizeLimit('group-id', 120);

    expect(photo).toEqual('data:image/jpeg;base64,OTEx');
  });

  it('should load group profile photo', async () => {
    worker.use(
      rest.get('https://example.com/groups/group-id/photo/*', (_, res, ctx) =>
        res(ctx.status(200), ctx.text('911')),
      ),
    );

    const photo = await client.getGroupPhoto('group-id');

    expect(photo).toEqual('data:image/jpeg;base64,OTEx');
  });

  it('should load groups', async () => {
    worker.use(
      rest.get('https://example.com/groups', (_, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({
            value: [{ displayName: 'Example' }],
          }),
        ),
      ),
    );

    const values = await collectAsyncIterable(client.getGroups());

    expect(values).toEqual([{ displayName: 'Example' }]);
  });

  it('should load group members', async () => {
    worker.use(
      rest.get('https://example.com/groups/group-id/members', (_, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({
            value: [
              { '@odata.type': '#microsoft.graph.user' },
              { '@odata.type': '#microsoft.graph.group' },
            ],
          }),
        ),
      ),
    );

    const values = await collectAsyncIterable(
      client.getGroupMembers('group-id'),
    );

    expect(values).toEqual([
      { '@odata.type': '#microsoft.graph.user' },
      { '@odata.type': '#microsoft.graph.group' },
    ]);
  });

  it('should load organization', async () => {
    worker.use(
      rest.get('https://example.com/organization/tentant-id', (_, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({
            displayName: 'Example',
          }),
        ),
      ),
    );

    const organization = await client.getOrganization('tentant-id');

    expect(organization).toEqual({ displayName: 'Example' });
  });
});

async function collectAsyncIterable<T>(
  iterable: AsyncIterable<T>,
): Promise<T[]> {
  const values = [];
  for await (const value of iterable) {
    values.push(value);
  }
  return values;
}
