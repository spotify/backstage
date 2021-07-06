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
import React, { PropsWithChildren } from 'react';
import { useConsumerGroupsForEntity } from './useConsumerGroupsForEntity';

describe('useConsumerGroupOffsets', () => {
  let entity: Entity;

  const wrapper = ({ children }: PropsWithChildren<{}>) => {
    return (
      <EntityContext.Provider value={{ entity: entity, loading: false }}>
        {children}
      </EntityContext.Provider>
    );
  };

  const subject = () => renderHook(useConsumerGroupsForEntity, { wrapper });

  it('returns correct cluster and consumer group for annotation', async () => {
    entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'test',
        annotations: {
          'kafka.apache.org/consumer-groups': 'prod/consumer',
        },
      },
      spec: {
        owner: 'guest',
        type: 'Website',
        lifecycle: 'development',
      },
    };
    const { result } = subject();
    expect(result.current).toStrictEqual([
      {
        clusterId: 'prod',
        consumerGroup: 'consumer',
      },
    ]);
  });

  it('returns correct cluster and consumer group for multiple consumers', async () => {
    entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'test',
        annotations: {
          'kafka.apache.org/consumer-groups':
            'prod/consumer,dev/another-consumer',
        },
      },
      spec: {
        owner: 'guest',
        type: 'Website',
        lifecycle: 'development',
      },
    };
    const { result } = subject();
    expect(result.current).toStrictEqual([
      { clusterId: 'prod', consumerGroup: 'consumer' },
      {
        clusterId: 'dev',
        consumerGroup: 'another-consumer',
      },
    ]);
  });

  it('returns correct cluster and consumer group for annotation with extra spaces', async () => {
    entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'test',
        annotations: {
          'kafka.apache.org/consumer-groups':
            '   prod/consumer   ,   dev/another-consumer   ',
        },
      },
      spec: {
        owner: 'guest',
        type: 'Website',
        lifecycle: 'development',
      },
    };
    const { result } = subject();
    expect(result.current).toStrictEqual([
      { clusterId: 'prod', consumerGroup: 'consumer' },
      {
        clusterId: 'dev',
        consumerGroup: 'another-consumer',
      },
    ]);
  });

  it('fails on missing cluster', async () => {
    entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'test',
        annotations: {
          'kafka.apache.org/consumer-groups': 'dev/another,consumer',
        },
      },
      spec: {
        owner: 'guest',
        type: 'Website',
        lifecycle: 'development',
      },
    };
    const { result } = subject();
    expect(() => result.current).toThrowError();
    expect(result.error).toStrictEqual(
      new Error(
        `Failed to parse kafka consumer group annotation: got "dev/another,consumer"`,
      ),
    );
  });
});
