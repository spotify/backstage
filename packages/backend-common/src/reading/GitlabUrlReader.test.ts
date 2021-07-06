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

import { ConfigReader } from '@backstage/config';
import { msw } from '@backstage/test-utils';
import fs from 'fs-extra';
import mockFs from 'mock-fs';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import os from 'os';
import path from 'path';
import { getVoidLogger } from '../logging';
import { GitlabUrlReader } from './GitlabUrlReader';
import { DefaultReadTreeResponseFactory } from './tree';
import { NotModifiedError, NotFoundError } from '@backstage/errors';
import {
  GitLabIntegration,
  readGitLabIntegrationConfig,
} from '@backstage/integration';

const logger = getVoidLogger();

const treeResponseFactory = DefaultReadTreeResponseFactory.create({
  config: new ConfigReader({}),
});

const gitlabProcessor = new GitlabUrlReader(
  new GitLabIntegration(
    readGitLabIntegrationConfig(
      new ConfigReader({
        host: 'gitlab.com',
        apiBaseUrl: 'https://gitlab.com/api/v4',
        baseUrl: 'https://gitlab.com',
      }),
    ),
  ),
  { treeResponseFactory },
);

const hostedGitlabProcessor = new GitlabUrlReader(
  new GitLabIntegration(
    readGitLabIntegrationConfig(
      new ConfigReader({
        host: 'gitlab.mycompany.com',
        apiBaseUrl: 'https://gitlab.mycompany.com/api/v4',
        baseUrl: 'https://gitlab.mycompany.com',
      }),
    ),
  ),
  { treeResponseFactory },
);

const tmpDir = os.platform() === 'win32' ? 'C:\\tmp' : '/tmp';

