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

import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { NotFoundError } from '@backstage/errors';
import { KafkaApi, KafkaJsApiImpl } from './KafkaApi';
import _ from 'lodash';
import { getClusterDetails } from '../config/ClusterReader';

export interface RouterOptions {
  logger: Logger;
  config: Config;
}

export interface ClusterApi {
  name: string;
  api: KafkaApi;
}

export const makeRouter = (
  logger: Logger,
  kafkaApis: ClusterApi[],
): express.Router => {
  const router = Router();
  router.use(express.json());

  const kafkaApiByClusterName = _.keyBy(kafkaApis, item => item.name);

  router.get('/consumers/:clusterId/:consumerId/offsets', async (req, res) => {
    const clusterId = req.params.clusterId;
    const consumerId = req.params.consumerId;

    const kafkaApi = kafkaApiByClusterName[clusterId];
    if (!kafkaApi) {
      const candidates = Object.keys(kafkaApiByClusterName)
        .map(n => `"${n}"`)
        .join(', ');
      throw new NotFoundError(
        `Found no configured cluster "${clusterId}", candidates are ${candidates}`,
      );
    }

    logger.info(
      `Fetch consumer group ${consumerId} offsets from cluster ${clusterId}`,
    );

    const groupOffsets = await kafkaApi.api.fetchGroupOffsets(consumerId);

    const groupWithTopicOffsets = await Promise.all(
      groupOffsets.map(async ({ topic, partitions }) => {
        const topicOffsets = _.keyBy(
          await kafkaApi.api.fetchTopicOffsets(topic),
          partition => partition.id,
        );

        return partitions.map(partition => ({
          topic: topic,
          partitionId: partition.id,
          groupOffset: partition.offset,
          topicOffset: topicOffsets[partition.id].offset,
        }));
      }),
    );

    res.json({ consumerId, offsets: groupWithTopicOffsets.flat() });
  });

  return router;
};

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const logger = options.logger;

  logger.info('Initializing Kafka backend');

  const clientId = options.config.getString('kafka.clientId');

  const clusters = getClusterDetails(
    options.config.getConfigArray('kafka.clusters'),
  );

  const kafkaApis = clusters.map(cluster => ({
    name: cluster.name,
    api: new KafkaJsApiImpl({ clientId, logger, ...cluster }),
  }));

  return makeRouter(logger, kafkaApis);
}
