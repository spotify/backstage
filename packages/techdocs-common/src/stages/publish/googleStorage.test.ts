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

import { getVoidLogger } from '@backstage/backend-common';
import {
  Entity,
  ENTITY_DEFAULT_NAMESPACE,
  EntityName,
} from '@backstage/catalog-model';
import { ConfigReader } from '@backstage/config';
import express from 'express';
import request from 'supertest';
import mockFs from 'mock-fs';
import os from 'os';
import path from 'path';
import { GoogleGCSPublish } from './googleStorage';
import { PublisherBase, TechDocsMetadata } from './types';

// NOTE: /packages/techdocs-common/__mocks__ is being used to mock Google Cloud Storage client library

const createMockEntity = (annotations = {}): Entity => {
  return {
    apiVersion: 'version',
    kind: 'TestKind',
    metadata: {
      name: 'test-component-name',
      namespace: 'test-namespace',
      annotations: {
        ...annotations,
      },
    },
  };
};

const createMockEntityName = (): EntityName => ({
  kind: 'TestKind',
  name: 'test-component-name',
  namespace: 'test-namespace',
});

const rootDir = os.platform() === 'win32' ? 'C:\\rootDir' : '/rootDir';

const getEntityRootDir = (entity: Entity) => {
  const {
    kind,
    metadata: { namespace, name },
  } = entity;

  return path.join(rootDir, namespace || ENTITY_DEFAULT_NAMESPACE, kind, name);
};

const logger = getVoidLogger();
jest.spyOn(logger, 'info').mockReturnValue(logger);

let publisher: PublisherBase;

beforeEach(async () => {
  mockFs.restore();
  const mockConfig = new ConfigReader({
    techdocs: {
      requestUrl: 'http://localhost:7000',
      publisher: {
        type: 'googleGcs',
        googleGcs: {
          credentials: '{}',
          bucketName: 'bucketName',
        },
      },
    },
  });

  publisher = await GoogleGCSPublish.fromConfig(mockConfig, logger);
});

