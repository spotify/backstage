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

import os from 'os';
import { resolve } from 'path';
import { BitbucketPublisher } from './bitbucket';
import { initRepoAndPush } from './helpers';
import { getVoidLogger } from '@backstage/backend-common';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { msw } from '@backstage/test-utils';

describe('Bitbucket Publisher', () => {
  const logger = getVoidLogger();
  const server = setupServer();
  msw.setupDefaultHandlers(server);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const workspacePath = os.platform() === 'win32' ? 'C:\\tmp' : '/tmp';
  const resultPath = resolve(workspacePath, 'result');

  describe('publish: createRemoteInBitbucketCloud', () => {
    it('should create repo in bitbucket cloud', async () => {
      server.use(
        rest.post(
          'https://api.bitbucket.org/2.0/repositories/project/repo',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/json'),
              ctx.json({
                links: {
                  html: {
                    href: 'https://bitbucket.org/project/repo',
                  },
                  clone: [
                    {
                      name: 'https',
                      href: 'https://bitbucket.org/project/repo',
                    },
                  ],
                },
              }),
            ),
        ),
      );

      const publisher = await BitbucketPublisher.fromConfig(
        {
          host: 'bitbucket.org',
          username: 'fake-user',
          appPassword: 'fake-token',
        },
        { repoVisibility: 'private' },
      );

      const result = await publisher.publish({
        values: {
          storePath: 'https://bitbucket.org/project/repo',
          owner: 'bob',
        },
        workspacePath,
        logger: logger,
      });

      expect(result).toEqual({
        remoteUrl: 'https://bitbucket.org/project/repo',
        catalogInfoUrl:
          'https://bitbucket.org/project/repo/src/master/catalog-info.yaml',
      });

      expect(initRepoAndPush).toHaveBeenCalledWith({
        dir: resultPath,
        remoteUrl: 'https://bitbucket.org/project/repo',
        auth: { username: 'fake-user', password: 'fake-token' },
        logger: logger,
      });
    });
  });

  describe('publish: createRemoteInBitbucketServer', () => {
    it('should throw an error if no username present', async () => {
      await expect(
        BitbucketPublisher.fromConfig(
          {
            host: 'bitbucket.mycompany.com',
            token: 'fake-token',
          },
          { repoVisibility: 'private' },
        ),
      ).rejects.toThrow(
        'Bitbucket server requires the username to be set in your config',
      );
    });
    it('should create repo in bitbucket server', async () => {
      server.use(
        rest.post(
          'https://bitbucket.mycompany.com/rest/api/1.0/projects/project/repos',
          (_, res, ctx) =>
            res(
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
            ),
        ),
      );

      const publisher = await BitbucketPublisher.fromConfig(
        {
          host: 'bitbucket.mycompany.com',
          username: 'foo',
          token: 'fake-token',
        },
        { repoVisibility: 'private' },
      );

      const result = await publisher.publish({
        values: {
          storePath: 'https://bitbucket.mycompany.com/project/repo',
          owner: 'bob',
        },
        workspacePath,
        logger: logger,
      });

      expect(result).toEqual({
        remoteUrl: 'https://bitbucket.mycompany.com/scm/project/repo',
        catalogInfoUrl:
          'https://bitbucket.mycompany.com/projects/project/repos/repo/catalog-info.yaml',
      });

      expect(initRepoAndPush).toHaveBeenCalledWith({
        dir: resultPath,
        remoteUrl: 'https://bitbucket.mycompany.com/scm/project/repo',
        auth: { username: 'foo', password: 'fake-token' },
        logger: logger,
      });
    });
  });

  it('should use apiBaseUrl to create the repository if it is set', async () => {
    server.use(
      rest.post(
        'https://bitbucket.mycompany.com/bitbucket/rest/api/1.0/projects/project/repos',
        (_, res, ctx) =>
          res(
            ctx.status(201),
            ctx.set('Content-Type', 'application/json'),
            ctx.json({
              links: {
                self: [
                  {
                    href:
                      'https://bitbucket.mycompany.com/bitbucket/projects/project/repos/repo',
                  },
                ],
                clone: [
                  {
                    name: 'http',
                    href:
                      'https://bitbucket.mycompany.com/bitbucket/scm/project/repo',
                  },
                ],
              },
            }),
          ),
      ),
    );

    const publisher = await BitbucketPublisher.fromConfig(
      {
        host: 'bitbucket.mycompany.com',
        username: 'foo',
        token: 'fake-token',
        apiBaseUrl: 'https://bitbucket.mycompany.com/bitbucket/rest/api/1.0',
      },
      { repoVisibility: 'private' },
    );

    const result = await publisher.publish({
      values: {
        storePath: 'https://bitbucket.mycompany.com/project/repo',
        owner: 'bob',
      },
      workspacePath,
      logger: logger,
    });

    expect(result).toEqual({
      remoteUrl: 'https://bitbucket.mycompany.com/bitbucket/scm/project/repo',
      catalogInfoUrl:
        'https://bitbucket.mycompany.com/bitbucket/projects/project/repos/repo/catalog-info.yaml',
    });
  });
});
