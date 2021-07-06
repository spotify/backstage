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

import { useAsyncRetry } from 'react-use';
import { kafkaApiRef } from '../../api/types';
import { useConsumerGroupsForEntity } from './useConsumerGroupsForEntity';
import { errorApiRef, useApi } from '@backstage/core-plugin-api';

export const useConsumerGroupsOffsetsForEntity = () => {
  const consumers = useConsumerGroupsForEntity();
  const api = useApi(kafkaApiRef);
  const errorApi = useApi(errorApiRef);

  const {
    loading,
    value: consumerGroupsTopics,
    retry,
  } = useAsyncRetry(async () => {
    try {
      return await Promise.all(
        consumers.map(async ({ clusterId, consumerGroup }) => {
          const response = await api.getConsumerGroupOffsets(
            clusterId,
            consumerGroup,
          );
          return { clusterId, consumerGroup, topics: response.offsets };
        }),
      );
    } catch (e) {
      errorApi.post(e);
      throw e;
    }
  }, [consumers, api, errorApi]);

  return [
    {
      loading,
      consumerGroupsTopics,
    },
    {
      retry,
    },
  ] as const;
};
