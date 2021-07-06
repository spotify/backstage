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
  ReadTreeResponse,
  SearchResponse,
  UrlReader,
} from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import { Readable } from 'stream';
import {
  getDocFilesFromRepository,
  getLocationForEntity,
  parseReferenceAnnotation,
} from './helpers';

const entityBase: Entity = {
  metadata: {
    namespace: 'default',
    name: 'mytestcomponent',
    description: 'A component for testing',
  },
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  spec: {
    type: 'documentation',
    lifecycle: 'experimental',
    owner: 'testuser',
  },
};

const metadataBase = {
  namespace: 'default',
  name: 'mytestcomponent',
  description: 'A component for testing',
};

const goodAnnotation = {
  annotations: {
    'backstage.io/techdocs-ref':
      'url:https://github.com/backstage/backstage/blob/master/subfolder/',
  },
};

const mockEntityWithAnnotation: Entity = {
  ...entityBase,
  ...{
    metadata: {
      ...metadataBase,
      ...goodAnnotation,
    },
  },
};

const badAnnotation = {
  annotations: {
    'backstage.io/techdocs-ref': 'bad-annotation',
  },
};

const mockEntityWithBadAnnotation: Entity = {
  ...entityBase,
  ...{
    metadata: {
      ...metadataBase,
      ...badAnnotation,
    },
  },
};

describe('parseReferenceAnnotation', () => {
  it('should parse annotation', () => {
    const parsedLocationAnnotation = parseReferenceAnnotation(
      'backstage.io/techdocs-ref',
      mockEntityWithAnnotation,
    );
    expect(parsedLocationAnnotation.type).toBe('url');
    expect(parsedLocationAnnotation.target).toBe(
      'https://github.com/backstage/backstage/blob/master/subfolder/',
    );
  });

  it('should throw error without annotation', () => {
    expect(() => {
      parseReferenceAnnotation('backstage.io/techdocs-ref', entityBase);
    }).toThrow(/No location annotation/);
  });

  it('should throw error with bad annotation', () => {
    expect(() => {
      parseReferenceAnnotation(
        'backstage.io/techdocs-ref',
        mockEntityWithBadAnnotation,
      );
    }).toThrow(/Unable to parse/);
  });
});

describe('getLocationForEntity', () => {
  it('should get location for entity', () => {
    const parsedLocationAnnotation = getLocationForEntity(
      mockEntityWithAnnotation,
    );
    expect(parsedLocationAnnotation.type).toBe('url');
    expect(parsedLocationAnnotation.target).toBe(
      'https://github.com/backstage/backstage/blob/master/subfolder/',
    );
  });
});

describe('getDocFilesFromRepository', () => {
  it('should read a remote directory using UrlReader.readTree', async () => {
    class MockUrlReader implements UrlReader {
      async read() {
        return Buffer.from('mock');
      }

      async readTree(): Promise<ReadTreeResponse> {
        return {
          dir: async () => {
            return '/tmp/testfolder';
          },
          files: async () => {
            return [];
          },
          archive: async () => {
            return Readable.from('');
          },
          etag: 'etag123abc',
        };
      }

      async search(): Promise<SearchResponse> {
        return {
          etag: '',
          files: [],
        };
      }
    }

    const output = await getDocFilesFromRepository(
      new MockUrlReader(),
      mockEntityWithAnnotation,
    );

    expect(output.preparedDir).toBe('/tmp/testfolder');
    expect(output.etag).toBe('etag123abc');
  });
});
