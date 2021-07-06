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

import { getVoidLogger, UrlReader } from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import { ConfigReader } from '@backstage/config';
import { Knex } from 'knex';
import yaml from 'yaml';
import { DatabaseManager } from '../database';
import { CatalogProcessorParser } from '../ingestion';
import * as result from '../ingestion/processors/results';
import { CatalogBuilder, CatalogEnvironment } from './CatalogBuilder';

const dummyEntity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'n',
  },
  spec: {
    type: 't',
    owner: 'o',
    lifecycle: 'l',
  },
};

const dummyEntityYaml = yaml.stringify(dummyEntity);

describe('CatalogBuilder', () => {
  let db: Knex<any, unknown[]>;
  const reader: jest.Mocked<UrlReader> = {
    read: jest.fn(),
    readTree: jest.fn(),
    search: jest.fn(),
  };
  const env: CatalogEnvironment = {
    logger: getVoidLogger(),
    database: { getClient: async () => db },
    config: new ConfigReader({}),
    reader,
  };

  beforeEach(async () => {
    db = await DatabaseManager.createTestDatabaseConnection();
    jest.resetAllMocks();
  });

  it('works with no changes', async () => {
    const builder = new CatalogBuilder(env);
    const built = await builder.build();
    await expect(built.entitiesCatalog.entities()).resolves.toEqual({
      entities: [],
      pageInfo: { hasNextPage: false },
    });
    await expect(built.locationsCatalog.locations()).resolves.toEqual([
      expect.objectContaining({
        data: expect.objectContaining({ type: 'bootstrap' }),
      }),
    ]);
  });

  it('works with everything replaced', async () => {
    reader.read.mockResolvedValueOnce(Buffer.from('junk'));

    const builder = new CatalogBuilder(env)
      .replaceEntityPolicies([
        {
          async enforce(entity: Entity) {
            expect(entity.metadata.namespace).toBe('ns');
            return entity;
          },
        },
      ])
      .setPlaceholderResolver('t', async ({ value }) => {
        expect(value).toBe('tt');
        return 'tt2';
      })
      .setFieldFormatValidators({
        isValidEntityName: n => {
          expect(n).toBe('n');
          return true;
        },
      })
      .replaceProcessors([
        {
          async readLocation(location, _optional, emit) {
            expect(location.type).toBe('test');
            emit(
              result.entity(location, {
                apiVersion: 'backstage.io/v1alpha1',
                kind: 'Component',
                metadata: { name: 'n', replaced: { $t: 'tt' } },
                spec: { type: 't', owner: 'o', lifecycle: 'l' },
              }),
            );
            return true;
          },
          async preProcessEntity(entity) {
            expect(entity.apiVersion).toBe('backstage.io/v1alpha1');
            return {
              ...entity,
              metadata: { ...entity.metadata, namespace: 'ns' },
            };
          },
          async postProcessEntity(entity) {
            expect(entity.metadata.namespace).toBe('ns');
            return {
              ...entity,
              metadata: { ...entity.metadata, post: 'p' },
            };
          },
        },
      ]);
    const out = await builder.build();

    const added = await out.higherOrderOperation.addLocation({
      type: 'test',
      target: '',
    });
    expect.assertions(6);
    expect(added.entities).toEqual([
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'n',
          namespace: 'ns',
          post: 'p',
          replaced: 'tt2',
          uid: expect.any(String),
          etag: expect.any(String),
          generation: expect.any(Number),
        },
        spec: {
          type: 't',
          owner: 'o',
          lifecycle: 'l',
        },
        relations: expect.anything(),
      },
    ]);
  });

  it('addProcessor works', async () => {
    reader.read.mockResolvedValueOnce(Buffer.from(dummyEntityYaml));

    const builder = new CatalogBuilder(env);
    builder.addProcessor({
      async preProcessEntity(e) {
        return { ...e, metadata: { ...e.metadata, foo: 7 } };
      },
    });

    const { entitiesCatalog, higherOrderOperation } = await builder.build();
    await higherOrderOperation.addLocation({
      type: 'github',
      target: 'https://github.com/a/b/x.yaml',
    });
    const { entities } = await entitiesCatalog.entities();

    expect(entities).toEqual([
      expect.objectContaining({
        metadata: expect.objectContaining({
          foo: 7,
        }),
      }),
    ]);
  });

  it('replaceProcessors works', async () => {
    reader.read.mockResolvedValueOnce(Buffer.from(dummyEntityYaml));

    const builder = new CatalogBuilder(env);
    builder.replaceProcessors([
      {
        async readLocation(location, _optional, emit) {
          expect(location.type).toBe('x');
          emit(result.entity(location, dummyEntity));
          return true;
        },
        async preProcessEntity(e) {
          expect(e.metadata.name).toBe('n');
          return { ...e, metadata: { ...e.metadata, foo: 7 } };
        },
      },
    ]);

    const { entitiesCatalog, higherOrderOperation } = await builder.build();
    await higherOrderOperation.addLocation({
      type: 'x',
      target: 'y',
    });
    const { entities } = await entitiesCatalog.entities();

    expect.assertions(3);
    expect(entities).toEqual([
      expect.objectContaining({
        metadata: expect.objectContaining({
          foo: 7,
        }),
      }),
    ]);
  });

  it('setEntityDataParser works', async () => {
    const mockParser: CatalogProcessorParser = jest
      .fn()
      .mockImplementation(() => {});

    const builder = new CatalogBuilder(env)
      .setEntityDataParser(mockParser)
      .replaceProcessors([
        {
          async readLocation(_location, _optional, _emit, parser) {
            expect(parser).toBe(mockParser);
            return true;
          },
        },
      ]);

    const { higherOrderOperation } = await builder.build();
    await higherOrderOperation.addLocation({ type: 'x', target: 'y' });

    expect.assertions(1);
  });
});
