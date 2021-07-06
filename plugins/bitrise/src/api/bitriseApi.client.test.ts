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

import { msw } from '@backstage/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { BitriseClientApi } from './bitriseApi.client';
import { BitriseApi } from './bitriseApi';
import { UrlPatternDiscovery } from '@backstage/core-app-api';

const server = setupServer();

describe('BitriseClientApi', () => {
  msw.setupDefaultHandlers(server);

  const mockBaseUrl = 'http://backstage:9191/api/proxy';
  const discoveryApi = UrlPatternDiscovery.compile(mockBaseUrl);
  let client: BitriseApi;

  beforeEach(() => {
    client = new BitriseClientApi(discoveryApi);
  });

  describe('getBuilds()', () => {
    it('should get builds for given workflow', async () => {
      server.use(
        rest.get(`${mockBaseUrl}/*`, (_req, res, ctx) => {
          return res(
            ctx.json({
              data: [{ slug: 'some-build-slug' }],
            }),
          );
        }),
      );

      const builds = await client.getBuilds('some-app-slug', {
        workflow: 'ios-develop',
      });

      expect(builds.data.length).toBe(1);
      expect(builds.data[0].appSlug).toBe('some-app-slug');
    });

    it('should get builds and map the results', async () => {
      server.use(
        rest.get(`${mockBaseUrl}/*`, (_req, res, ctx) => {
          return res(
            ctx.json({
              data: [
                { slug: 'some-build-slug' },
                { slug: 'some-build-slug-2' },
              ],
            }),
          );
        }),
      );

      const builds = await client.getBuilds('some-app-slug', {
        workflow: '',
      });

      expect(builds.data.length).toBe(2);
      expect(builds.data[0].appSlug).toBe('some-app-slug');
      expect(builds.data[0].buildSlug).toBe('some-build-slug');
      expect(builds.data[1].buildSlug).toBe('some-build-slug-2');
    });
  });

  describe('getApp()', () => {
    it('should get all apps', async () => {
      server.use(
        rest.get(
          `${mockBaseUrl}/bitrise/apps?next=slug-2-1`,
          (_req, res, ctx) => {
            const next = _req.url.searchParams.get('next');
            if (next === 'slug-2-1') {
              return res(
                ctx.json({
                  data: [{ title: 'app21', slug: 'slug-2-1' }],
                }),
              );
            }
            return res(
              ctx.json({
                data: [
                  { title: 'app11', slug: 'slug-1-1' },
                  { title: 'app12', slug: 'slug-1-2' },
                ],
                paging: {
                  next: 'slug-2-1',
                  page_item_limit: 0,
                  total_item_count: 0,
                },
              }),
            );
          },
        ),
      );

      const apps = await client.getApps();

      expect(apps).toBeDefined();
      expect(apps.length).toBe(3);
    });

    it('should get the app', async () => {
      server.use(
        rest.get(`${mockBaseUrl}/*`, (_req, res, ctx) => {
          return res(
            ctx.json({
              data: [{ title: 'some-app-title', slug: 'some-app-slug' }],
            }),
          );
        }),
      );

      const app = await client.getApp('some-app-title');

      expect(app).toBeDefined();
      expect(app?.slug).toBe('some-app-slug');
    });
  });

  describe('getBuildWorkflows()', () => {
    it('should get workflows', async () => {
      server.use(
        rest.get(`${mockBaseUrl}/*`, (_req, res, ctx) => {
          return res(
            ctx.json({
              data: ['ios-develop', 'ios-master'],
            }),
          );
        }),
      );

      const workflows = await client.getBuildWorkflows('some-app-title');

      expect(workflows).toBeDefined();
      expect(workflows.length).toEqual(2);
      expect(workflows[0]).toBe('ios-develop');
      expect(workflows[1]).toBe('ios-master');
    });
  });

  describe('getBuildArtifacts()', () => {
    it('should get artifacts for a build', async () => {
      server.use(
        rest.get(
          `${mockBaseUrl}/bitrise/apps/*/builds/*/artifacts`,
          (_req, res, ctx) => {
            return res(
              ctx.json({
                data: [
                  {
                    title: 'some-artifact-title-1',
                    slug: 'some-artifact-slug-1',
                  },
                  {
                    title: 'some-artifact-title-2',
                    slug: 'some-artifact-slug-2',
                  },
                ],
              }),
            );
          },
        ),
      );

      const artifacts = await client.getBuildArtifacts(
        'some-app-slug',
        'some-build-slug',
      );

      expect(artifacts).toBeDefined();
      expect(artifacts.length).toBe(2);
      expect(artifacts[0].slug).toBe('some-artifact-slug-1');
      expect(artifacts[1].slug).toBe('some-artifact-slug-2');
    });
  });

  describe('getArtifactDetails()', () => {
    it('should get the artifact details', async () => {
      server.use(
        rest.get(`${mockBaseUrl}/*`, (_req, res, ctx) => {
          return res(
            ctx.json({
              data: {
                title: 'some-artifact-title',
                slug: 'some-artifact-slug',
              },
            }),
          );
        }),
      );

      const artifact = await client.getArtifactDetails(
        'some-app-slug',
        'some-build-slug',
        'some-artifact-slug',
      );

      expect(artifact).toBeDefined();
      expect(artifact?.title).toBe('some-artifact-title');
    });
  });
});
