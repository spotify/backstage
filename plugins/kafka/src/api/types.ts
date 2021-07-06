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

import { createApiRef } from '@backstage/core-plugin-api';

export const kafkaApiRef = createApiRef<KafkaApi>({
  id: 'plugin.kafka.service',
  description:
    'Used by the Kafka plugin to make requests to accompanying backend',
});

export type ConsumerGroupOffsetsResponse = {
  consumerId: string;
  offsets: {
    topic: string;
    partitionId: number;
    topicOffset: string;
    groupOffset: string;
  }[];
};

export interface KafkaApi {
  getConsumerGroupOffsets(
    clusterId: string,
    consumerGroup: string,
  ): Promise<ConsumerGroupOffsetsResponse>;
}
