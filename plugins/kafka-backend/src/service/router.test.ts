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

import request from 'supertest';
import express from 'express';
import { makeRouter, ClusterApi } from './router';
import { errorHandler, getVoidLogger } from '@backstage/backend-common';
import { KafkaApi } from './KafkaApi';
import { when } from 'jest-when';

describe('router', () => {
  let app: express.Express;
  let apis: ClusterApi[];
  let devKafkaApi: jest.Mocked<KafkaApi>;
  let prodKafkaApi: jest.Mocked<KafkaApi>;

  beforeAll(async () => {
    devKafkaApi = {
      fetchTopicOffsets: jest.fn(),
      fetchGroupOffsets: jest.fn(),
    };

    prodKafkaApi = {
      fetchTopicOffsets: jest.fn(),
      fetchGroupOffsets: jest.fn(),
    };

    apis = [
      { name: 'dev', api: devKafkaApi },
      { name: 'prod', api: prodKafkaApi },
    ];

    const router = makeRouter(getVoidLogger(), apis);
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('get /consumers/clusterId/:consumerId/offsets', () => {
    it('returns topic and group offsets', async () => {
      const topic1Offsets = [
        { id: 1, offset: '500' },
        { id: 2, offset: '1000' },
      ];
      const topic2Offsets = [{ id: 1, offset: '456' }];

      const groupOffsets = [
        {
          topic: 'topic1',
          partitions: [
            { id: 1, offset: '100' },
            { id: 2, offset: '213' },
          ],
        },
        {
          topic: 'topic2',
          partitions: [{ id: 1, offset: '456' }],
        },
      ];
      when(prodKafkaApi.fetchTopicOffsets)
        .calledWith('topic1')
        .mockResolvedValue(topic1Offsets);
      when(prodKafkaApi.fetchTopicOffsets)
        .calledWith('topic2')
        .mockResolvedValue(topic2Offsets);
      when(prodKafkaApi.fetchGroupOffsets)
        .calledWith('hey')
        .mockResolvedValue(groupOffsets);

      const response = await request(app).get('/consumers/prod/hey/offsets');

      expect(response.status).toEqual(200);
      expect(response.body.consumerId).toEqual('hey');
      // Note the Set comparison here since there's no guarantee on the order of the elements in the list.
      expect(new Set(response.body.offsets)).toStrictEqual(
        new Set([
          {
            topic: 'topic1',
            partitionId: 1,
            groupOffset: '100',
            topicOffset: '500',
          },
          {
            topic: 'topic1',
            partitionId: 2,
            groupOffset: '213',
            topicOffset: '1000',
          },
          {
            topic: 'topic2',
            partitionId: 1,
            groupOffset: '456',
            topicOffset: '456',
          },
        ]),
      );
    });

    it('handles unknown cluster errors correctly', async () => {
      const response = await request(app.use(errorHandler())).get(
        '/consumers/unknown/hey/offsets',
      );
      expect(response.status).toEqual(404);
      expect(response.body).toMatchObject({
        error: {
          message:
            'Found no configured cluster "unknown", candidates are "dev", "prod"',
        },
      });
    });

    it('handles internal error correctly', async () => {
      prodKafkaApi.fetchGroupOffsets.mockRejectedValue(Error('oh no'));

      const response = await request(app).get('/consumers/prod/hey/offsets');

      expect(response.status).toEqual(500);
    });

    it('uses correct kafka cluster', async () => {
      const topic1ProdOffsets = [{ id: 1, offset: '500' }];
      const topic1DevOffsets = [{ id: 1, offset: '1234' }];
      const groupProdOffsets = [
        {
          topic: 'topic1',
          partitions: [{ id: 1, offset: '100' }],
        },
      ];
      const groupDevOffsets = [
        {
          topic: 'topic1',
          partitions: [{ id: 1, offset: '567' }],
        },
      ];
      when(prodKafkaApi.fetchTopicOffsets)
        .calledWith('topic1')
        .mockResolvedValue(topic1ProdOffsets);
      when(prodKafkaApi.fetchGroupOffsets)
        .calledWith('hey')
        .mockResolvedValue(groupProdOffsets);
      when(devKafkaApi.fetchTopicOffsets)
        .calledWith('topic1')
        .mockResolvedValue(topic1DevOffsets);
      when(devKafkaApi.fetchGroupOffsets)
        .calledWith('hey')
        .mockResolvedValue(groupDevOffsets);

      const prodResponse = await request(app).get(
        '/consumers/prod/hey/offsets',
      );
      const devResponse = await request(app).get('/consumers/dev/hey/offsets');

      expect(prodResponse.status).toEqual(200);
      expect(prodResponse.body.consumerId).toEqual('hey');
      expect(new Set(prodResponse.body.offsets)).toStrictEqual(
        new Set([
          {
            topic: 'topic1',
            partitionId: 1,
            groupOffset: '100',
            topicOffset: '500',
          },
        ]),
      );
      expect(devResponse.status).toEqual(200);
      expect(devResponse.body.consumerId).toEqual('hey');
      expect(new Set(devResponse.body.offsets)).toStrictEqual(
        new Set([
          {
            topic: 'topic1',
            partitionId: 1,
            groupOffset: '567',
            topicOffset: '1234',
          },
        ]),
      );
    });
  });
});
