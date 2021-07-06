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

import { createModule } from './module';
import { execute } from 'graphql';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { ConfigReader } from '@backstage/config';
import { ReaderEntity } from '../service/client';
import { createLogger } from 'winston';
import { msw } from '@backstage/test-utils';
import { gql } from 'apollo-server';

describe('Catalog Module', () => {
  const worker = setupServer();
  const mockCatalogBaseUrl = 'http://im.mock';
  const mockConfig = new ConfigReader({
    backend: {
      baseUrl: mockCatalogBaseUrl,
    },
  });

  msw.setupDefaultHandlers(worker);

  describe('Default Entity', () => {
    beforeEach(() => {
      const mockResponse: ReaderEntity[] = [
        {
          apiVersion: 'something',
          kind: 'Component',
          metadata: {
            annotations: {},
            etag: '123',
            generation: 1,
            labels: {},
            name: 'Ben',
            namespace: 'Blames',
            uid: '123',
          },
          spec: {
            type: 'thing',
            lifecycle: 'something',
            owner: 'auser',
          },
        },
      ];

      worker.use(
        rest.get(`${mockCatalogBaseUrl}/catalog/entities`, (_, res, ctx) =>
          res(ctx.status(200), ctx.json(mockResponse)),
        ),
      );
    });

    it('should call the catalog client when requesting entities', async () => {
      const { schema } = await createModule({
        config: mockConfig,
        logger: createLogger(),
      });

      const result = await execute({
        schema,
        document: gql`
          query {
            catalog {
              list {
                kind
                apiVersion
                metadata {
                  name
                }
              }
            }
          }
        `,
      });

      const [catalogItem] = result.data?.catalog.list;
      expect(catalogItem.kind).toBe('Component');
      expect(catalogItem.apiVersion).toBe('something');
      expect(catalogItem.metadata.name).toBe('Ben');
    });

    it('Defaults to empty annotations when none are provided', async () => {
      const mockResponse: ReaderEntity[] = [
        {
          apiVersion: 'something',
          kind: 'Component',
          metadata: {
            annotations: null as any,
            etag: '123',
            generation: 1,
            labels: {},
            name: 'Ben',
            namespace: 'Blames',
            uid: '123',
          },
          spec: {
            type: 'thing',
            lifecycle: 'something',
            owner: 'auser',
          },
        },
      ];
      worker.use(
        rest.get(`${mockCatalogBaseUrl}/catalog/entities`, (_, res, ctx) =>
          res(ctx.status(200), ctx.json(mockResponse)),
        ),
      );

      const { schema } = await createModule({
        config: mockConfig,
        logger: createLogger(),
      });

      const result = await execute({
        schema,
        document: gql`
          query {
            catalog {
              list {
                metadata {
                  annotations
                }
              }
            }
          }
        `,
      });

      const [catalogItem] = result.data?.catalog.list;
      expect(catalogItem.metadata.annotations).toEqual({});
    });

    it('Defaults to empty labels when none are provided', async () => {
      const mockResponse: ReaderEntity[] = [
        {
          apiVersion: 'something',
          kind: 'Component',
          metadata: {
            annotations: {},
            etag: '123',
            generation: 1,
            labels: null as any,
            name: 'Ben',
            namespace: 'Blames',
            uid: '123',
          },
          spec: {
            type: 'thing',
            lifecycle: 'something',
            owner: 'auser',
          },
        },
      ];
      worker.use(
        rest.get(`${mockCatalogBaseUrl}/catalog/entities`, (_, res, ctx) =>
          res(ctx.status(200), ctx.json(mockResponse)),
        ),
      );

      const { schema } = await createModule({
        config: mockConfig,
        logger: createLogger(),
      });

      const result = await execute({
        schema,
        document: gql`
          query {
            catalog {
              list {
                metadata {
                  labels
                }
              }
            }
          }
        `,
      });

      const [catalogItem] = result.data?.catalog.list;
      expect(catalogItem.metadata.labels).toEqual({});
    });
    it('Returns the correct record from the annotation dictionary', async () => {
      const mockResponse: ReaderEntity[] = [
        {
          apiVersion: 'something',
          kind: 'Component',
          metadata: {
            annotations: { lob: 'bloben' },
            etag: '123',
            generation: 1,
            labels: {},
            name: 'Ben',
            namespace: 'Blames',
            uid: '123',
          },
          spec: {
            type: 'thing',
            lifecycle: 'something',
            owner: 'auser',
          },
        },
      ];
      worker.use(
        rest.get(`${mockCatalogBaseUrl}/catalog/entities`, (_, res, ctx) =>
          res(ctx.status(200), ctx.json(mockResponse)),
        ),
      );

      const { schema } = await createModule({
        config: mockConfig,
        logger: createLogger(),
      });

      const result = await execute({
        schema,
        document: gql`
          query {
            catalog {
              list {
                metadata {
                  test: annotation(name: "lob")
                }
              }
            }
          }
        `,
      });

      const [catalogItem] = result.data?.catalog.list;
      expect(catalogItem.metadata.test).toEqual('bloben');
    });
    it('Returns the correct record from the labels dictionary', async () => {
      const mockResponse: ReaderEntity[] = [
        {
          apiVersion: 'something',
          kind: 'Component',
          metadata: {
            annotations: {},
            etag: '123',
            generation: 1,
            labels: { lob2: 'bloben' },
            name: 'Ben',
            namespace: 'Blames',
            uid: '123',
          },
          spec: {
            type: 'thing',
            lifecycle: 'something',
            owner: 'auser',
          },
        },
      ];
      worker.use(
        rest.get(`${mockCatalogBaseUrl}/catalog/entities`, (_, res, ctx) =>
          res(ctx.status(200), ctx.json(mockResponse)),
        ),
      );

      const { schema } = await createModule({
        config: mockConfig,
        logger: createLogger(),
      });

      const result = await execute({
        schema,
        document: gql`
          query {
            catalog {
              list {
                metadata {
                  test: label(name: "lob2")
                }
              }
            }
          }
        `,
      });

      const [catalogItem] = result.data?.catalog.list;
      expect(catalogItem.metadata.test).toEqual('bloben');
    });
  });
});
