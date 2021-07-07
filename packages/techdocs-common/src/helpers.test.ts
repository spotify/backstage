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

import { ReadTreeResponse, UrlReader } from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import {
  getDocFilesFromRepository,
  getLocationForEntity,
  getSourceLocation,
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

describe('getSourceLocation', () => {
  it('should ignore missing annotations', () => {
    const entity = {
      apiVersion: '1',
      kind: 'Component',
      metadata: {
        name: 'test',
      },
    };

    expect(getSourceLocation(entity)).toBeUndefined();
  });

  it('should ignore non-url managed-by-location annotation', () => {
    const entity = {
      apiVersion: '1',
      kind: 'Component',
      metadata: {
        name: 'test',
        annotations: {
          'backstage.io/managed-by-location':
            'file:/some/folder/catalog-info.yaml',
        },
      },
    };

    expect(getSourceLocation(entity)).toBeUndefined();
  });

  it('should use source-location annotation', () => {
    const entity = {
      apiVersion: '1',
      kind: 'Component',
      metadata: {
        name: 'test',
        annotations: {
          'backstage.io/source-location':
            'url:https://github.com/backstage/backstage/blob/master/',
          'backstage.io/managed-by-location':
            'url:https://github.com/backstage/backstage/blob/master/catalog-info.yaml',
        },
      },
    };

    expect(getSourceLocation(entity)).toBe(
      'https://github.com/backstage/backstage/blob/master/',
    );
  });

  it('should use managed-by-location annotation', () => {
    const entity = {
      apiVersion: '1',
      kind: 'Component',
      metadata: {
        name: 'test',
        annotations: {
          'backstage.io/managed-by-location':
            'url:https://github.com/backstage/backstage/blob/master/catalog-info.yaml',
        },
      },
    };

    expect(getSourceLocation(entity)).toBe(
      'https://github.com/backstage/backstage/blob/master/catalog-info.yaml',
    );
  });
});

describe('getDocFilesFromRepository', () => {
  const mockResponse: jest.Mocked<ReadTreeResponse> = {
    archive: jest.fn(),
    dir: jest.fn(),
    files: jest.fn(),
    etag: 'etag',
  };

  let mockUrlReader: jest.Mocked<UrlReader>;
  beforeEach(() => {
    mockUrlReader = {
      read: jest.fn(),
      readTree: jest.fn(async _ => mockResponse),
      search: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should read a remote directory using UrlReader.readTree', async () => {
    mockResponse.dir.mockResolvedValue('/tmp/testfolder');
    mockResponse.etag = 'etag123abc';

    const output = await getDocFilesFromRepository(
      mockUrlReader,
      ScmIntegrations.fromConfig(new ConfigReader({})),
      mockEntityWithAnnotation,
      { etag: 'asdf' },
    );

    expect(
      mockUrlReader.readTree,
    ).toBeCalledWith(
      'https://github.com/backstage/backstage/blob/master/subfolder/',
      { etag: 'asdf' },
    );

    expect(output.preparedDir).toBe('/tmp/testfolder');
    expect(output.etag).toBe('etag123abc');
  });

  it('should load relative to the source location', async () => {
    const entity = {
      apiVersion: '1',
      kind: 'a',
      metadata: {
        name: 'test',
        annotations: {
          'backstage.io/techdocs-ref': 'url:subfolder',
          'backstage.io/source-location':
            'url:https://github.com/backstage/backstage/blob/master/subfolder/',
        },
      },
    };

    await getDocFilesFromRepository(
      mockUrlReader,
      ScmIntegrations.fromConfig(new ConfigReader({})),
      entity,
    );

    expect(mockUrlReader.readTree).toBeCalledWith(
      'https://github.com/backstage/backstage/tree/master/subfolder/subfolder',
      {},
    );
  });
});
