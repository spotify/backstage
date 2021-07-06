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

//  NEEDS WORK
import {
  Button,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { useAsync } from 'react-use';
import { gcpApiRef, Project } from '../../api';

import {
  Content,
  ContentHeader,
  Header,
  HeaderLabel,
  Link,
  Page,
  SupportButton,
  WarningPanel,
} from '@backstage/core-components';

import { useApi } from '@backstage/core-plugin-api';

const LongText = ({ text, max }: { text: string; max: number }) => {
  if (text.length < max) {
    return <span>{text}</span>;
  }
  return (
    <Tooltip title={text}>
      <span>{text.slice(0, max)}...</span>
    </Tooltip>
  );
};

const labels = (
  <>
    <HeaderLabel label="Owner" value="Spotify" />
    <HeaderLabel label="Lifecycle" value="Production" />
  </>
);

const PageContents = () => {
  const api = useApi(gcpApiRef);

  const { loading, error, value } = useAsync(() => api.listProjects());

  if (loading) {
    return <LinearProgress />;
  } else if (error) {
    return (
      <WarningPanel title="Failed to load projects">
        {error.toString()}
      </WarningPanel>
    );
  }

  return (
    <Table component={Paper}>
      <Table aria-label="GCP Projects table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Project Number</TableCell>
            <TableCell>Project ID</TableCell>
            <TableCell>State</TableCell>
            <TableCell>Creation Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {value?.map((project: Project) => (
            <TableRow key={project.projectId}>
              <TableCell>
                <Typography>
                  <LongText text={project.name} max={30} />
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>
                  <LongText text={project?.projectNumber || 'Error'} max={30} />
                </Typography>
              </TableCell>
              <TableCell>
                <Link
                  to={`project?projectId=${encodeURIComponent(
                    project.projectId,
                  )}`}
                >
                  <Typography color="primary">
                    <LongText text={project.projectId} max={60} />
                  </Typography>
                </Link>
              </TableCell>
              <TableCell>
                <Typography>
                  <LongText
                    text={project?.lifecycleState || 'Error'}
                    max={30}
                  />
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>
                  <LongText text={project?.createTime || 'Error'} max={30} />
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Table>
  );
};

export const ProjectListPage = () => (
  <Page themeId="service">
    <Header title="GCP Projects" type="tool">
      {labels}
    </Header>
    <Content>
      <ContentHeader title="">
        <Button variant="contained" color="primary" href="/gcp-projects/new">
          New Project
        </Button>
        <SupportButton>All your software catalog entities</SupportButton>
      </ContentHeader>
      <PageContents />
    </Content>
  </Page>
);