describe('GoogleGCSPublish', () => {
  describe('getReadiness', () => {
    it('should validate correct config', async () => {
      expect(await publisher.getReadiness()).toEqual({
        isAvailable: true,
      });
    });

    it('should reject incorrect config', async () => {
      const mockConfig = new ConfigReader({
        techdocs: {
          requestUrl: 'http://localhost:7000',
          publisher: {
            type: 'googleGcs',
            googleGcs: {
              credentials: '{}',
              bucketName: 'errorBucket',
            },
          },
        },
      });

      const errorPublisher = GoogleGCSPublish.fromConfig(mockConfig, logger);

      expect(await errorPublisher.getReadiness()).toEqual({
        isAvailable: false,
      });
    });
  });

  describe('publish', () => {
    beforeEach(() => {
      const entity = createMockEntity();
      const entityRootDir = getEntityRootDir(entity);

      mockFs({
        [entityRootDir]: {
          'index.html': '',
          '404.html': '',
          assets: {
            'main.css': '',
          },
        },
      });
    });

    afterEach(() => {
      mockFs.restore();
    });

    it('should publish a directory', async () => {
      const entity = createMockEntity();
      const entityRootDir = getEntityRootDir(entity);

      expect(
        await publisher.publish({
          entity,
          directory: entityRootDir,
        }),
      ).toBeUndefined();
      mockFs.restore();
    });

    it('should fail to publish a directory', async () => {
      const wrongPathToGeneratedDirectory = path.join(
        rootDir,
        'wrong',
        'path',
        'to',
        'generatedDirectory',
      );

      const entity = createMockEntity();

      await expect(
        publisher.publish({
          entity,
          directory: wrongPathToGeneratedDirectory,
        }),
      ).rejects.toThrowError();

      const fails = publisher.publish({
        entity,
        directory: wrongPathToGeneratedDirectory,
      });

      // Can not do exact error message match due to mockFs adding unexpected characters in the path when throwing the error
      // Issue reported https://github.com/tschaub/mock-fs/issues/118
      await expect(fails).rejects.toMatchObject({
        message: expect.stringContaining(
          `Unable to upload file(s) to Google Cloud Storage. Error: Failed to read template directory: ENOENT, no such file or directory`,
        ),
      });
      await expect(fails).rejects.toMatchObject({
        message: expect.stringContaining(wrongPathToGeneratedDirectory),
      });

      mockFs.restore();
    });
  });

  describe('hasDocsBeenGenerated', () => {
    it('should return true if docs has been generated', async () => {
      const entity = createMockEntity();
      const entityRootDir = getEntityRootDir(entity);

      mockFs({
        [entityRootDir]: {
          'index.html': 'file-content',
        },
      });

      expect(await publisher.hasDocsBeenGenerated(entity)).toBe(true);
      mockFs.restore();
    });

    it('should return false if docs has not been generated', async () => {
      const entity = createMockEntity();

      expect(await publisher.hasDocsBeenGenerated(entity)).toBe(false);
    });
  });

  describe('fetchTechDocsMetadata', () => {
    beforeEach(() => {
      mockFs.restore();
    });

    it('should return tech docs metadata', async () => {
      const entityNameMock = createMockEntityName();
      const entity = createMockEntity();
      const entityRootDir = getEntityRootDir(entity);

      mockFs({
        [entityRootDir]: {
          'techdocs_metadata.json':
            '{"site_name": "backstage", "site_description": "site_content", "etag": "etag"}',
        },
      });

      const expectedMetadata: TechDocsMetadata = {
        site_name: 'backstage',
        site_description: 'site_content',
        etag: 'etag',
      };
      expect(
        await publisher.fetchTechDocsMetadata(entityNameMock),
      ).toStrictEqual(expectedMetadata);
    });

    it('should return tech docs metadata when json encoded with single quotes', async () => {
      const entityNameMock = createMockEntityName();
      const entity = createMockEntity();
      const entityRootDir = getEntityRootDir(entity);

      mockFs({
        [entityRootDir]: {
          'techdocs_metadata.json':
            "{'site_name': 'backstage', 'site_description': 'site_content', 'etag': 'etag'}",
        },
      });

      const expectedMetadata: TechDocsMetadata = {
        site_name: 'backstage',
        site_description: 'site_content',
        etag: 'etag',
      };
      expect(
        await publisher.fetchTechDocsMetadata(entityNameMock),
      ).toStrictEqual(expectedMetadata);
      mockFs.restore();
    });

    it('should return an error if the techdocs_metadata.json file is not present', async () => {
      const entityNameMock = createMockEntityName();
      const entity = createMockEntity();
      const entityRootDir = getEntityRootDir(entity);

      const fails = publisher.fetchTechDocsMetadata(entityNameMock);

      await expect(fails).rejects.toMatchObject({
        message: `The file ${path.join(
          entityRootDir,
          'techdocs_metadata.json',
        )} does not exist !`,
      });
    });
  });

  describe('docsRouter', () => {
    let app: express.Express;
    const entity = createMockEntity();
    const entityRootDir = getEntityRootDir(entity);

    beforeEach(() => {
      app = express().use(publisher.docsRouter());

      mockFs.restore();
      mockFs({
        [entityRootDir]: {
          html: {
            'unsafe.html': '<html></html>',
          },
          img: {
            'with spaces.png': 'found it',
            'unsafe.svg': '<svg></svg>',
          },
          'some folder': {
            'also with spaces.js': 'found it too',
          },
        },
      });
    });

    afterEach(() => {
      mockFs.restore();
    });

    it('should pass expected object path to bucket', async () => {
      const {
        kind,
        metadata: { namespace, name },
      } = entity;

      // Ensures leading slash is trimmed and encoded path is decoded.
      const pngResponse = await request(app).get(
        `/${namespace}/${kind}/${name}/img/with%20spaces.png`,
      );
      expect(Buffer.from(pngResponse.body).toString('utf8')).toEqual(
        'found it',
      );
      const jsResponse = await request(app).get(
        `/${namespace}/${kind}/${name}/some%20folder/also%20with%20spaces.js`,
      );
      expect(jsResponse.text).toEqual('found it too');
    });

    it('should pass text/plain content-type for html', async () => {
      const {
        kind,
        metadata: { namespace, name },
      } = entity;

      const htmlResponse = await request(app).get(
        `/${namespace}/${kind}/${name}/html/unsafe.html`,
      );
      expect(htmlResponse.text).toEqual('<html></html>');
      expect(htmlResponse.header).toMatchObject({
        'content-type': 'text/plain; charset=utf-8',
      });

      const svgResponse = await request(app).get(
        `/${namespace}/${kind}/${name}/img/unsafe.svg`,
      );
      expect(svgResponse.text).toEqual('<svg></svg>');
      expect(svgResponse.header).toMatchObject({
        'content-type': 'text/plain; charset=utf-8',
      });
    });
  });
});
