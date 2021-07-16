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
  getVoidLogger,
  PluginEndpointDiscovery,
} from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import {
  GeneratorBuilder,
  PreparerBuilder,
  PublisherBase,
} from '@backstage/techdocs-common';
import { DocsBuilder, shouldCheckForUpdate } from '../DocsBuilder';
import { DocsSynchronizer, DocsSynchronizerSyncOpts } from './DocsSynchronizer';

jest.mock('../DocsBuilder');

const MockedDocsBuilder = DocsBuilder as jest.MockedClass<typeof DocsBuilder>;

describe('DocsSynchronizer', () => {
  const preparers: jest.Mocked<PreparerBuilder> = {
    register: jest.fn(),
    get: jest.fn(),
  };
  const generators: jest.Mocked<GeneratorBuilder> = {
    register: jest.fn(),
    get: jest.fn(),
  };
  const publisher: jest.Mocked<PublisherBase> = {
    docsRouter: jest.fn(),
    fetchTechDocsMetadata: jest.fn(),
    getReadiness: jest.fn(),
    hasDocsBeenGenerated: jest.fn(),
    publish: jest.fn(),
  };
  const discovery: jest.Mocked<PluginEndpointDiscovery> = {
    getBaseUrl: jest.fn(),
    getExternalBaseUrl: jest.fn(),
  };

  let docsSynchronizer: DocsSynchronizer;
  const mockResponseHandler: jest.Mocked<DocsSynchronizerSyncOpts> = {
    log: jest.fn(),
    finish: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    publisher.docsRouter.mockReturnValue(() => {});
    discovery.getBaseUrl.mockImplementation(async type => {
      return `http://backstage.local/api/${type}`;
    });

    docsSynchronizer = new DocsSynchronizer({
      publisher,
      config: new ConfigReader({}),
      logger: getVoidLogger(),
      scmIntegrations: ScmIntegrations.fromConfig(new ConfigReader({})),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('doSync', () => {
    it('should execute an update', async () => {
      (shouldCheckForUpdate as jest.Mock).mockReturnValue(true);

      const entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          uid: '0',
          name: 'test',
          namespace: 'default',
        },
      };

      MockedDocsBuilder.prototype.build.mockImplementation(async () => {
        // extract the logStream from the constructor call
        const logStream = MockedDocsBuilder.mock.calls[0][0].logStream;

        logStream?.write('Some log');
        logStream?.write('Another log');

        const logger = MockedDocsBuilder.mock.calls[0][0].logger;

        logger.info('Some more log');

        return true;
      });

      publisher.hasDocsBeenGenerated.mockResolvedValue(true);

      await docsSynchronizer.doSync({
        responseHandler: mockResponseHandler,
        entity,
        preparers,
        generators,
      });

      expect(mockResponseHandler.log).toBeCalledTimes(3);
      expect(mockResponseHandler.log).toBeCalledWith('Some log');
      expect(mockResponseHandler.log).toBeCalledWith('Another log');
      expect(mockResponseHandler.log).toBeCalledWith(
        expect.stringMatching(/info.*Some more log/),
      );

      expect(mockResponseHandler.finish).toBeCalledWith({ updated: true });

      expect(mockResponseHandler.error).toBeCalledTimes(0);

      expect(shouldCheckForUpdate).toBeCalledTimes(1);
      expect(DocsBuilder.prototype.build).toBeCalledTimes(1);
    });

    it('should not check for an update too often', async () => {
      (shouldCheckForUpdate as jest.Mock).mockReturnValue(false);

      const entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          uid: '0',
          name: 'test',
          namespace: 'default',
        },
      };

      await docsSynchronizer.doSync({
        responseHandler: mockResponseHandler,
        entity,
        preparers,
        generators,
      });

      expect(mockResponseHandler.finish).toBeCalledWith({ updated: false });

      expect(mockResponseHandler.log).toBeCalledTimes(0);
      expect(mockResponseHandler.error).toBeCalledTimes(0);

      expect(shouldCheckForUpdate).toBeCalledTimes(1);
      expect(DocsBuilder.prototype.build).toBeCalledTimes(0);
    });

    it('should forward build errors', async () => {
      (shouldCheckForUpdate as jest.Mock).mockReturnValue(true);

      const entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          uid: '0',
          name: 'test',
          namespace: 'default',
        },
      };

      const error = new Error('Some random error');
      MockedDocsBuilder.prototype.build.mockRejectedValue(error);

      await docsSynchronizer.doSync({
        responseHandler: mockResponseHandler,
        entity,
        preparers,
        generators,
      });

      expect(mockResponseHandler.log).toBeCalledTimes(1);
      expect(mockResponseHandler.log).toBeCalledWith(
        expect.stringMatching(
          /error.*: Failed to build the docs page: Some random error/,
        ),
      );
      expect(mockResponseHandler.finish).toBeCalledTimes(0);
      expect(mockResponseHandler.error).toBeCalledTimes(1);
      expect(mockResponseHandler.error).toBeCalledWith(error);
    });
  });
});
