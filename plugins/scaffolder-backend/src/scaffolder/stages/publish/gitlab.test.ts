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

jest.mock('@gitbeaker/node', () => ({
  Gitlab: jest.fn(),
}));

jest.mock('./helpers');

import os from 'os';
import path from 'path';
import { GitlabPublisher } from './gitlab';
import { Gitlab } from '@gitbeaker/node';
import { initRepoAndPush } from './helpers';
import { getVoidLogger } from '@backstage/backend-common';

describe('GitLab Publisher', () => {
  const logger = getVoidLogger();
  const mockGitlabClient = {
    Namespaces: {
      show: jest.fn(),
    },
    Projects: {
      create: jest.fn(),
    },
    Users: {
      current: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    ((Gitlab as unknown) as jest.Mock).mockImplementation(
      () => mockGitlabClient,
    );
  });

  const workspacePath = os.platform() === 'win32' ? 'C:\\tmp' : '/tmp';
  const resultPath = path.resolve(workspacePath, 'result');

  describe('publish: createRemoteInGitLab', () => {
    it('should use gitbeaker to create a repo in a namespace if the namespace property is set', async () => {
      const publisher = await GitlabPublisher.fromConfig(
        {
          host: 'gitlab.com',
          apiBaseUrl: 'https://gitlab.com/api/v4',
          token: 'fake-token',
          baseUrl: 'https://gitlab.hosted.com',
        },
        { repoVisibility: 'public' },
      );

      mockGitlabClient.Namespaces.show.mockResolvedValue({
        id: 42,
      } as { id: number });
      mockGitlabClient.Projects.create.mockResolvedValue({
        http_url_to_repo: 'mockclone',
      } as { http_url_to_repo: string });

      const result = await publisher!.publish({
        values: {
          isOrg: true,
          storePath: 'https://gitlab.com/blam/test',
          owner: 'bob',
        },
        workspacePath,
        logger,
      });

      expect(Gitlab).toHaveBeenCalledWith({
        token: 'fake-token',
        host: 'https://gitlab.hosted.com',
      });
      expect(result).toEqual({
        remoteUrl: 'mockclone',
        catalogInfoUrl: 'mockclone',
      });
      expect(mockGitlabClient.Projects.create).toHaveBeenCalledWith({
        namespace_id: 42,
        name: 'test',
        visibility: 'public',
      });
      expect(initRepoAndPush).toHaveBeenCalledWith({
        dir: resultPath,
        remoteUrl: 'mockclone',
        auth: { username: 'oauth2', password: 'fake-token' },
        logger,
      });
    });

    it('should use gitbeaker to create a repo in the authed user if the namespace property is not set', async () => {
      const publisher = await GitlabPublisher.fromConfig(
        {
          host: 'gitlab.com',
          apiBaseUrl: 'https://gitlab.com/api/v4',
          token: 'fake-token',
          baseUrl: 'https://gitlab.com',
        },
        { repoVisibility: 'public' },
      );

      mockGitlabClient.Namespaces.show.mockResolvedValue({});
      mockGitlabClient.Users.current.mockResolvedValue({
        id: 21,
      } as { id: number });
      mockGitlabClient.Projects.create.mockResolvedValue({
        http_url_to_repo: 'mockclone',
      } as { http_url_to_repo: string });

      const result = await publisher!.publish({
        values: {
          storePath: 'https://gitlab.com/blam/test',
          owner: 'bob',
        },
        workspacePath,
        logger,
      });

      expect(result).toEqual({
        remoteUrl: 'mockclone',
        catalogInfoUrl: 'mockclone',
      });
      expect(mockGitlabClient.Users.current).toHaveBeenCalled();
      expect(mockGitlabClient.Projects.create).toHaveBeenCalledWith({
        namespace_id: 21,
        name: 'test',
        visibility: 'public',
      });
      expect(initRepoAndPush).toHaveBeenCalledWith({
        dir: resultPath,
        remoteUrl: 'mockclone',
        auth: { username: 'oauth2', password: 'fake-token' },
        logger,
      });
    });
  });
});
