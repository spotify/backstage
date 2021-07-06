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

import mockFs from 'mock-fs';
import { Writable } from 'stream';
import os from 'os';
import { resolve as resolvePath } from 'path';
import {
  PullRequestCreator,
  GithubPullRequestActionInput,
  createPublishGithubPullRequestAction,
  ClientFactoryInput,
} from './githubPullRequest';
import { ActionContext, TemplateAction } from '../../types';
import { getRootLogger } from '@backstage/backend-common';

import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';

const root = os.platform() === 'win32' ? 'C:\\root' : '/root';
const workspacePath = resolvePath(root, 'my-workspace');

describe('createPublishGithubPullRequestAction', () => {
  let instance: TemplateAction<GithubPullRequestActionInput>;
  let fakeClient: PullRequestCreator;

  let clientFactory: (input: ClientFactoryInput) => Promise<PullRequestCreator>;

  beforeEach(() => {
    const integrations = ScmIntegrations.fromConfig(new ConfigReader({}));
    fakeClient = {
      createPullRequest: jest.fn(async (_: any) => {
        return {
          url: 'https://api.github.com/myorg/myrepo/pull/123',
          headers: {},
          status: 201,
          data: {
            html_url: 'https://github.com/myorg/myrepo/pull/123',
          },
        };
      }),
    };
    clientFactory = jest.fn(async () => fakeClient);

    instance = createPublishGithubPullRequestAction({
      integrations,
      clientFactory,
    });
  });

  describe('with no sourcePath', () => {
    let input: GithubPullRequestActionInput;
    let ctx: ActionContext<GithubPullRequestActionInput>;

    beforeEach(() => {
      input = {
        owner: 'myorg',
        repo: 'myrepo',
        title: 'Create my new app',
        branchName: 'new-app',
        description: 'This PR is really good',
      };

      mockFs({
        [workspacePath]: { 'file.txt': 'Hello there!' },
      });

      ctx = {
        createTemporaryDirectory: jest.fn(),
        output: jest.fn(),
        logger: getRootLogger(),
        logStream: new Writable(),
        input,
        workspacePath,
      };
    });
    it('creates a pull request', async () => {
      await instance.handler(ctx);

      expect(fakeClient.createPullRequest).toHaveBeenCalledWith({
        owner: 'myorg',
        repo: 'myrepo',
        title: 'Create my new app',
        head: 'new-app',
        body: 'This PR is really good',
        changes: [
          {
            commit: 'Create my new app',
            files: {
              'file.txt': 'Hello there!',
            },
          },
        ],
      });
    });

    it('creates outputs for the url', async () => {
      await instance.handler(ctx);

      expect(ctx.output).toHaveBeenCalledWith(
        'remoteUrl',
        'https://github.com/myorg/myrepo/pull/123',
      );
    });
    afterEach(() => {
      mockFs.restore();
      jest.resetAllMocks();
    });
  });

  describe('with sourcePath', () => {
    let input: GithubPullRequestActionInput;
    let ctx: ActionContext<GithubPullRequestActionInput>;

    beforeEach(() => {
      input = {
        owner: 'myorg',
        repo: 'myrepo',
        title: 'Create my new app',
        branchName: 'new-app',
        description: 'This PR is really good',
        sourcePath: 'source',
      };

      mockFs({
        [workspacePath]: {
          source: { 'foo.txt': 'Hello there!' },
          irrelevant: { 'bar.txt': 'Nothing to see here' },
        },
      });

      ctx = {
        createTemporaryDirectory: jest.fn(),
        output: jest.fn(),
        logger: getRootLogger(),
        logStream: new Writable(),
        input,
        workspacePath,
      };
    });

    afterEach(() => {
      mockFs.restore();
      jest.resetAllMocks();
    });

    it('creates a pull request with only relevant files', async () => {
      await instance.handler(ctx);

      expect(fakeClient.createPullRequest).toHaveBeenCalledWith({
        owner: 'myorg',
        repo: 'myrepo',
        title: 'Create my new app',
        head: 'new-app',
        body: 'This PR is really good',
        changes: [
          {
            commit: 'Create my new app',
            files: {
              'foo.txt': 'Hello there!',
            },
          },
        ],
      });
    });
  });

  describe('with repoUrl', () => {
    let input: GithubPullRequestActionInput;
    let ctx: ActionContext<GithubPullRequestActionInput>;

    beforeEach(() => {
      input = {
        repoUrl: 'github.com?owner=myorg&repo=myrepo',
        title: 'Create my new app',
        branchName: 'new-app',
        description: 'This PR is really good',
      };

      mockFs({
        [workspacePath]: { 'file.txt': 'Hello there!' },
      });

      ctx = {
        createTemporaryDirectory: jest.fn(),
        output: jest.fn(),
        logger: getRootLogger(),
        logStream: new Writable(),
        input,
        workspacePath,
      };
    });
    it('creates a pull request', async () => {
      await instance.handler(ctx);

      expect(fakeClient.createPullRequest).toHaveBeenCalledWith({
        owner: 'myorg',
        repo: 'myrepo',
        title: 'Create my new app',
        head: 'new-app',
        body: 'This PR is really good',
        changes: [
          {
            commit: 'Create my new app',
            files: {
              'file.txt': 'Hello there!',
            },
          },
        ],
      });
    });

    it('creates outputs for the url', async () => {
      await instance.handler(ctx);

      expect(ctx.output).toHaveBeenCalledWith(
        'remoteUrl',
        'https://github.com/myorg/myrepo/pull/123',
      );
    });
    afterEach(() => {
      mockFs.restore();
      jest.resetAllMocks();
    });
  });
});
