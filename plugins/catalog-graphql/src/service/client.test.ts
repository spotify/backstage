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
import { CatalogClient } from './client';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { msw } from '@backstage/test-utils';

describe('Catalog GraphQL Module', () => {
  const worker = setupServer();
  msw.setupDefaultHandlers(worker);

  const baseUrl = 'http://localhost:1234';

  it('will return the entities', async () => {
    const expectedResponse = [{ id: 'something' }];

    worker.use(
      rest.get(`${baseUrl}/catalog/entities`, (_, res, ctx) =>
        res(ctx.status(200), ctx.json(expectedResponse)),
      ),
    );

    const client = new CatalogClient(baseUrl);

    const response = await client.list();

    expect(response).toEqual(expectedResponse);
  });

  it('throws an error with the text', async () => {
    const expectedResponse = 'something broke';

    worker.use(
      rest.get(`${baseUrl}/catalog/entities`, (_, res, ctx) =>
        res(ctx.status(500), ctx.text(expectedResponse)),
      ),
    );

    const client = new CatalogClient(baseUrl);

    await expect(() => client.list()).rejects.toThrow(expectedResponse);
  });
});
