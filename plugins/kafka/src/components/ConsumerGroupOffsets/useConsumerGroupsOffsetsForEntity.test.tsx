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
import { Entity } from '@backstage/catalog-model';
import { EntityContext } from '@backstage/plugin-catalog-react';
import { renderHook } from '@testing-library/react-hooks';
import { when } from 'jest-when';
import React, { PropsWithChildren } from 'react';
import {
  ConsumerGroupOffsetsResponse,
  KafkaApi,
  kafkaApiRef,
} from '../../api/types';
import { useConsumerGroupsOffsetsForEntity } from './useConsumerGroupsOffsetsForEntity';
import * as data from './__fixtures__/consumer-group-offsets.json';

import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';
import { errorApiRef } from '@backstage/core-plugin-api';

const consumerGroupOffsets = data as ConsumerGroupOffsetsResponse;

const mockErrorApi: jest.Mocked<typeof errorApiRef.T> = {
  post: jest.fn(),
  error$: jest.fn(),
};

const mockKafkaApi: jest.Mocked<KafkaApi> = {
  getConsumerGroupOffsets: jest.fn(),
};

describe('useConsumerGroupOffsets', () => {
  const entity: Entity = {
    apiVersion: 'v1',
    kind: 'Component',
    metadata: {
      name: 'test',
      annotations: {
        'kafka.apache.org/consumer-groups': `prod/${consumerGroupOffsets.consumerId}`,
      },
    },
    spec: {
      owner: 'guest',
      type: 'Website',
      lifecycle: 'development',
    },
  };

  const wrapper = ({ children }: PropsWithChildren<{}>) => {
    return (
      <ApiProvider
        apis={ApiRegistry.with(errorApiRef, mockErrorApi).with(
          kafkaApiRef,
          mockKafkaApi,
        )}
      >
        <EntityContext.Provider value={{ entity: entity, loading: false }}>
          {children}
        </EntityContext.Provider>
      </ApiProvider>
    );
  };

  const subject = () =>
    renderHook(useConsumerGroupsOffsetsForEntity, { wrapper });

  it('returns correct consumer group for annotation', async () => {
    mockKafkaApi.getConsumerGroupOffsets.mockResolvedValue(
      consumerGroupOffsets,
    );
    when(mockKafkaApi.getConsumerGroupOffsets)
      .calledWith('prod', consumerGroupOffsets.consumerId)
      .mockResolvedValue(consumerGroupOffsets);

    const { result, waitForNextUpdate } = subject();
    await waitForNextUpdate();
    const [tableProps] = result.current;

    expect(tableProps.consumerGroupsTopics).toStrictEqual([
      {
        clusterId: 'prod',
        consumerGroup: consumerGroupOffsets.consumerId,
        topics: consumerGroupOffsets.offsets,
      },
    ]);
  });

  it('posts an error to the error api', async () => {
    const error = new Error('error!');
    mockKafkaApi.getConsumerGroupOffsets.mockRejectedValueOnce(error);

    const { waitForNextUpdate } = subject();
    await waitForNextUpdate();

    expect(mockErrorApi.post).toHaveBeenCalledWith(error);
  });
});
