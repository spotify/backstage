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
jest.mock('../../../stages/publish/helpers');
jest.mock('@octokit/rest');

import { createPublishGithubAction } from './github';
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';
import { getVoidLogger } from '@backstage/backend-common';
import { PassThrough } from 'stream';
import { initRepoAndPush } from '../../../stages/publish/helpers';
import { when } from 'jest-when';

describe('publish:github', () => {
  const integrations = ScmIntegrations.fromConfig(
    new ConfigReader({
      integrations: {
        github: [
          { host: 'github.com', token: 'tokenlols' },
          { host: 'ghe.github.com' },
        ],
      },
    }),
  );
  const action = createPublishGithubAction({ integrations });
  const mockContext = {
    input: {
      repoUrl: 'github.com?repo=repo&owner=owner',
      description: 'description',
      repoVisibility: 'private',
      access: 'owner/blam',
    },
    workspacePath: 'lol',
    logger: getVoidLogger(),
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
  };

  const { mockGithubClient } = require('@octokit/rest');

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should throw an error when the repoUrl is not well formed', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: { repoUrl: 'github.com?repo=bob' },
      }),
    ).rejects.toThrow(/missing owner/);

    await expect(
      action.handler({
        ...mockContext,
        input: { repoUrl: 'github.com?owner=owner' },
      }),
    ).rejects.toThrow(/missing repo/);
  });

  it('should throw if there is no integration config provided', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: { repoUrl: 'missing.com?repo=bob&owner=owner' },
      }),
    ).rejects.toThrow(/No matching integration configuration/);
  });

  it('should throw if there is no token in the integration config that is returned', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {
          repoUrl: 'ghe.github.com?repo=bob&owner=owner',
        },
      }),
    ).rejects.toThrow(/No token available for host/);
  });

  it('should call the githubApis with the correct values for createInOrg', async () => {
    mockGithubClient.users.getByUsername.mockResolvedValue({
      data: { type: 'Organization' },
    });

    mockGithubClient.repos.createInOrg.mockResolvedValue({ data: {} });

    await action.handler(mockContext);
    expect(mockGithubClient.repos.createInOrg).toHaveBeenCalledWith({
      description: 'description',
      name: 'repo',
      org: 'owner',
      private: true,
      visibility: 'private',
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        repoVisibility: 'public',
      },
    });
    expect(mockGithubClient.repos.createInOrg).toHaveBeenCalledWith({
      description: 'description',
      name: 'repo',
      org: 'owner',
      private: false,
      visibility: 'public',
    });
  });

  it('should call the githubApis with the correct values for createForAuthenticatedUser', async () => {
    mockGithubClient.users.getByUsername.mockResolvedValue({
      data: { type: 'User' },
    });

    mockGithubClient.repos.createForAuthenticatedUser.mockResolvedValue({
      data: {},
    });

    await action.handler(mockContext);
    expect(
      mockGithubClient.repos.createForAuthenticatedUser,
    ).toHaveBeenCalledWith({
      description: 'description',
      name: 'repo',
      private: true,
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        repoVisibility: 'public',
      },
    });
    expect(
      mockGithubClient.repos.createForAuthenticatedUser,
    ).toHaveBeenCalledWith({
      description: 'description',
      name: 'repo',
      private: false,
    });
  });

  it('should call initRepoAndPush with the correct values', async () => {
    mockGithubClient.users.getByUsername.mockResolvedValue({
      data: { type: 'User' },
    });

    mockGithubClient.repos.createForAuthenticatedUser.mockResolvedValue({
      data: {
        clone_url: 'https://github.com/clone/url.git',
        html_url: 'https://github.com/html/url',
      },
    });

    await action.handler(mockContext);

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://github.com/clone/url.git',
      defaultBranch: 'master',
      auth: { username: 'x-access-token', password: 'tokenlols' },
      logger: mockContext.logger,
    });
  });

  it('should call initRepoAndPush with the correct defaultBranch main', async () => {
    mockGithubClient.users.getByUsername.mockResolvedValue({
      data: { type: 'User' },
    });

    mockGithubClient.repos.createForAuthenticatedUser.mockResolvedValue({
      data: {
        clone_url: 'https://github.com/clone/url.git',
        html_url: 'https://github.com/html/url',
      },
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        defaultBranch: 'main',
      },
    });

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://github.com/clone/url.git',
      defaultBranch: 'main',
      auth: { username: 'x-access-token', password: 'tokenlols' },
      logger: mockContext.logger,
    });
  });

  it('should add access for the team when it starts with the owner', async () => {
    mockGithubClient.users.getByUsername.mockResolvedValue({
      data: { type: 'User' },
    });

    mockGithubClient.repos.createForAuthenticatedUser.mockResolvedValue({
      data: {
        clone_url: 'https://github.com/clone/url.git',
        html_url: 'https://github.com/html/url',
      },
    });

    await action.handler(mockContext);

    expect(
      mockGithubClient.teams.addOrUpdateRepoPermissionsInOrg,
    ).toHaveBeenCalledWith({
      org: 'owner',
      team_slug: 'blam',
      owner: 'owner',
      repo: 'repo',
      permission: 'admin',
    });
  });

  it('should add outside collaborators when provided', async () => {
    mockGithubClient.users.getByUsername.mockResolvedValue({
      data: { type: 'User' },
    });

    mockGithubClient.repos.createForAuthenticatedUser.mockResolvedValue({
      data: {
        clone_url: 'https://github.com/clone/url.git',
        html_url: 'https://github.com/html/url',
      },
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        access: 'outsidecollaborator',
      },
    });

    expect(mockGithubClient.repos.addCollaborator).toHaveBeenCalledWith({
      username: 'outsidecollaborator',
      owner: 'owner',
      repo: 'repo',
      permission: 'admin',
    });
  });

  it('should add multiple collaborators when provided', async () => {
    mockGithubClient.users.getByUsername.mockResolvedValue({
      data: { type: 'User' },
    });

    mockGithubClient.repos.createForAuthenticatedUser.mockResolvedValue({
      data: {
        clone_url: 'https://github.com/clone/url.git',
        html_url: 'https://github.com/html/url',
      },
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        collaborators: [
          {
            access: 'pull',
            username: 'robot-1',
          },
          {
            access: 'push',
            username: 'robot-2',
          },
        ],
      },
    });

    const commonProperties = {
      org: 'owner',
      owner: 'owner',
      repo: 'repo',
    };

    expect(
      mockGithubClient.teams.addOrUpdateRepoPermissionsInOrg.mock.calls[1],
    ).toEqual([
      {
        ...commonProperties,
        team_slug: 'robot-1',
        permission: 'pull',
      },
    ]);

    expect(
      mockGithubClient.teams.addOrUpdateRepoPermissionsInOrg.mock.calls[2],
    ).toEqual([
      {
        ...commonProperties,
        team_slug: 'robot-2',
        permission: 'push',
      },
    ]);
  });

  it('should ignore failures when adding multiple collaborators', async () => {
    mockGithubClient.users.getByUsername.mockResolvedValue({
      data: { type: 'User' },
    });

    mockGithubClient.repos.createForAuthenticatedUser.mockResolvedValue({
      data: {
        clone_url: 'https://github.com/clone/url.git',
        html_url: 'https://github.com/html/url',
      },
    });

    when(mockGithubClient.teams.addOrUpdateRepoPermissionsInOrg)
      .calledWith({
        org: 'owner',
        owner: 'owner',
        repo: 'repo',
        team_slug: 'robot-1',
        permission: 'pull',
      })
      .mockRejectedValueOnce(new Error('Something bad happened') as never);

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        collaborators: [
          {
            access: 'pull',
            username: 'robot-1',
          },
          {
            access: 'push',
            username: 'robot-2',
          },
        ],
      },
    });

    expect(
      mockGithubClient.teams.addOrUpdateRepoPermissionsInOrg.mock.calls[2],
    ).toEqual([
      {
        org: 'owner',
        owner: 'owner',
        repo: 'repo',
        team_slug: 'robot-2',
        permission: 'push',
      },
    ]);
  });

  it('should add topics when provided', async () => {
    mockGithubClient.users.getByUsername.mockResolvedValue({
      data: { type: 'User' },
    });

    mockGithubClient.repos.createForAuthenticatedUser.mockResolvedValue({
      data: {
        clone_url: 'https://github.com/clone/url.git',
        html_url: 'https://github.com/html/url',
      },
    });

    mockGithubClient.repos.replaceAllTopics.mockResolvedValue({
      data: {
        names: ['node.js'],
      },
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        topics: ['node.js'],
      },
    });

    expect(mockGithubClient.repos.replaceAllTopics).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      names: ['node.js'],
    });
  });

  it('should lowercase topics when provided', async () => {
    mockGithubClient.users.getByUsername.mockResolvedValue({
      data: { type: 'User' },
    });

    mockGithubClient.repos.createForAuthenticatedUser.mockResolvedValue({
      data: {
        clone_url: 'https://github.com/clone/url.git',
        html_url: 'https://github.com/html/url',
      },
    });

    mockGithubClient.repos.replaceAllTopics.mockResolvedValue({
      data: {
        names: ['backstage'],
      },
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        topics: ['BACKSTAGE'],
      },
    });

    expect(mockGithubClient.repos.replaceAllTopics).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      names: ['backstage'],
    });
  });

  it('should call output with the remoteUrl and the repoContentsUrl', async () => {
    mockGithubClient.users.getByUsername.mockResolvedValue({
      data: { type: 'User' },
    });

    mockGithubClient.repos.createForAuthenticatedUser.mockResolvedValue({
      data: {
        clone_url: 'https://github.com/clone/url.git',
        html_url: 'https://github.com/html/url',
      },
    });

    await action.handler(mockContext);

    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://github.com/clone/url.git',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'repoContentsUrl',
      'https://github.com/html/url/blob/master',
    );
  });

  it('should use main as default branch', async () => {
    mockGithubClient.users.getByUsername.mockResolvedValue({
      data: { type: 'User' },
    });

    mockGithubClient.repos.createForAuthenticatedUser.mockResolvedValue({
      data: {
        clone_url: 'https://github.com/clone/url.git',
        html_url: 'https://github.com/html/url',
      },
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        defaultBranch: 'main',
      },
    });

    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://github.com/clone/url.git',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'repoContentsUrl',
      'https://github.com/html/url/blob/main',
    );
  });
});
