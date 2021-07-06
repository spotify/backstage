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
import {
  Box,
  Link as MaterialLink,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExternalLinkIcon from '@material-ui/icons/Launch';
import React from 'react';
import { buildRouteRef } from '../../plugin';
import { JenkinsRunStatus } from '../BuildsPage/lib/Status';
import { useBuildWithSteps } from '../useBuildWithSteps';
import { useProjectSlugFromEntity } from '../useProjectSlugFromEntity';

import { Breadcrumbs, Content, Link } from '@backstage/core-components';
import { useRouteRefParams } from '@backstage/core-plugin-api';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 720,
  },
  table: {
    padding: theme.spacing(1),
  },
  externalLinkIcon: {
    fontSize: 'inherit',
    verticalAlign: 'bottom',
  },
}));

const BuildWithStepsView = () => {
  const projectName = useProjectSlugFromEntity();
  const { branch, buildNumber } = useRouteRefParams(buildRouteRef);
  const classes = useStyles();
  const buildPath = `${projectName}/${encodeURIComponent(
    branch,
  )}/${buildNumber}`;
  const [{ value }] = useBuildWithSteps(buildPath);

  return (
    <div className={classes.root}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link to="../../..">Projects</Link>
        <Typography>Run</Typography>
      </Breadcrumbs>
      <Box m={2} />
      <TableContainer component={Paper} className={classes.table}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography noWrap>Branch</Typography>
              </TableCell>
              <TableCell>{value?.source?.branchName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Message</Typography>
              </TableCell>
              <TableCell>{value?.source?.displayName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Commit ID</Typography>
              </TableCell>
              <TableCell>{value?.source?.commit?.hash}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Status</Typography>
              </TableCell>
              <TableCell>
                <JenkinsRunStatus status={value?.status} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Author</Typography>
              </TableCell>
              <TableCell>{value?.source?.author}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Jenkins</Typography>
              </TableCell>
              <TableCell>
                <MaterialLink target="_blank" href={value?.buildUrl}>
                  View on Jenkins{' '}
                  <ExternalLinkIcon className={classes.externalLinkIcon} />
                </MaterialLink>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>GitHub</Typography>
              </TableCell>
              <TableCell>
                <MaterialLink target="_blank" href={value?.source.url}>
                  View on GitHub{' '}
                  <ExternalLinkIcon className={classes.externalLinkIcon} />
                </MaterialLink>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
const Page = () => (
  <Content>
    <BuildWithStepsView />
  </Content>
);

export default Page;
export { BuildWithStepsView as BuildWithSteps };
