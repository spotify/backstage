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

import {
  getVoidLogger,
  UrlReader,
  UrlReaders,
} from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { msw } from '@backstage/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  CatalogProcessorEntityResult,
  CatalogProcessorErrorResult,
  CatalogProcessorResult,
} from './types';
import { UrlReaderProcessor } from './UrlReaderProcessor';
import { defaultEntityDataParser } from './util/parse';

describe('UrlReaderProcessor', () => {
  const mockApiOrigin = 'http://localhost';

  const server = setupServer();
  msw.setupDefaultHandlers(server);

  it('should load from url', async () => {
    const logger = getVoidLogger();
    const reader = UrlReaders.default({
      logger,
      config: new ConfigReader({
        backend: { reading: { allow: [{ host: 'localhost' }] } },
      }),
    });
    const processor = new UrlReaderProcessor({ reader, logger });
    const spec = {
      type: 'url',
      target: `${mockApiOrigin}/component.yaml`,
    };

    server.use(
      rest.get(`${mockApiOrigin}/component.yaml`, (_, res, ctx) =>
        res(ctx.json({ mock: 'entity' })),
      ),
    );

    const generated = (await new Promise<CatalogProcessorResult>(emit =>
      processor.readLocation(spec, false, emit, defaultEntityDataParser),
    )) as CatalogProcessorEntityResult;

    expect(generated.type).toBe('entity');
    expect(generated.location).toEqual(spec);
    expect(generated.entity).toEqual({ mock: 'entity' });
  });

  it('should fail load from url with error', async () => {
    const logger = getVoidLogger();
    const reader = UrlReaders.default({
      logger,
      config: new ConfigReader({
        backend: { reading: { allow: [{ host: 'localhost' }] } },
      }),
    });
    const processor = new UrlReaderProcessor({ reader, logger });
    const spec = {
      type: 'url',
      target: `${mockApiOrigin}/component-notfound.yaml`,
    };

    server.use(
      rest.get(`${mockApiOrigin}/component-notfound.yaml`, (_, res, ctx) => {
        return res(ctx.status(404));
      }),
    );

    const generated = (await new Promise<CatalogProcessorResult>(emit =>
      processor.readLocation(spec, false, emit, defaultEntityDataParser),
    )) as CatalogProcessorErrorResult;

    expect(generated.type).toBe('error');
    expect(generated.location).toBe(spec);
    expect(generated.error.name).toBe('NotFoundError');
    expect(generated.error.message).toBe(
      `Unable to read url, NotFoundError: could not read ${mockApiOrigin}/component-notfound.yaml, 404 Not Found`,
    );
  });

  it('uses search when there are globs', async () => {
    const logger = getVoidLogger();

    const reader: jest.Mocked<UrlReader> = {
      read: jest.fn(),
      readTree: jest.fn(),
      search: jest.fn().mockImplementation(async () => []),
    };

    const processor = new UrlReaderProcessor({ reader, logger });

    const emit = jest.fn();

    await processor.readLocation(
      { type: 'url', target: 'https://github.com/a/b/blob/x/**/b.yaml' },
      false,
      emit,
      defaultEntityDataParser,
    );

    expect(reader.search).toBeCalledTimes(1);
  });
});
