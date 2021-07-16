/*
 * Copyright 2021 The Backstage Authors
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
  PluginEndpointDiscovery,
  getVoidLogger,
} from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import { DefaultTechDocsCollator } from './DefaultTechDocsCollator';
import { msw } from '@backstage/test-utils';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const logger = getVoidLogger();

const mockSearchDocIndex = {
  config: {
    lang: ['en'],
    min_search_length: 3,
    prebuild_index: false,
    separator: '[\\s\\-]+',
  },
  docs: [
    {
      location: '',
      text: 'docs docs docs',
      title: 'Home',
    },
    {
      location: 'local-development/',
      text: 'Docs for first subtitle',
      title: 'Local development',
    },
    {
      location: 'local-development/#development',
      text: 'Docs for sub-subtitle',
      title: 'Development',
    },
  ],
};

const expectedEntities: Entity[] = [
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      name: 'test-entity-with-docs',
      description: 'Documented description',
      annotations: {
        'backstage.io/techdocs-ref': './',
      },
    },
    spec: {
      type: 'dog',
      lifecycle: 'experimental',
      owner: 'someone',
    },
  },
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      name: 'test-entity',
      description: 'The expected description',
    },
    spec: {
      type: 'some-type',
      lifecycle: 'experimental',
    },
  },
];

describe('DefaultTechDocsCollator', () => {
  let mockDiscoveryApi: jest.Mocked<PluginEndpointDiscovery>;
  let collator: DefaultTechDocsCollator;

  const worker = setupServer();
  msw.setupDefaultHandlers(worker);
  beforeEach(() => {
    mockDiscoveryApi = {
      getBaseUrl: jest.fn().mockResolvedValue('http://test-backend'),
      getExternalBaseUrl: jest.fn(),
    };
    collator = new DefaultTechDocsCollator({
      discovery: mockDiscoveryApi,
      logger,
    });

    worker.use(
      rest.get(
        'http://test-backend/static/docs/default/Component/test-entity-with-docs/search/search_index.json',
        (_, res, ctx) => res(ctx.status(200), ctx.json(mockSearchDocIndex)),
      ),
      rest.get('http://test-backend/entities', (_, res, ctx) =>
        res(ctx.status(200), ctx.json(expectedEntities)),
      ),
    );
  });

  it('fetches from the configured catalog and tech docs services', async () => {
    const documents = await collator.execute();
    expect(mockDiscoveryApi.getBaseUrl).toHaveBeenCalledWith('catalog');
    expect(mockDiscoveryApi.getBaseUrl).toHaveBeenCalledWith('techdocs');
    expect(documents).toHaveLength(mockSearchDocIndex.docs.length);
  });

  it('should create documents for each tech docs search index', async () => {
    const documents = await collator.execute();
    const entity = expectedEntities[0];
    documents.forEach((document, idx) => {
      expect(document).toMatchObject({
        title: mockSearchDocIndex.docs[idx].title,
        location: `/docs/default/Component/${entity.metadata.name}/${mockSearchDocIndex.docs[idx].location}`,
        text: mockSearchDocIndex.docs[idx].text,
        namespace: 'default',
        componentType: entity!.spec!.type,
        lifecycle: entity!.spec!.lifecycle,
        owner: '',
      });
    });
  });

  it('maps a returned entity with a custom locationTemplate', async () => {
    // Provide an alternate location template.
    collator = new DefaultTechDocsCollator({
      discovery: mockDiscoveryApi,
      locationTemplate: '/software/:name',
      logger,
    });

    const documents = await collator.execute();
    expect(documents[0]).toMatchObject({
      location: '/software/test-entity-with-docs',
    });
  });
});
