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
jest.mock('./helpers');

jest.mock('azure-devops-node-api', () => ({
  WebApi: jest.fn(),
  getPersonalAccessTokenHandler: jest.fn().mockReturnValue(() => {}),
}));

import os from 'os';
import { resolve } from 'path';
import { AzurePublisher } from './azure';
import { WebApi } from 'azure-devops-node-api';
import * as helpers from './helpers';
import { getVoidLogger } from '@backstage/backend-common';

describe('Azure Publisher', () => {
  const logger = getVoidLogger();

  const workspacePath = os.platform() === 'win32' ? 'C:\\tmp' : '/tmp';
  const resultPath = resolve(workspacePath, 'result');

  describe('publish: createRemoteInAzure', () => {
    it('should use azure-devops-node-api to create a repo in the given project', async () => {
      const mockGitClient = {
        createRepository: jest.fn(),
      };
      const mockGitApi = {
        getGitApi: jest.fn().mockReturnValue(mockGitClient),
      };

      ((WebApi as unknown) as jest.Mock).mockImplementation(() => mockGitApi);

      const publisher = await AzurePublisher.fromConfig({
        host: 'dev.azure.com',
        token: 'fake-azure-token',
      });

      mockGitClient.createRepository.mockResolvedValue({
        remoteUrl: 'https://dev.azure.com/organization/project/_git/repo',
      } as { remoteUrl: string });

      const result = await publisher!.publish({
        values: {
          storePath: 'https://dev.azure.com/organisation/project/_git/repo',
          owner: 'bob',
        },
        workspacePath,
        logger,
      });

      expect(WebApi).toHaveBeenCalledWith(
        'https://dev.azure.com/organisation',
        expect.any(Function),
      );

      expect(result).toEqual({
        remoteUrl: 'https://dev.azure.com/organization/project/_git/repo',
        catalogInfoUrl:
          'https://dev.azure.com/organization/project/_git/repo?path=%2Fcatalog-info.yaml',
      });
      expect(mockGitClient.createRepository).toHaveBeenCalledWith(
        {
          name: 'repo',
        },
        'project',
      );
      expect(helpers.initRepoAndPush).toHaveBeenCalledWith({
        dir: resultPath,
        remoteUrl: 'https://dev.azure.com/organization/project/_git/repo',
        auth: { username: 'notempty', password: 'fake-azure-token' },
        logger,
      });
    });
  });
});
