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
import { getVoidLogger } from '@backstage/backend-common';
import { BitbucketDiscoveryProcessor } from './BitbucketDiscoveryProcessor';
import { ConfigReader } from '@backstage/config';
import { LocationSpec } from '@backstage/catalog-model';
import { BitbucketRepositoryParser, PagedResponse } from './bitbucket';
import { results } from './index';
import { RequestHandler, rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer();

function setupStubs(projects: any[]) {
  function pagedResponse(values: any): PagedResponse<any> {
    return {
      values: values,
      isLastPage: true,
    } as PagedResponse<any>;
  }

  function stubbedProject(
    project: string,
    repos: string[],
  ): RequestHandler<any, any> {
    return rest.get(
      `https://bitbucket.mycompany.com/api/rest/1.0/projects/${project}/repos`,
      (_, res, ctx) => {
        const response = [];
        for (const repo of repos) {
          response.push({
            slug: repo,
            links: {
              self: [
                {
                  href: `https://bitbucket.mycompany.com/projects/${project}/repos/${repo}/browse`,
                },
              ],
            },
          });
        }
        return res(ctx.json(pagedResponse(response)));
      },
    );
  }

  server.use(
    rest.get(
      `https://bitbucket.mycompany.com/api/rest/1.0/projects`,
      (_, res, ctx) => {
        return res(
          ctx.json(
            pagedResponse(
              projects.map(p => {
                return { key: p.key };
              }),
            ),
          ),
        );
      },
    ),
  );

  for (const project of projects) {
    server.use(stubbedProject(project.key, project.repos));
  }
}

describe('BitbucketDiscoveryProcessor', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  afterEach(() => jest.resetAllMocks());

  describe('reject unrelated entries', () => {
    it('rejects unknown types', async () => {
      const processor = BitbucketDiscoveryProcessor.fromConfig(
        new ConfigReader({
          integrations: {
            bitbucket: [{ host: 'bitbucket.mycompany.com', token: 'blob' }],
          },
        }),
        { logger: getVoidLogger() },
      );
      const location: LocationSpec = {
        type: 'not-bitbucket-discovery',
        target: 'https://bitbucket.mycompany.com',
      };
      await expect(
        processor.readLocation(location, false, () => {}),
      ).resolves.toBeFalsy();
    });

    it('rejects unknown targets', async () => {
      const processor = BitbucketDiscoveryProcessor.fromConfig(
        new ConfigReader({
          integrations: {
            bitbucket: [
              { host: 'bitbucket.org', token: 'blob' },
              { host: 'bitbucket.mycompany.com', token: 'blob' },
            ],
          },
        }),
        { logger: getVoidLogger() },
      );
      const location: LocationSpec = {
        type: 'bitbucket-discovery',
        target: 'https://not.bitbucket.mycompany.com/foobar',
      };
      await expect(
        processor.readLocation(location, false, () => {}),
      ).rejects.toThrow(
        /There is no Bitbucket integration that matches https:\/\/not.bitbucket.mycompany.com\/foobar/,
      );
    });
  });

  describe('handles repositories', () => {
    const processor = BitbucketDiscoveryProcessor.fromConfig(
      new ConfigReader({
        integrations: {
          bitbucket: [
            {
              host: 'bitbucket.mycompany.com',
              token: 'blob',
              apiBaseUrl: 'https://bitbucket.mycompany.com/api/rest/1.0',
            },
          ],
        },
      }),
      { logger: getVoidLogger() },
    );

    it('output all repositories', async () => {
      setupStubs([
        { key: 'backstage', repos: ['backstage'] },
        { key: 'demo', repos: ['demo'] },
      ]);
      const location: LocationSpec = {
        type: 'bitbucket-discovery',
        target:
          'https://bitbucket.mycompany.com/projects/*/repos/*/catalog.yaml',
      };

      const emitter = jest.fn();

      await processor.readLocation(location, false, emitter);

      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.mycompany.com/projects/backstage/repos/backstage/browse/catalog.yaml',
        },
        optional: true,
      });
      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.mycompany.com/projects/demo/repos/demo/browse/catalog.yaml',
        },
        optional: true,
      });
    });

    it('output repositories with wildcards', async () => {
      setupStubs([
        { key: 'backstage', repos: ['backstage', 'techdocs-cli'] },
        { key: 'demo', repos: ['demo'] },
      ]);
      const location: LocationSpec = {
        type: 'bitbucket-discovery',
        target:
          'https://bitbucket.mycompany.com/projects/backstage/repos/techdocs-*/catalog.yaml',
      };

      const emitter = jest.fn();
      await processor.readLocation(location, false, emitter);

      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.mycompany.com/projects/backstage/repos/techdocs-cli/browse/catalog.yaml',
        },
        optional: true,
      });
    });
    it('filter unrelated repositories', async () => {
      setupStubs([{ key: 'backstage', repos: ['test', 'abctest', 'testxyz'] }]);
      const location: LocationSpec = {
        type: 'bitbucket-discovery',
        target:
          'https://bitbucket.mycompany.com/projects/backstage/repos/test/catalog.yaml',
      };

      const emitter = jest.fn();
      await processor.readLocation(location, false, emitter);

      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://bitbucket.mycompany.com/projects/backstage/repos/test/browse/catalog.yaml',
        },
        optional: true,
      });
    });
  });

  describe('Custom repository parser', () => {
    const customRepositoryParser: BitbucketRepositoryParser = async function* customRepositoryParser({}) {
      yield results.location(
        {
          type: 'custom-location-type',
          target: 'custom-target',
        },
        true,
      );
    };

    const processor = BitbucketDiscoveryProcessor.fromConfig(
      new ConfigReader({
        integrations: {
          bitbucket: [
            {
              host: 'bitbucket.mycompany.com',
              token: 'blob',
              apiBaseUrl: 'https://bitbucket.mycompany.com/api/rest/1.0',
            },
          ],
        },
      }),
      { parser: customRepositoryParser, logger: getVoidLogger() },
    );

    it('use custom repository parser', async () => {
      setupStubs([{ key: 'backstage', repos: ['test'] }]);

      const location: LocationSpec = {
        type: 'bitbucket-discovery',
        target:
          'https://bitbucket.mycompany.com/projects/backstage/repos/test/catalog.yaml',
      };

      const emitter = jest.fn();
      await processor.readLocation(location, false, emitter);

      expect(emitter).toHaveBeenCalledTimes(1);
      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'custom-location-type',
          target: 'custom-target',
        },
        optional: true,
      });
    });
  });
});
