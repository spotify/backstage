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
jest.mock('@gitbeaker/node');

import { createPublishGitlabAction } from './gitlab';
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';
import { getVoidLogger } from '@backstage/backend-common';
import { PassThrough } from 'stream';
import { initRepoAndPush } from '../../../stages/publish/helpers';

describe('publish:gitlab', () => {
  const integrations = ScmIntegrations.fromConfig(
    new ConfigReader({
      integrations: {
        gitlab: [
          {
            host: 'gitlab.com',
            token: 'tokenlols',
            apiBaseUrl: 'https://api.gitlab.com',
          },
          {
            host: 'hosted.gitlab.com',
            apiBaseUrl: 'https://api.hosted.gitlab.com',
          },
        ],
      },
    }),
  );
  const action = createPublishGitlabAction({ integrations });
  const mockContext = {
    input: {
      repoUrl: 'gitlab.com?repo=repo&owner=owner',
      repoVisibility: 'private',
    },
    workspacePath: 'lol',
    logger: getVoidLogger(),
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
  };

  const { mockGitlabClient } = require('@gitbeaker/node');

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should throw an error when the repoUrl is not well formed', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: { repoUrl: 'gitlab.com?repo=bob' },
      }),
    ).rejects.toThrow(/missing owner/);

    await expect(
      action.handler({
        ...mockContext,
        input: { repoUrl: 'gitlab.com?owner=owner' },
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
          repoUrl: 'hosted.gitlab.com?repo=bob&owner=owner',
        },
      }),
    ).rejects.toThrow(/No token available for host/);
  });

  it('should call the correct Gitlab APIs when the owner is an organization', async () => {
    mockGitlabClient.Namespaces.show.mockResolvedValue({ id: 1234 });
    mockGitlabClient.Projects.create.mockResolvedValue({
      http_url_to_repo: 'http://mockurl.git',
    });

    await action.handler(mockContext);

    expect(mockGitlabClient.Namespaces.show).toHaveBeenCalledWith('owner');
    expect(mockGitlabClient.Projects.create).toHaveBeenCalledWith({
      namespace_id: 1234,
      name: 'repo',
      visibility: 'private',
    });
  });

  it('should call the correct Gitlab APIs when the owner is not an organization', async () => {
    mockGitlabClient.Namespaces.show.mockResolvedValue({ id: null });
    mockGitlabClient.Users.current.mockResolvedValue({ id: 12345 });
    mockGitlabClient.Projects.create.mockResolvedValue({
      http_url_to_repo: 'http://mockurl.git',
    });

    await action.handler(mockContext);

    expect(mockGitlabClient.Namespaces.show).toHaveBeenCalledWith('owner');
    expect(mockGitlabClient.Projects.create).toHaveBeenCalledWith({
      namespace_id: 12345,
      name: 'repo',
      visibility: 'private',
    });
  });

  it('should call initRepoAndPush with the correct values', async () => {
    mockGitlabClient.Namespaces.show.mockResolvedValue({ id: 1234 });
    mockGitlabClient.Projects.create.mockResolvedValue({
      http_url_to_repo: 'http://mockurl.git',
    });

    await action.handler(mockContext);

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      defaultBranch: 'master',
      remoteUrl: 'http://mockurl.git',
      auth: { username: 'oauth2', password: 'tokenlols' },
      logger: mockContext.logger,
    });
  });

  it('should call initRepoAndPush with the correct default branch', async () => {
    mockGitlabClient.Namespaces.show.mockResolvedValue({ id: 1234 });
    mockGitlabClient.Projects.create.mockResolvedValue({
      http_url_to_repo: 'http://mockurl.git',
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
      defaultBranch: 'main',
      remoteUrl: 'http://mockurl.git',
      auth: { username: 'oauth2', password: 'tokenlols' },
      logger: mockContext.logger,
    });
  });

  it('should call output with the remoteUrl and repoContentsUrl', async () => {
    mockGitlabClient.Namespaces.show.mockResolvedValue({ id: 1234 });
    mockGitlabClient.Projects.create.mockResolvedValue({
      http_url_to_repo: 'http://mockurl.git',
    });

    await action.handler(mockContext);

    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'http://mockurl',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'repoContentsUrl',
      'http://mockurl/-/blob/master',
    );
  });
});
