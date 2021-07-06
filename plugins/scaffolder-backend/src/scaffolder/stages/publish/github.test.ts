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

jest.mock('@octokit/rest');
jest.mock('./helpers');

import os from 'os';
import { resolve } from 'path';

import { getVoidLogger } from '@backstage/backend-common';
import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';
import { GithubPublisher } from './github';
import { initRepoAndPush } from './helpers';

const { mockGithubClient } = require('@octokit/rest') as {
  mockGithubClient: {
    repos: jest.Mocked<Octokit['repos']>;
    users: jest.Mocked<Octokit['users']>;
    teams: jest.Mocked<Octokit['teams']>;
  };
};

describe('GitHub Publisher', () => {
  const logger = getVoidLogger();
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const workspacePath = os.platform() === 'win32' ? 'C:\\tmp' : '/tmp';
  const resultPath = resolve(workspacePath, 'result');

  describe('with public repo visibility', () => {
    describe('publish: createRemoteInGithub', () => {
      it('should use octokit to create a repo in an organisation if the organisation property is set', async () => {
        const publisher = await GithubPublisher.fromConfig(
          {
            token: 'fake-token',
            host: 'github.com',
          },
          { repoVisibility: 'public' },
        );

        mockGithubClient.repos.createInOrg.mockResolvedValue({
          data: {
            clone_url: 'https://github.com/backstage/backstage.git',
          },
        } as RestEndpointMethodTypes['repos']['createInOrg']['response']);
        mockGithubClient.users.getByUsername.mockResolvedValue({
          data: {
            type: 'Organization',
          },
        } as RestEndpointMethodTypes['users']['getByUsername']['response']);

        const result = await publisher!.publish({
          values: {
            storePath: 'https://github.com/blam/test',
            owner: 'bob',
            access: 'blam/team',
          },
          workspacePath,
          logger,
        });

        expect(result).toEqual({
          remoteUrl: 'https://github.com/backstage/backstage.git',
          catalogInfoUrl:
            'https://github.com/backstage/backstage/blob/master/catalog-info.yaml',
        });
        expect(mockGithubClient.repos.createInOrg).toHaveBeenCalledWith({
          org: 'blam',
          name: 'test',
          private: false,
          visibility: 'public',
        });
        expect(
          mockGithubClient.teams.addOrUpdateRepoPermissionsInOrg,
        ).toHaveBeenCalledWith({
          org: 'blam',
          team_slug: 'team',
          owner: 'blam',
          repo: 'test',
          permission: 'admin',
        });
        expect(initRepoAndPush).toHaveBeenCalledWith({
          dir: resultPath,
          remoteUrl: 'https://github.com/backstage/backstage.git',
          auth: { username: 'x-access-token', password: 'fake-token' },
          logger,
        });
      });

      it('should use octokit to create a repo in the authed user if the organisation property is not set', async () => {
        const publisher = await GithubPublisher.fromConfig(
          {
            token: 'fake-token',
            host: 'github.com',
          },
          { repoVisibility: 'public' },
        );

        mockGithubClient.repos.createForAuthenticatedUser.mockResolvedValue({
          data: {
            clone_url: 'https://github.com/backstage/backstage.git',
          },
        } as RestEndpointMethodTypes['repos']['createForAuthenticatedUser']['response']);
        mockGithubClient.users.getByUsername.mockResolvedValue({
          data: {
            type: 'User',
          },
        } as RestEndpointMethodTypes['users']['getByUsername']['response']);

        const result = await publisher!.publish({
          values: {
            storePath: 'https://github.com/blam/test',
            owner: 'bob',
            access: 'blam',
          },
          workspacePath,
          logger,
        });

        expect(result).toEqual({
          remoteUrl: 'https://github.com/backstage/backstage.git',
          catalogInfoUrl:
            'https://github.com/backstage/backstage/blob/master/catalog-info.yaml',
        });
        expect(
          mockGithubClient.repos.createForAuthenticatedUser,
        ).toHaveBeenCalledWith({
          name: 'test',
          private: false,
        });
        expect(mockGithubClient.repos.addCollaborator).not.toHaveBeenCalled();

        expect(initRepoAndPush).toHaveBeenCalledWith({
          dir: resultPath,
          remoteUrl: 'https://github.com/backstage/backstage.git',
          auth: { username: 'x-access-token', password: 'fake-token' },
          logger,
        });
      });
    });

    it('should invite other user in the authed user', async () => {
      const publisher = await GithubPublisher.fromConfig(
        {
          token: 'fake-token',
          host: 'github.com',
        },
        { repoVisibility: 'public' },
      );

      mockGithubClient.repos.createForAuthenticatedUser.mockResolvedValue({
        data: {
          clone_url: 'https://github.com/backstage/backstage.git',
        },
      } as RestEndpointMethodTypes['repos']['createForAuthenticatedUser']['response']);
      mockGithubClient.users.getByUsername.mockResolvedValue({
        data: {
          type: 'User',
        },
      } as RestEndpointMethodTypes['users']['getByUsername']['response']);

      const result = await publisher!.publish({
        values: {
          storePath: 'https://github.com/blam/test',
          owner: 'bob',
          access: 'bob',
          description: 'description',
        },
        workspacePath,
        logger,
      });

      expect(result).toEqual({
        remoteUrl: 'https://github.com/backstage/backstage.git',
        catalogInfoUrl:
          'https://github.com/backstage/backstage/blob/master/catalog-info.yaml',
      });
      expect(
        mockGithubClient.repos.createForAuthenticatedUser,
      ).toHaveBeenCalledWith({
        description: 'description',
        name: 'test',
        private: false,
      });
      expect(mockGithubClient.repos.addCollaborator).toHaveBeenCalledWith({
        owner: 'blam',
        repo: 'test',
        username: 'bob',
        permission: 'admin',
      });
      expect(initRepoAndPush).toHaveBeenCalledWith({
        dir: resultPath,
        remoteUrl: 'https://github.com/backstage/backstage.git',
        auth: { username: 'x-access-token', password: 'fake-token' },
        logger,
      });
    });
  });

  describe('with internal repo visibility', () => {
    it('creates a private repository in the organization with visibility set to internal', async () => {
      const publisher = await GithubPublisher.fromConfig(
        {
          token: 'fake-token',
          host: 'github.com',
        },
        { repoVisibility: 'internal' },
      );

      mockGithubClient.repos.createInOrg.mockResolvedValue({
        data: {
          clone_url: 'https://github.com/backstage/backstage.git',
        },
      } as RestEndpointMethodTypes['repos']['createInOrg']['response']);
      mockGithubClient.users.getByUsername.mockResolvedValue({
        data: {
          type: 'Organization',
        },
      } as RestEndpointMethodTypes['users']['getByUsername']['response']);

      const result = await publisher!.publish({
        values: {
          isOrg: true,
          storePath: 'https://github.com/blam/test',
          owner: 'bob',
        },
        workspacePath,
        logger,
      });

      expect(result).toEqual({
        remoteUrl: 'https://github.com/backstage/backstage.git',
        catalogInfoUrl:
          'https://github.com/backstage/backstage/blob/master/catalog-info.yaml',
      });
      expect(mockGithubClient.repos.createInOrg).toHaveBeenCalledWith({
        org: 'blam',
        name: 'test',
        private: true,
        visibility: 'internal',
      });
      expect(initRepoAndPush).toHaveBeenCalledWith({
        dir: resultPath,
        remoteUrl: 'https://github.com/backstage/backstage.git',
        auth: { username: 'x-access-token', password: 'fake-token' },
        logger,
      });
    });
  });

  describe('private visibility in a user account', () => {
    it('creates a private repository', async () => {
      const publisher = await GithubPublisher.fromConfig(
        {
          token: 'fake-token',
          host: 'github.com',
        },
        { repoVisibility: 'private' },
      );

      mockGithubClient.repos.createForAuthenticatedUser.mockResolvedValue({
        data: {
          clone_url: 'https://github.com/backstage/backstage.git',
        },
      } as RestEndpointMethodTypes['repos']['createForAuthenticatedUser']['response']);
      mockGithubClient.users.getByUsername.mockResolvedValue({
        data: {
          type: 'User',
        },
      } as RestEndpointMethodTypes['users']['getByUsername']['response']);

      const result = await publisher!.publish({
        values: {
          storePath: 'https://github.com/blam/test',
          owner: 'bob',
        },
        workspacePath,
        logger,
      });

      expect(result).toEqual({
        remoteUrl: 'https://github.com/backstage/backstage.git',
        catalogInfoUrl:
          'https://github.com/backstage/backstage/blob/master/catalog-info.yaml',
      });
      expect(
        mockGithubClient.repos.createForAuthenticatedUser,
      ).toHaveBeenCalledWith({
        name: 'test',
        private: true,
      });
      expect(initRepoAndPush).toHaveBeenCalledWith({
        dir: resultPath,
        remoteUrl: 'https://github.com/backstage/backstage.git',
        auth: { username: 'x-access-token', password: 'fake-token' },
        logger,
      });
    });
  });
});
