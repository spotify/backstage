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

jest.mock('@octokit/rest');
jest.mock('@backstage/integration');

import { createGithubActionsDispatchAction } from './githubActionsDispatch';
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';
import { getVoidLogger } from '@backstage/backend-common';
import { PassThrough } from 'stream';
// import { when } from 'jest-when';

describe('ci:github-actions-dispatch', () => {
  const config = new ConfigReader({
    integrations: {
      github: [
        { host: 'github.com', token: 'tokenlols' },
        { host: 'ghe.github.com' },
      ],
    },
  });

  const integrations = ScmIntegrations.fromConfig(config);
  const action = createGithubActionsDispatchAction({ integrations, config });

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

  const { mockGithubClient } = require('@octokit/rest');
  mockGithubClient.rest = {
    actions: {
      createWorkflowDispatch: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  // it('should throw if there is no integration config provided', async () => {
  //   const actionWithNoIntegrations = createGithubActionsDispatchAction({
  //     integrations: {
  //       ...integrations,
  //       github: {
  //         list: () => [],
  //         byHost: jest.fn(),
  //         byUrl: jest.fn(),
  //       },
  //     },
  //     config,
  //   });
  //   await expect(actionWithNoIntegrations.handler(mockContext)).rejects.toThrow(
  //     /No matching integration configuration/,
  //   );
  // });

  // it('should throw if there is no token in the integration config that is returned', async () => {
  //   const mockedProvider = jest.fn();
  //   const mockedIntegrationConfig = jest.fn();
  //   GithubCredentialsProvider.create.mockReturnOnce(mockedProvider);
  //   const mockedArray = [
  //     {
  //       config: {
  //         host: 'github.com',
  //       },
  //     },
  //   ] as GitHubIntegration[];
  //   const integrations1 = {
  //     github: {
  //       list: () => mockedArray,
  //       byHost: mockedIntegrationConfig,
  //       byUrl: jest.fn(),
  //     },
  //   } as ScmIntegrationRegistry;
  //   const actionWithNoIntegrations = createGithubActionsDispatchAction({
  //     integrations: integrations1,
  //     config,
  //   });
  //   mockedProvider.mockResolvedValue(undefined);

  //   await expect(actionWithNoIntegrations.handler(mockContext)).rejects.toThrow(
  //     /No token available for host/,
  //   );
  // });

  it('should call the githubApis for creating WorkflowDispatch', async () => {
    mockGithubClient.rest.actions.createWorkflowDispatch.mockResolvedValue({
      message: 'Success',
    });
    const owner = 'dx';
    const repoName = 'test1';
    const workflowId = 'dispatch_workflow';
    const branchOrTagName = 'main';
    const ctx = Object.assign({}, mockContext, {
      input: { owner, repoName, workflowId, branchOrTagName },
    });
    await action.handler(ctx);

    expect(
      mockGithubClient.rest.actions.createWorkflowDispatch,
    ).toHaveBeenCalledWith({
      owner,
      repo: repoName,
      workflow_id: workflowId,
      ref: branchOrTagName,
    });
  });
});
