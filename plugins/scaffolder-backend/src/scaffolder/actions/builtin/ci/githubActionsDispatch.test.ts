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
// @ts-nocheck

jest.mock('@backstage/integration');
jest.mock('@octokit/rest', () => ({ Octokit: jest.fn() }));

import { createGithubActionsDispatchAction } from './githubActionsDispatch';
import {
  ScmIntegrations,
  GithubCredentialsProvider,
} from '@backstage/integration';
import { ConfigReader } from '@backstage/config';
import { getVoidLogger } from '@backstage/backend-common';
import { PassThrough } from 'stream';

import { Octokit } from '@octokit/rest';

describe('ci:github-actions-dispatch', () => {
  const config = new ConfigReader({
    integrations: {
      github: [
        { host: 'github.com', token: 'tokenlols' },
        { host: 'ghe.github.com' },
      ],
    },
  });

  const mockContext = {
    input: {
      owner: 'a-owner',
      repoUrl: 'github.com?repo=repo&owner=owner',
      repoName: 'repository-name',
      workflowId: 'a-workflow-id',
      branchOrTagName: 'main',
    },
    workspacePath: 'lol',
    logger: getVoidLogger(),
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should throw if there is no integration config provided', async () => {
    const integrations = {
      github: {
        list: () => [],
        byHost: jest.fn(),
        byUrl: jest.fn(),
      },
    } as ScmIntegrations;
    const actionWithNoIntegrations = createGithubActionsDispatchAction({
      integrations,
      config,
    });
    await expect(actionWithNoIntegrations.handler(mockContext)).rejects.toThrow(
      /No matching integration configuration/,
    );
  });

  it('should throw if no token is provided', async () => {
    const integrations = {
      github: {
        list: () => [
          {
            config: {
              host: 'github.com',
            },
          },
        ],
        byHost: () => ({
          config: {
            apiBaseUrl: 'https://api.github.com',
          },
        }),
        byUrl: jest.fn(),
      },
    } as ScmIntegrations;
    const mockedCredentialsProvider = {
      getCredentials: jest.fn(),
    };
    mockedCredentialsProvider.getCredentials.mockResolvedValue({});
    GithubCredentialsProvider.create.mockReturnValueOnce(
      mockedCredentialsProvider,
    );
    const actionWithNoIntegrations = createGithubActionsDispatchAction({
      integrations,
      config,
    });
    await expect(actionWithNoIntegrations.handler(mockContext)).rejects.toThrow(
      /No token available for host/,
    );
  });

  it('should call the githubApis for creating WorkflowDispatch', async () => {
    const integrations = {
      github: {
        list: () => [
          {
            config: {
              host: 'github.com',
            },
          },
        ],
        byHost: () => ({
          config: {
            apiBaseUrl: 'https://api.github.com',
          },
        }),
        byUrl: jest.fn(),
      },
    } as ScmIntegrations;
    const mockedCredentialsProvider = {
      getCredentials: jest.fn(),
    };
    mockedCredentialsProvider.getCredentials.mockResolvedValue({
      token: 'test-token',
    });
    GithubCredentialsProvider.create.mockReturnValueOnce(
      mockedCredentialsProvider,
    );
    const mockedCreateWorkflowDispatch = jest.fn();
    mockedCreateWorkflowDispatch.mockResolvedValue({
      message: 'Success',
    });
    Octokit.mockImplementation(() => {
      return {
        rest: {
          actions: {
            createWorkflowDispatch: mockedCreateWorkflowDispatch,
          },
        },
      };
    });
    const owner = 'dx';
    const repoName = 'test1';
    const workflowId = 'dispatch_workflow';
    const branchOrTagName = 'main';
    const ctx = Object.assign({}, mockContext, {
      input: { owner, repoName, workflowId, branchOrTagName },
    });
    const action = createGithubActionsDispatchAction({ integrations, config });
    await action.handler(ctx);

    expect(mockedCreateWorkflowDispatch).toHaveBeenCalledWith({
      owner,
      repo: repoName,
      workflow_id: workflowId,
      ref: branchOrTagName,
    });
  });
});