describe('GitlabUrlReader', () => {
  beforeEach(() => {
    mockFs({
      [tmpDir]: mockFs.directory(),
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  const worker = setupServer();
  msw.setupDefaultHandlers(worker);

  describe('read', () => {
    beforeEach(() => {
      worker.use(
        rest.get('*/api/v4/projects/:name', (_, res, ctx) =>
          res(ctx.status(200), ctx.json({ id: 12345 })),
        ),
        rest.get('*', (req, res, ctx) =>
          res(
            ctx.status(200),
            ctx.json({
              url: req.url.toString(),
              headers: req.headers.all(),
            }),
          ),
        ),
      );
    });

    const createConfig = (token?: string) =>
      new ConfigReader(
        {
          integrations: { gitlab: [{ host: 'gitlab.com', token }] },
        },
        'test-config',
      );

    it.each([
      // Project URLs
      {
        url:
          'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/my/path/to/file.yaml',
        config: createConfig(),
        response: expect.objectContaining({
          url:
            'https://gitlab.com/api/v4/projects/12345/repository/files/my%2Fpath%2Fto%2Ffile.yaml/raw?ref=branch',
          headers: expect.objectContaining({
            'private-token': '',
          }),
        }),
      },
      {
        url:
          'https://gitlab.example.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/my/path/to/file.yaml',
        config: createConfig('0123456789'),
        response: expect.objectContaining({
          url:
            'https://gitlab.example.com/api/v4/projects/12345/repository/files/my%2Fpath%2Fto%2Ffile.yaml/raw?ref=branch',
          headers: expect.objectContaining({
            'private-token': '0123456789',
          }),
        }),
      },
      {
        url:
          'https://gitlab.com/groupA/teams/teamA/repoA/-/blob/branch/my/path/to/file.yaml', // Repo not in subgroup
        config: createConfig(),
        response: expect.objectContaining({
          url:
            'https://gitlab.com/api/v4/projects/12345/repository/files/my%2Fpath%2Fto%2Ffile.yaml/raw?ref=branch',
        }),
      },

      // Raw URLs
      {
        url: 'https://gitlab.example.com/a/b/blob/master/c.yaml',
        config: createConfig(),
        response: expect.objectContaining({
          url: 'https://gitlab.example.com/a/b/raw/master/c.yaml',
        }),
      },
    ])('should handle happy path %#', async ({ url, config, response }) => {
      const [{ reader }] = GitlabUrlReader.factory({
        config,
        logger,
        treeResponseFactory,
      });

      const data = await reader.read(url);
      const res = await JSON.parse(data.toString('utf-8'));
      expect(res).toEqual(response);
    });

    it.each([
      {
        url: '',
        config: createConfig(''),
        error:
          "Invalid type in config for key 'integrations.gitlab[0].token' in 'test-config', got empty-string, wanted string",
      },
    ])('should handle error path %#', async ({ url, config, error }) => {
      await expect(async () => {
        const [{ reader }] = GitlabUrlReader.factory({
          config,
          logger,
          treeResponseFactory,
        });
        await reader.read(url);
      }).rejects.toThrow(error);
    });
  });

  describe('readUrl', () => {
    const [{ reader }] = GitlabUrlReader.factory({
      config: new ConfigReader({}),
      logger,
      treeResponseFactory,
    });

    it('should throw NotModified on HTTP 304', async () => {
      worker.use(
        rest.get('*/api/v4/projects/:name', (_, res, ctx) =>
          res(ctx.status(200), ctx.json({ id: 12345 })),
        ),
        rest.get('*', (req, res, ctx) => {
          expect(req.headers.get('If-None-Match')).toBe('999');
          return res(ctx.status(304));
        }),
      );

      await expect(
        reader.readUrl!(
          'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/my/path/to/file.yaml',
          {
            etag: '999',
          },
        ),
      ).rejects.toThrow(NotModifiedError);
    });

    it('should return etag in response', async () => {
      worker.use(
        rest.get('*/api/v4/projects/:name', (_, res, ctx) =>
          res(ctx.status(200), ctx.json({ id: 12345 })),
        ),
        rest.get('*', (_req, res, ctx) => {
          return res(ctx.status(200), ctx.set('ETag', '999'), ctx.body('foo'));
        }),
      );

      const result = await reader.readUrl!(
        'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/my/path/to/file.yaml',
      );
      expect(result.etag).toBe('999');
      const content = await result.buffer();
      expect(content.toString()).toBe('foo');
    });
  });

  describe('readTree', () => {
    const archiveBuffer = fs.readFileSync(
      path.resolve('src', 'reading', '__fixtures__', 'gitlab-archive.tar.gz'),
    );

    const projectGitlabApiResponse = {
      id: 11111111,
      default_branch: 'main',
    };

    const commitsGitlabApiResponse = [
      {
        id: 'sha123abc',
      },
    ];

    const specificPathCommitsGitlabApiResponse = [
      {
        id: 'sha456def',
      },
    ];

    beforeEach(() => {
      worker.use(
        rest.get(
          'https://gitlab.com/api/v4/projects/backstage%2Fmock/repository/archive',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/zip'),
              ctx.set(
                'content-disposition',
                'attachment; filename="mock-main-sha123abc.zip"',
              ),
              ctx.body(archiveBuffer),
            ),
        ),
        rest.get(
          'https://gitlab.com/api/v4/projects/backstage%2Fmock',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/json'),
              ctx.json(projectGitlabApiResponse),
            ),
        ),
        rest.get(
          'https://gitlab.com/api/v4/projects/backstage%2Fmock/repository/commits',
          (req, res, ctx) => {
            const refName = req.url.searchParams.get('ref_name');
            if (refName === 'main') {
              const filepath = req.url.searchParams.get('path');
              if (filepath === 'testFilepath') {
                return res(
                  ctx.status(200),
                  ctx.set('Content-Type', 'application/json'),
                  ctx.json(specificPathCommitsGitlabApiResponse),
                );
              }
              return res(
                ctx.status(200),
                ctx.set('Content-Type', 'application/json'),
                ctx.json(commitsGitlabApiResponse),
              );
            }
            if (refName === 'branchDoesNotExist') {
              return res(ctx.status(404));
            }
            return res();
          },
        ),
        rest.get(
          'https://gitlab.mycompany.com/api/v4/projects/backstage%2Fmock',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/json'),
              ctx.json(projectGitlabApiResponse),
            ),
        ),
        rest.get(
          'https://gitlab.mycompany.com/api/v4/projects/backstage%2Fmock/repository/commits',
          (req, res, ctx) => {
            const refName = req.url.searchParams.get('ref_name');
            if (refName === 'main') {
              const filepath = req.url.searchParams.get('path');
              if (filepath === 'testFilepath') {
                return res(
                  ctx.status(200),
                  ctx.set('Content-Type', 'application/json'),
                  ctx.json(specificPathCommitsGitlabApiResponse),
                );
              }
              return res(
                ctx.status(200),
                ctx.set('Content-Type', 'application/json'),
                ctx.json(commitsGitlabApiResponse),
              );
            }
            return res();
          },
        ),
        rest.get(
          'https://gitlab.mycompany.com/api/v4/projects/backstage%2Fmock/repository/archive',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/zip'),
              ctx.set(
                'content-disposition',
                'attachment; filename="mock-main-sha123abc.zip"',
              ),
              ctx.body(archiveBuffer),
            ),
        ),
      );
    });

    it('returns the wanted files from an archive', async () => {
      const response = await gitlabProcessor.readTree(
        'https://gitlab.com/backstage/mock/tree/main',
      );

      const files = await response.files();
      expect(files.length).toBe(2);

      const indexMarkdownFile = await files[0].content();
      const mkDocsFile = await files[1].content();

      expect(mkDocsFile.toString()).toBe('site_name: Test\n');
      expect(indexMarkdownFile.toString()).toBe('# Test\n');
    });

    it('creates a directory with the wanted files', async () => {
      const response = await gitlabProcessor.readTree(
        'https://gitlab.com/backstage/mock',
      );

      const dir = await response.dir({ targetDir: tmpDir });

      await expect(
        fs.readFile(path.join(dir, 'mkdocs.yml'), 'utf8'),
      ).resolves.toBe('site_name: Test\n');
      await expect(
        fs.readFile(path.join(dir, 'docs', 'index.md'), 'utf8'),
      ).resolves.toBe('# Test\n');
    });

    it('returns the wanted files from hosted gitlab', async () => {
      worker.use(
        rest.get(
          'https://gitlab.mycompany.com/backstage/mock/-/archive/main.tar.gz',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/zip'),
              ctx.set(
                'content-disposition',
                'attachment; filename="mock-main-sha123abc.zip"',
              ),
              ctx.body(archiveBuffer),
            ),
        ),
      );

      const response = await hostedGitlabProcessor.readTree(
        'https://gitlab.mycompany.com/backstage/mock/tree/main/docs',
      );

      const files = await response.files();

      expect(files.length).toBe(1);
      const indexMarkdownFile = await files[0].content();

      expect(indexMarkdownFile.toString()).toBe('# Test\n');
    });

    it('returns the wanted files from an archive with a subpath', async () => {
      const response = await gitlabProcessor.readTree(
        'https://gitlab.com/backstage/mock/tree/main/docs',
      );

      const files = await response.files();

      expect(files.length).toBe(1);
      const indexMarkdownFile = await files[0].content();

      expect(indexMarkdownFile.toString()).toBe('# Test\n');
    });

    it('creates a directory with the wanted files with subpath', async () => {
      const response = await gitlabProcessor.readTree(
        'https://gitlab.com/backstage/mock/tree/main/docs',
      );

      const dir = await response.dir({ targetDir: tmpDir });

      await expect(
        fs.readFile(path.join(dir, 'index.md'), 'utf8'),
      ).resolves.toBe('# Test\n');
    });

    it('throws a NotModifiedError when given a etag in options matching last commit', async () => {
      const fnGitlab = async () => {
        await gitlabProcessor.readTree('https://gitlab.com/backstage/mock', {
          etag: 'sha123abc',
        });
      };

      const fnHostedGitlab = async () => {
        await hostedGitlabProcessor.readTree(
          'https://gitlab.mycompany.com/backstage/mock',
          {
            etag: 'sha123abc',
          },
        );
      };

      await expect(fnGitlab).rejects.toThrow(NotModifiedError);
      await expect(fnHostedGitlab).rejects.toThrow(NotModifiedError);
    });

    it('throws a NotModifiedError when given a etag in options matching last commit affecting specified filepath', async () => {
      const fnGitlab = async () => {
        await gitlabProcessor.readTree(
          'https://gitlab.com/backstage/mock/blob/main/testFilepath',
          {
            etag: 'sha456def',
          },
        );
      };

      const fnHostedGitlab = async () => {
        await hostedGitlabProcessor.readTree(
          'https://gitlab.mycompany.com/backstage/mock/blob/main/testFilepath',
          {
            etag: 'sha456def',
          },
        );
      };

      await expect(fnGitlab).rejects.toThrow(NotModifiedError);
      await expect(fnHostedGitlab).rejects.toThrow(NotModifiedError);
    });

    it('should not throw error when given an outdated etag in options', async () => {
      const response = await gitlabProcessor.readTree(
        'https://gitlab.com/backstage/mock/tree/main',
        {
          etag: 'outdatedsha123abc',
        },
      );
      expect((await response.files()).length).toBe(2);
    });

    it('should detect the default branch', async () => {
      const response = await gitlabProcessor.readTree(
        'https://gitlab.com/backstage/mock',
      );
      expect((await response.files()).length).toBe(2);
    });

    it('should throw error on missing branch', async () => {
      const fnGitlab = async () => {
        await gitlabProcessor.readTree(
          'https://gitlab.com/backstage/mock/tree/branchDoesNotExist',
        );
      };
      await expect(fnGitlab).rejects.toThrow(NotFoundError);
    });
  });

  describe('search', () => {
    const archiveBuffer = fs.readFileSync(
      path.resolve('src', 'reading', '__fixtures__', 'gitlab-archive.tar.gz'),
    );

    const projectGitlabApiResponse = {
      id: 11111111,
      default_branch: 'main',
    };

    const commitsGitlabApiResponse = [
      {
        id: 'sha123abc',
      },
    ];

    beforeEach(() => {
      worker.use(
        rest.get(
          'https://gitlab.com/api/v4/projects/backstage%2Fmock/repository/archive',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/zip'),
              ctx.set(
                'content-disposition',
                'attachment; filename="mock-main-sha123abc.zip"',
              ),
              ctx.body(archiveBuffer),
            ),
        ),
        rest.get(
          'https://gitlab.com/api/v4/projects/backstage%2Fmock',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.set('Content-Type', 'application/json'),
              ctx.json(projectGitlabApiResponse),
            ),
        ),
        rest.get(
          'https://gitlab.com/api/v4/projects/backstage%2Fmock/repository/commits',
          (req, res, ctx) => {
            const refName = req.url.searchParams.get('ref_name');
            if (refName === 'main') {
              return res(
                ctx.status(200),
                ctx.set('Content-Type', 'application/json'),
                ctx.json(commitsGitlabApiResponse),
              );
            }
            return res();
          },
        ),
      );
    });

    it('works for the naive case', async () => {
      const result = await gitlabProcessor.search(
        'https://gitlab.com/backstage/mock/tree/main/**/index.*',
      );
      expect(result.etag).toBe('sha123abc');
      expect(result.files.length).toBe(1);
      expect(result.files[0].url).toBe(
        'https://gitlab.com/backstage/mock/tree/main/docs/index.md',
      );
      await expect(result.files[0].content()).resolves.toEqual(
        Buffer.from('# Test\n'),
      );
    });

    it('throws NotModifiedError when same etag', async () => {
      await expect(
        gitlabProcessor.search(
          'https://gitlab.com/backstage/mock/tree/main/**/index.*',
          { etag: 'sha123abc' },
        ),
      ).rejects.toThrow(NotModifiedError);
    });
  });
});
