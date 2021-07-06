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
jest.mock('../../../stages/publish/helpers');

import { createPublishBitbucketAction } from './bitbucket';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { msw } from '@backstage/test-utils';
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';
import { getVoidLogger } from '@backstage/backend-common';
import { PassThrough } from 'stream';
import { initRepoAndPush } from '../../../stages/publish/helpers';

describe('publish:bitbucket', () => {
  const integrations = ScmIntegrations.fromConfig(
    new ConfigReader({
      integrations: {
        bitbucket: [
          {
            host: 'bitbucket.org',
            token: 'tokenlols',
          },
          {
            host: 'hosted.bitbucket.com',
            token: 'thing',
            apiBaseUrl: 'https://hosted.bitbucket.com/rest/api/1.0',
          },
          {
            host: 'notoken.bitbucket.com',
          },
        ],
      },
    }),
  );
  const action = createPublishBitbucketAction({ integrations });
  const mockContext = {
    input: {
      repoUrl: 'bitbucket.org?repo=repo&owner=owner',
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
        input: { repoUrl: 'bitbucket.com?repo=bob' },
      }),
    ).rejects.toThrow(/missing owner/);

    await expect(
      action.handler({
        ...mockContext,
        input: { repoUrl: 'bitbucket.com?owner=owner' },
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
          repoUrl: 'notoken.bitbucket.com?repo=bob&owner=owner',
        },
      }),
    ).rejects.toThrow(/Authorization has not been provided for Bitbucket/);
  });

  it('should call the correct APIs when the host is bitbucket cloud', async () => {
    expect.assertions(2);
    server.use(
      rest.post(
        'https://api.bitbucket.org/2.0/repositories/owner/repo',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Bearer tokenlols');
          expect(req.body).toEqual({ is_private: true, scm: 'git' });
          return res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json({
              links: {
                html: {
                  href: 'https://bitbucket.org/owner/repo',
                },
                clone: [
                  {
                    name: 'https',
                    href: 'https://bitbucket.org/owner/repo',
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

  it('should call the correct APIs when the host is hosted bitbucket', async () => {
    expect.assertions(2);
    server.use(
      rest.post(
        'https://hosted.bitbucket.com/rest/api/1.0/projects/owner/repos',
        (req, res, ctx) => {
          expect(req.headers.get('Authorization')).toBe('Bearer thing');
          expect(req.body).toEqual({ public: false, name: 'repo' });
          return res(
            ctx.status(201),
            ctx.set('Content-Type', 'application/json'),
            ctx.json({
              links: {
                self: [
                  {
                    href:
                      'https://bitbucket.mycompany.com/projects/project/repos/repo',
                  },
                ],
                clone: [
                  {
                    name: 'http',
                    href: 'https://bitbucket.mycompany.com/scm/project/repo',
                  },
                ],
              },
            }),
          );
        },
      ),
    );

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        repoUrl: 'hosted.bitbucket.com?owner=owner&repo=repo',
      },
    });
  });

  describe('LFS for hosted bitbucket', () => {
    const repoCreationResponse = {
      links: {
        self: [
          {
            href: 'https://bitbucket.mycompany.com/projects/project/repos/repo',
          },
        ],
        clone: [
          {
            name: 'http',
            href: 'https://bitbucket.mycompany.com/scm/project/repo',
          },
        ],
      },
    };

    it('should call the correct APIs to enable LFS if requested and the host is hosted bitbucket', async () => {
      expect.assertions(1);
      server.use(
        rest.post(
          'https://hosted.bitbucket.com/rest/api/1.0/projects/owner/repos',
          (_, res, ctx) => {
            return res(
              ctx.status(201),
              ctx.set('Content-Type', 'application/json'),
              ctx.json(repoCreationResponse),
            );
          },
        ),
        rest.put(
          'https://hosted.bitbucket.com/rest/git-lfs/admin/projects/owner/repos/repo/enabled',
          (req, res, ctx) => {
            expect(req.headers.get('Authorization')).toBe('Bearer thing');
            return res(ctx.status(204));
          },
        ),
      );

      await action.handler({
        ...mockContext,
        input: {
          ...mockContext.input,
          repoUrl: 'hosted.bitbucket.com?owner=owner&repo=repo',
          enableLFS: true,
        },
      });
    });

    it('should report an error if enabling LFS fails', async () => {
      server.use(
        rest.post(
          'https://hosted.bitbucket.com/rest/api/1.0/projects/owner/repos',
          (_, res, ctx) => {
            return res(
              ctx.status(201),
              ctx.set('Content-Type', 'application/json'),
              ctx.json(repoCreationResponse),
            );
          },
        ),
        rest.put(
          'https://hosted.bitbucket.com/rest/git-lfs/admin/projects/owner/repos/repo/enabled',
          (_, res, ctx) => {
            return res(ctx.status(500));
          },
        ),
      );

      await expect(
        action.handler({
          ...mockContext,
          input: {
            ...mockContext.input,
            repoUrl: 'hosted.bitbucket.com?owner=owner&repo=repo',
            enableLFS: true,
          },
        }),
      ).rejects.toThrow(/Failed to enable LFS/);
    });
  });

  it('should call initAndPush with the correct values', async () => {
    server.use(
      rest.post(
        'https://api.bitbucket.org/2.0/repositories/owner/repo',
        (_, res, ctx) =>
          res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json({
              links: {
                html: {
                  href: 'https://bitbucket.org/owner/repo',
                },
                clone: [
                  {
                    name: 'https',
                    href: 'https://bitbucket.org/owner/cloneurl',
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
      remoteUrl: 'https://bitbucket.org/owner/cloneurl',
      defaultBranch: 'master',
      auth: { username: 'x-token-auth', password: 'tokenlols' },
      logger: mockContext.logger,
    });
  });

  it('should call initAndPush with the correct default branch', async () => {
    server.use(
      rest.post(
        'https://api.bitbucket.org/2.0/repositories/owner/repo',
        (_, res, ctx) =>
          res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json({
              links: {
                html: {
                  href: 'https://bitbucket.org/owner/repo',
                },
                clone: [
                  {
                    name: 'https',
                    href: 'https://bitbucket.org/owner/cloneurl',
                  },
                ],
              },
            }),
          ),
      ),
    );

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        defaultBranch: 'main',
      },
    });

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://bitbucket.org/owner/cloneurl',
      defaultBranch: 'main',
      auth: { username: 'x-token-auth', password: 'tokenlols' },
      logger: mockContext.logger,
    });
  });

  it('should call outputs with the correct urls', async () => {
    server.use(
      rest.post(
        'https://api.bitbucket.org/2.0/repositories/owner/repo',
        (_, res, ctx) =>
          res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json({
              links: {
                html: {
                  href: 'https://bitbucket.org/owner/repo',
                },
                clone: [
                  {
                    name: 'https',
                    href: 'https://bitbucket.org/owner/cloneurl',
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
      'https://bitbucket.org/owner/cloneurl',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'repoContentsUrl',
      'https://bitbucket.org/owner/repo/src/master',
    );
  });
});
