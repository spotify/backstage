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
  PluginEndpointDiscovery,
  resolvePackagePath,
} from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import express from 'express';
import request from 'supertest';
import mockFs from 'mock-fs';
import * as os from 'os';
import { LocalPublish } from './local';

const createMockEntity = (annotations = {}) => {
  return {
    apiVersion: 'version',
    kind: 'TestKind',
    metadata: {
      name: 'test-component-name',
      annotations: {
        ...annotations,
      },
    },
  };
};

const testDiscovery: jest.Mocked<PluginEndpointDiscovery> = {
  getBaseUrl: jest.fn().mockResolvedValue('http://localhost:7000/api/techdocs'),
  getExternalBaseUrl: jest.fn(),
};

const logger = getVoidLogger();

const tmpDir =
  os.platform() === 'win32' ? 'C:\\tmp\\generatedDir' : '/tmp/generatedDir';

const resolvedDir = resolvePackagePath(
  '@backstage/plugin-techdocs-backend',
  'static/docs',
);

describe('local publisher', () => {
  it('should publish generated documentation dir', async () => {
    mockFs({
      [tmpDir]: {
        'index.html': '',
      },
    });

    const mockConfig = new ConfigReader({});

    const publisher = new LocalPublish(mockConfig, logger, testDiscovery);
    const mockEntity = createMockEntity();

    await publisher.publish({ entity: mockEntity, directory: tmpDir });

    expect(await publisher.hasDocsBeenGenerated(mockEntity)).toBe(true);

    mockFs.restore();
  });

  describe('docsRouter', () => {
    const mockConfig = new ConfigReader({});
    const publisher = new LocalPublish(mockConfig, logger, testDiscovery);
    let app: express.Express;

    beforeEach(() => {
      app = express().use(publisher.docsRouter());

      mockFs.restore();
      mockFs({
        [resolvedDir]: {
          'unsafe.html': '<html></html>',
          'unsafe.svg': '<svg></svg>',
        },
      });
    });

    afterEach(() => {
      mockFs.restore();
    });

    it('should pass text/plain content-type for unsafe types', async () => {
      const htmlResponse = await request(app).get(`/unsafe.html`);
      expect(htmlResponse.text).toEqual('<html></html>');
      expect(htmlResponse.header).toMatchObject({
        'content-type': 'text/plain; charset=utf-8',
      });

      const svgResponse = await request(app).get(`/unsafe.svg`);
      expect(svgResponse.text).toEqual('<svg></svg>');
      expect(svgResponse.header).toMatchObject({
        'content-type': 'text/plain; charset=utf-8',
      });
    });
  });
});
