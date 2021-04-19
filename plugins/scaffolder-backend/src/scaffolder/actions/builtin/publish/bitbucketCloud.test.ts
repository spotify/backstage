/*
 * Copyright 2021 Spotify AB
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

import { createPublishBitbucketCloudAction } from './bitbucketCloud';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { msw } from '@backstage/test-utils';
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';
import { getVoidLogger } from '@backstage/backend-common';
import { PassThrough } from 'stream';
import { initRepoAndPush } from '../../../stages/publish/helpers';

describe('publish:bitbucketcloud', () => {
  const integrations = ScmIntegrations.fromConfig(
    new ConfigReader({
      integrations: {
        bitbucket: [
          {
            host: 'bitbucket.org',
            token: 'tokenlols',
          },
        ],
      },
    }),
  );
  const action = createPublishBitbucketCloudAction({ integrations });
  const mockContext = {
    input: {
      repoUrl: 'bitbucket.org?repo=repo&workspace=workspace&project=project',
      repoVisibility: 'private',
    },
    workspacePath: 'lol',
    logger: getVoidLogger(),
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
  };
  const server = setupServer();
  msw.setupDefaultHandlers(server);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should throw an error when the repoUrl is not well formed', async () => {

    await expect(
      action.handler({
        ...mockContext,
        input: { repoUrl: 'bitbucket.org?repo=bob&workspace=workspace1' },
      }),
    ).rejects.toThrow(/missing project/);

    await expect(
      action.handler({
        ...mockContext,
        input: { repoUrl: 'bitbucket.org?repo=bob&project=project1' },
      }),
    ).rejects.toThrow(/missing workspace/);

    await expect(
      action.handler({
        ...mockContext,
        input: { repoUrl: 'bitbucket.org?workspace=workspace1&project=project1' },
      }),
    ).rejects.toThrow(/missing repo/);
  });

  it('should call the correct APIs when the host is bitbucket cloud', async () => {
    expect.assertions(2);
    server.use(
      rest.post(
        'https://api.bitbucket.org/2.0/repositories/workspace/repo',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Bearer tokenlols');
          expect(req.body).toEqual({ is_private: true, scm: 'git', project: { key: 'project' } });
          return res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json({
              links: {
                html: {
                  href: 'https://bitbucket.org/workspace/repo',
                },
                clone: [
                  {
                    name: 'https',
                    href: 'https://bitbucket.org/workspace/repo',
                  },
                ],
              },
            }),
          );
        },
      ),
    );

    await action.handler(mockContext);
  });

  it('should call initAndPush with the correct values', async () => {
    server.use(
      rest.post(
        'https://api.bitbucket.org/2.0/repositories/workspace/repo',
        (_, res, ctx) =>
          res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json({
              links: {
                html: {
                  href: 'https://bitbucket.org/workspace/repo',
                },
                clone: [
                  {
                    name: 'https',
                    href: 'https://bitbucket.org/workspace/cloneurl',
                  },
                ],
              },
            }),
          ),
      ),
    );

    await action.handler(mockContext);

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://bitbucket.org/workspace/cloneurl',
      auth: { username: 'x-token-auth', password: 'tokenlols' },
      logger: mockContext.logger,
    });
  });

  it('should call outputs with the correct urls', async () => {
    server.use(
      rest.post(
        'https://api.bitbucket.org/2.0/repositories/workspace/repo',
        (_, res, ctx) =>
          res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json({
              links: {
                html: {
                  href: 'https://bitbucket.org/workspace/repo',
                },
                clone: [
                  {
                    name: 'https',
                    href: 'https://bitbucket.org/workspace/cloneurl',
                  },
                ],
              },
            }),
          ),
      ),
    );

    await action.handler(mockContext);

    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://bitbucket.org/workspace/cloneurl',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'repoContentsUrl',
      'https://bitbucket.org/workspace/repo/src/master',
    );
  });
});
