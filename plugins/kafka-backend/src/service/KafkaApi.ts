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

import { Kafka, SeekEntry } from 'kafkajs';
import { Logger } from 'winston';
import { SaslConfig, SslConfig } from '../types/types';

export type PartitionOffset = {
  id: number;
  offset: string;
};

export type TopicOffset = {
  topic: string;
  partitions: PartitionOffset[];
};

export type Options = {
  clientId: string;
  brokers: string[];
  ssl?: SslConfig;
  sasl?: SaslConfig;
  logger: Logger;
};

export interface KafkaApi {
  fetchTopicOffsets(topic: string): Promise<Array<PartitionOffset>>;
  fetchGroupOffsets(groupId: string): Promise<Array<TopicOffset>>;
}

export class KafkaJsApiImpl implements KafkaApi {
  private readonly kafka: Kafka;
  private readonly logger: Logger;

  constructor(options: Options) {
    options.logger.debug(
      `creating kafka client with clientId=${options.clientId} and brokers=${options.brokers}`,
    );

    this.kafka = new Kafka(options);
    this.logger = options.logger;
  }

  async fetchTopicOffsets(topic: string): Promise<Array<PartitionOffset>> {
    this.logger.debug(`fetching topic offsets for ${topic}`);

    const admin = this.kafka.admin();
    await admin.connect();

    try {
      return KafkaJsApiImpl.toPartitionOffsets(
        await admin.fetchTopicOffsets(topic),
      );
    } finally {
      await admin.disconnect();
    }
  }

  async fetchGroupOffsets(groupId: string): Promise<Array<TopicOffset>> {
    this.logger.debug(`fetching consumer group offsets for ${groupId}`);

    const admin = this.kafka.admin();
    await admin.connect();

    try {
      const groupOffsets = await admin.fetchOffsets({ groupId });

      return groupOffsets.map(topicOffset => ({
        topic: topicOffset.topic,
        partitions: KafkaJsApiImpl.toPartitionOffsets(topicOffset.partitions),
      }));
    } finally {
      await admin.disconnect();
    }
  }

  private static toPartitionOffsets(
    result: Array<SeekEntry>,
  ): Array<PartitionOffset> {
    return result.map(seekEntry => ({
      id: seekEntry.partition,
      offset: seekEntry.offset,
    }));
  }
}
