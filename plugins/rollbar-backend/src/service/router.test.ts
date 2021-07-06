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

import { getVoidLogger } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import express from 'express';
import request from 'supertest';
import { RollbarApi } from '../api';
import { createRouter } from './router';
import { RollbarProject, RollbarTopActiveItem } from '../api/types';

describe('createRouter', () => {
  let rollbarApi: jest.Mocked<RollbarApi>;
  let app: express.Express;

  beforeAll(async () => {
    rollbarApi = {
      getAllProjects: jest.fn(),
      getProject: jest.fn(),
      getProjectItems: jest.fn(),
      getTopActiveItems: jest.fn(),
      getOccuranceCounts: jest.fn(),
      getActivatedCounts: jest.fn(),
    } as any;
    const router = await createRouter({
      rollbarApi,
      logger: getVoidLogger(),
      config: new ConfigReader({ rollbar: { accountToken: 'foo' } }),
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /projects', () => {
    it('lists projects', async () => {
      const projects: RollbarProject[] = [
        { id: 123, name: 'abc', accountId: 1, status: 'enabled' },
        { id: 456, name: 'xyz', accountId: 1, status: 'enabled' },
      ];

      rollbarApi.getAllProjects.mockResolvedValueOnce(projects);

      const response = await request(app).get('/projects');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(projects);
    });

    it('throws an error', async () => {
      rollbarApi.getAllProjects.mockImplementationOnce(() => {
        throw Error('error');
      });

      const response = await request(app).get('/projects');

      expect(response.status).toEqual(500);
    });
  });

  describe('GET /projects/:id', () => {
    it('fetches a single project', async () => {
      const project: RollbarProject = {
        id: 123,
        name: 'abc',
        accountId: 1,
        status: 'enabled',
      };

      rollbarApi.getProject.mockResolvedValueOnce(project);

      const response = await request(app).get(`/projects/${123}`);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(project);
    });
  });

  describe('GET /projects/:id/top_active_items', () => {
    it('fetches a single project', async () => {
      const items: RollbarTopActiveItem[] = [
        {
          item: {
            id: 9898989,
            counter: 1234,
            environment: 'production',
            framework: 2,
            lastOccurrenceTimestamp: new Date().getTime() / 1000,
            level: 50,
            occurrences: 100,
            projectId: 12345,
            title: 'error occurred',
            uniqueOccurrences: 10,
          },
          counts: [10, 10, 10, 10, 10, 50],
        },
      ];

      rollbarApi.getTopActiveItems.mockResolvedValueOnce(items);

      const response = await request(app).get(
        `/projects/${123}/top_active_items`,
      );

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(items);
    });
  });
});
