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

import { Box, Chip, Grid, Link, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { MemoryRouter } from 'react-router';
import { createApp } from '@backstage/core-app-api';
import {
  Content,
  ContentHeader,
  Header,
  HeaderLabel,
  HeaderTabs,
  InfoCard,
  Page,
} from '..';
import {
  GaugeCard,
  StatusOK,
  SupportButton,
  Table,
  TableColumn,
  TrendLine,
} from '../../components';

export default {
  title: 'Plugins/Examples',
  component: Page,
};

interface TableData {
  id: number;
  branch: string;
  hash: string;
  status: string;
}

const generateTestData = (rows = 10) => {
  const data: Array<TableData> = [];
  while (data.length <= rows) {
    data.push({
      id: data.length + 18534,
      branch: 'techdocs: modify documentation header',
      hash: 'techdocs/docs-header 5749c98e3f61f8bb116e5cb87b0e4e1 ',
      status: 'Success',
    });
  }
  return data;
};

const columns: TableColumn[] = [
  {
    title: 'ID',
    field: 'id',
    highlight: true,
    type: 'numeric',
    width: '80px',
  },
  {
    title: 'Message/Source',
    highlight: true,
    render: (row: Partial<TableData>) => (
      <>
        <Link>{row.branch}</Link>
        <Typography variant="body2">{row.hash}</Typography>
      </>
    ),
  },
  {
    title: 'Status',
    render: (row: Partial<TableData>) => (
      <Box display="flex" alignItems="center">
        <StatusOK />
        <Typography variant="body2">{row.status}</Typography>
      </Box>
    ),
  },
  {
    title: 'Tags',
    render: () => <Chip label="Tag Name" />,
    width: '10%',
  },
];

const tabs = [
  { label: 'Overview' },
  { label: 'CI/CD' },
  { label: 'Cost Efficiency' },
  { label: 'Code Coverage' },
  { label: 'Test' },
  { label: 'Compliance Advisor' },
];

const DataGrid = () => (
  <Grid container>
    <Grid item xs container>
      <Grid item xs={12}>
        <InfoCard title="Trend">
          <TrendLine data={[0.1, 0.5, 0.9, 1.0]} title="Trend over time" />
        </InfoCard>
      </Grid>
      <Grid
        item
        xs={12}
        container
        spacing={2}
        justify="space-between"
        direction="row"
      >
        <Grid item xs={12} md={6}>
          <GaugeCard
            title="GKE Usage Score"
            subheader="This should be above 75%"
            progress={0.87}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <GaugeCard
            title="Deployment Score"
            subheader="This should be above 40%"
            progress={0.58}
          />
        </Grid>
      </Grid>
    </Grid>
    <Grid item xs>
      <InfoCard
        title="Additional Information"
        deepLink={{ title: 'Learn more about GKE', link: '' }}
      >
        <Typography variant="h6">Rightsize GKE deployment</Typography>
        <Typography paragraph>
          Services are considered underutilized in GKE when the average usage of
          requested cores is less than 80%.
        </Typography>
        <Typography variant="h6">What can I do?</Typography>
        <Typography paragraph>
          Review requested core and limit settings. Check HPA target scaling
          settings in <code>hpa.yaml</code>. The recommended value for&nbsp;
          <code>targetCPUUtilizationPercentage</code> is <code>80</code>.
        </Typography>
        <Typography paragraph>
          For single pods, there is of course no HPA. But it can also be useful
          to think about a single pod out of a larger deployment, then modify
          based on HPA requirements. Within a pod, each container has its own
          CPU and memory requests and limits.
        </Typography>
        <Typography variant="h6">Definitions</Typography>
        <Typography paragraph>
          A request is a minimum reserved value; a container will never have
          less than this amount allocated to it, even if it doesn't actually use
          it. Requests are used for determining what nodes to schedule pods on
          (bin-packing). The tension here is between not allocating resources we
          don't need, and having easy-enough access to enough resources to be
          able to function.
        </Typography>
        <Typography paragraph>
          Contact <Link>#cost-awareness</Link> for information and support.
        </Typography>
      </InfoCard>
    </Grid>
  </Grid>
);

const ExampleHeader = () => (
  <Header title="Example" subtitle="This is an example plugin">
    <HeaderLabel label="Owner" value="Owner" />
    <HeaderLabel label="Lifecycle" value="Lifecycle" />
  </Header>
);

const ExampleContentHeader = ({ selectedTab }: { selectedTab?: number }) => (
  <ContentHeader
    title={selectedTab !== undefined ? tabs[selectedTab].label : 'Header'}
  >
    <SupportButton>
      This Plugin is an example. This text could provide useful information for
      the user.
    </SupportButton>
  </ContentHeader>
);

const app = createApp({ configLoader: async () => [] });
const AppProvider = app.getProvider();

export const PluginWithData = () => {
  const [selectedTab, setSelectedTab] = useState<number>(2);
  return (
    <AppProvider>
      <MemoryRouter>
        <div style={{ border: '1px solid #ddd' }}>
          <Page themeId="tool">
            <ExampleHeader />
            <HeaderTabs
              selectedIndex={selectedTab}
              onChange={index => setSelectedTab(index)}
              tabs={tabs.map(({ label }, index) => ({
                id: index.toString(),
                label,
              }))}
            />
            <Content>
              <ExampleContentHeader selectedTab={selectedTab} />
              <DataGrid />
            </Content>
          </Page>
        </div>
      </MemoryRouter>
    </AppProvider>
  );
};

export const PluginWithTable = () => {
  return (
    <AppProvider>
      <div style={{ border: '1px solid #ddd' }}>
        <Page themeId="tool">
          <ExampleHeader />
          <Content>
            <ExampleContentHeader />
            <Table
              options={{ paging: true, padding: 'dense' }}
              data={generateTestData(10)}
              columns={columns}
              title="Example Content"
            />
          </Content>
        </Page>
      </div>
    </AppProvider>
  );
};
