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

import { useEntity } from '@backstage/plugin-catalog-react';
import { useMemo } from 'react';
import { KAFKA_CONSUMER_GROUP_ANNOTATION } from '../../constants';

export const useConsumerGroupsForEntity = () => {
  const { entity } = useEntity();
  const annotation =
    entity.metadata.annotations?.[KAFKA_CONSUMER_GROUP_ANNOTATION] ?? '';

  const consumerList = useMemo(() => {
    return annotation.split(',').map(consumer => {
      const [clusterId, consumerGroup] = consumer.split('/');

      if (!clusterId || !consumerGroup) {
        throw new Error(
          `Failed to parse kafka consumer group annotation: got "${annotation}"`,
        );
      }
      return {
        clusterId: clusterId.trim(),
        consumerGroup: consumerGroup.trim(),
      };
    });
  }, [annotation]);

  return consumerList;
};
