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

import { Box, Grid, Typography } from '@material-ui/core';
import RetryIcon from '@material-ui/icons/Replay';
import React from 'react';
import { useConsumerGroupsOffsetsForEntity } from './useConsumerGroupsOffsetsForEntity';
import { Table, TableColumn } from '@backstage/core-components';

export type TopicPartitionInfo = {
  topic: string;
  partitionId: number;
  topicOffset: string;
  groupOffset: string;
};

const generatedColumns: TableColumn[] = [
  {
    title: 'Topic',
    field: 'topic',
    highlight: true,
    render: (row: Partial<TopicPartitionInfo>) => {
      return <>{row.topic ?? ''}</>;
    },
  },
  {
    title: 'Partition',
    field: 'partitionId',
    render: (row: Partial<TopicPartitionInfo>) => {
      return <>{row.partitionId ?? ''}</>;
    },
  },
  {
    title: 'Topic Offset',
    field: 'topicOffset',
    render: (row: Partial<TopicPartitionInfo>) => {
      return <>{row.topicOffset ?? ''}</>;
    },
  },
  {
    title: 'Group Offset',
    field: 'groupOffset',
    render: (row: Partial<TopicPartitionInfo>) => {
      return <>{row.groupOffset ?? ''}</>;
    },
  },
  {
    title: 'Lag',
    field: 'lag',
    render: (row: Partial<TopicPartitionInfo>) => {
      let lag = undefined;
      if (row.topicOffset && row.groupOffset) {
        lag = +row.topicOffset - +row.groupOffset;
      }
      return <>{lag ?? ''}</>;
    },
  },
];

type Props = {
  loading: boolean;
  retry: () => void;
  clusterId: string;
  consumerGroup: string;
  topics?: TopicPartitionInfo[];
};

export const ConsumerGroupOffsets = ({
  loading,
  topics,
  clusterId,
  consumerGroup,
  retry,
}: Props) => {
  return (
    <Table
      isLoading={loading}
      actions={[
        {
          icon: () => <RetryIcon />,
          tooltip: 'Refresh Data',
          isFreeAction: true,
          onClick: () => retry(),
        },
      ]}
      data={topics ?? []}
      title={
        <Box display="flex" alignItems="center">
          <Typography variant="h6">
            Consumed Topics for {consumerGroup} ({clusterId})
          </Typography>
        </Box>
      }
      columns={generatedColumns}
    />
  );
};

export const KafkaTopicsForConsumer = () => {
  const [tableProps, { retry }] = useConsumerGroupsOffsetsForEntity();
  return (
    <Grid>
      {tableProps.consumerGroupsTopics?.map(consumerGroup => (
        <ConsumerGroupOffsets
          {...consumerGroup}
          loading={tableProps.loading}
          retry={retry}
        />
      ))}
    </Grid>
  );
};
