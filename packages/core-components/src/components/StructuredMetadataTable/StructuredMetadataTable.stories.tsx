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
import React, { PropsWithChildren } from 'react';
import { InfoCard } from '../../layout/InfoCard';
import { Grid } from '@material-ui/core';
import { StructuredMetadataTable } from './StructuredMetadataTable';

const cardContentStyle = { heightX: 200, width: 500 };

const metadata = {
  description:
    'This is a long description of what this is doing (and some additional info too). \n It has new lines and extra text to make it especially annoying to render. But it just ignores them.',
  something: 'Yes',
  'true value': true,
  'false value': false,
  owner: 'squad',
  'longer key name': ['v1', 'v2', 'v3'],
  rules: {
    'permit missing partitions': 'No',
    'max partition finish time': '19 hours',
    Support: {
      'office hours': 'Contact goalie',
      'after hours': 'trigger PD alert',
    },
  },
};

export default {
  title: 'Data Display/Structured Metadata Table',
  component: StructuredMetadataTable,
};

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <Grid container spacing={4}>
    <Grid item>{children}</Grid>
  </Grid>
);

export const Default = () => (
  <Wrapper>
    <InfoCard title="Structured Metadata Table" subheader="Wrapped in InfoCard">
      <div style={cardContentStyle}>
        <StructuredMetadataTable metadata={metadata} />
      </div>
    </InfoCard>
  </Wrapper>
);

export const NotDenseTable = () => (
  <Wrapper>
    <InfoCard
      title="Not Dense Structured Metadata Table"
      subheader="Wrapped in InfoCard"
    >
      <div style={cardContentStyle}>
        <StructuredMetadataTable metadata={metadata} dense={false} />
      </div>
    </InfoCard>
  </Wrapper>
);
