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
import { Entity, getEntitySourceLocation } from '@backstage/catalog-model';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import os from 'os';
import path from 'path';
import { Readable } from 'stream';
import {
  getDirLocation,
  getDocFilesFromRepository,
  getLocationForEntity,
  parseReferenceAnnotation,
  transformDirLocation,
} from './helpers';

jest.mock('@backstage/catalog-model', () => ({
  ...jest.requireActual('@backstage/catalog-model'),
  getEntitySourceLocation: jest.fn(),
}));

const rootDir = os.platform() === 'win32' ? 'C:\\rootDir' : '/rootDir';

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

const scmIntegrations = ScmIntegrations.fromConfig(new ConfigReader({}));

afterEach(() => jest.resetAllMocks());

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

describe('getDirLocation', () => {
  it.each`
    techdocsRef                    | responseTarget
    ${undefined}                   | ${undefined}
    ${16}                          | ${undefined}
    ${'.'}                         | ${'.'}
    ${'dir:.'}                     | ${'.'}
    ${'./relative'}                | ${'./relative'}
    ${'dir:./relative'}            | ${'./relative'}
    ${'dir:https://github.com...'} | ${'https://github.com...'}
    ${'url:https://github.com...'} | ${undefined}
  `(
    'should handle "backstage.io/techdocs-ref: $techdocsRef" correctly',
    ({ techdocsRef, responseTarget }) => {
      const entity = {
        apiVersion: '1',
        kind: 'Component',
        metadata: {
          name: 'test',
          annotations: {
            'backstage.io/techdocs-ref': techdocsRef,
          },
        },
      };

      const result = getDirLocation(entity);

      expect(result).toEqual(
        responseTarget && { type: 'dir', target: responseTarget },
      );
    },
  );

  it('Reject https urls and hint to the url: location type', async () => {
    const entity = {
      apiVersion: '1',
      kind: 'Component',
      metadata: {
        name: 'test',
        annotations: {
          'backstage.io/techdocs-ref': 'https://github.com/backstage/backstage',
        },
      },
    };

    expect(() => getDirLocation(entity)).toThrow(
      /please prefix it with 'url:'/,
    );
  });
});

describe('transformDirLocation', () => {
  it('should reject missing annotation', () => {
    const entity = {
      apiVersion: '1',
      kind: 'Component',
      metadata: {
        name: 'test',
      },
    };

    expect(() => transformDirLocation(entity, scmIntegrations)).toThrow(
      /No techdocs location annotation provided in entity: component:default\/test/,
    );
  });

  it.each`
    techdocsRef       | target
    ${'.'}            | ${'https://my-url/folder/'}
    ${'./sub-folder'} | ${'https://my-url/folder/sub-folder'}
  `(
    'should transform "$techdocsRef" for url type locations',
    ({ techdocsRef, target }) => {
      (getEntitySourceLocation as jest.Mock).mockReturnValue({
        type: 'url',
        target: 'https://my-url/folder/',
      });

      const entity = {
        apiVersion: '1',
        kind: 'Component',
        metadata: {
          name: 'test',
          annotations: {
            'backstage.io/techdocs-ref': techdocsRef,
          },
        },
      };

      const result = transformDirLocation(entity, scmIntegrations);

      expect(result).toEqual({ type: 'url', target });
    },
  );

  it.each`
    techdocsRef       | target
    ${'.'}            | ${path.join(rootDir, 'working-copy')}
    ${'./sub-folder'} | ${path.join(rootDir, 'working-copy', 'sub-folder')}
  `(
    'should transform "$techdocsRef" for file type locations',
    ({ techdocsRef, target }) => {
      (getEntitySourceLocation as jest.Mock).mockReturnValue({
        type: 'file',
        target: path.join(rootDir, 'working-copy', 'catalog-info.yaml'),
      });

      const entity = {
        apiVersion: '1',
        kind: 'Component',
        metadata: {
          name: 'test',
          annotations: {
            'backstage.io/techdocs-ref': techdocsRef,
          },
        },
      };

      const result = transformDirLocation(entity, scmIntegrations);

      expect(result).toEqual({ type: 'dir', target });
    },
  );

  it('should reject unsafe file location', () => {
    (getEntitySourceLocation as jest.Mock).mockReturnValue({
      type: 'file',
      target: '/tmp/catalog-info.yaml',
    });

    const entity = {
      apiVersion: '1',
      kind: 'Component',
      metadata: {
        name: 'test',
        annotations: {
          'backstage.io/techdocs-ref': '..',
        },
      },
    };

    expect(() => transformDirLocation(entity, scmIntegrations)).toThrow(
      /Relative path is not allowed to refer to a directory outside its parent/,
    );
  });

  it('should reject other location types', () => {
    (getEntitySourceLocation as jest.Mock).mockReturnValue({
      type: 'other',
      target: '/',
    });

    const entity = {
      apiVersion: '1',
      kind: 'Component',
      metadata: {
        name: 'test',
        annotations: {
          'backstage.io/techdocs-ref': '.',
        },
      },
    };

    expect(() => transformDirLocation(entity, scmIntegrations)).toThrow(
      /Unable to resolve location type other/,
    );
  });
});

describe('getLocationForEntity', () => {
  it('should handle implicit dir locations', () => {
    (getEntitySourceLocation as jest.Mock).mockReturnValue({
      type: 'url',
      target: 'https://my-url/folder/',
    });

    const entity = {
      apiVersion: '1',
      kind: 'Component',
      metadata: {
        name: 'test',
        annotations: {
          'backstage.io/techdocs-ref': '.',
        },
      },
    };

    const parsedLocationAnnotation = getLocationForEntity(
      entity,
      scmIntegrations,
    );
    expect(parsedLocationAnnotation.type).toBe('url');
    expect(parsedLocationAnnotation.target).toBe('https://my-url/folder/');
  });

  it('should handle dir locations', () => {
    (getEntitySourceLocation as jest.Mock).mockReturnValue({
      type: 'url',
      target: 'https://my-url/folder/',
    });

    const entity = {
      apiVersion: '1',
      kind: 'Component',
      metadata: {
        name: 'test',
        annotations: {
          'backstage.io/techdocs-ref': 'dir:.',
        },
      },
    };

    const parsedLocationAnnotation = getLocationForEntity(
      entity,
      scmIntegrations,
    );
    expect(parsedLocationAnnotation.type).toBe('url');
    expect(parsedLocationAnnotation.target).toBe('https://my-url/folder/');
  });

  it('should get location for entity', () => {
    const parsedLocationAnnotation = getLocationForEntity(
      mockEntityWithAnnotation,
      scmIntegrations,
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
