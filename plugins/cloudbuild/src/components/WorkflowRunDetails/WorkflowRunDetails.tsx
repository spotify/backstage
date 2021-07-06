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
import {
  Box,
  LinearProgress,
  Link as MaterialLink,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Theme,
  Typography,
} from '@material-ui/core';
import ExternalLinkIcon from '@material-ui/icons/Launch';
import qs from 'qs';
import React from 'react';
import { useProjectName } from '../useProjectName';
import { WorkflowRunStatus } from '../WorkflowRunStatus';
import { useWorkflowRunsDetails } from './useWorkflowRunsDetails';
import { Breadcrumbs, Link, WarningPanel } from '@backstage/core-components';

const useStyles = makeStyles<Theme>(theme => ({
  root: {
    maxWidth: 720,
    margin: theme.spacing(2),
  },
  title: {
    padding: theme.spacing(1, 0, 2, 0),
  },
  table: {
    padding: theme.spacing(1),
  },
  accordionDetails: {
    padding: 0,
  },
  button: {
    order: -1,
    marginRight: 0,
    marginLeft: '-20px',
  },
  externalLinkIcon: {
    fontSize: 'inherit',
    verticalAlign: 'bottom',
  },
}));

export const WorkflowRunDetails = ({ entity }: { entity: Entity }) => {
  const { value: projectName, loading, error } = useProjectName(entity);
  const [projectId] = (projectName ?? '/').split('/');

  const details = useWorkflowRunsDetails(projectId);

  const classes = useStyles();
  if (error) {
    return (
      <WarningPanel title="Error:">
        Failed to load build, {error.message}.
      </WarningPanel>
    );
  } else if (loading) {
    return <LinearProgress />;
  } else if (details.value?.logUrl === undefined) {
    return <LinearProgress />;
  }

  const serviceAccount = qs.parse(new URL(details.value?.logUrl).search, {
    ignoreQueryPrefix: true,
  }).project;

  return (
    <div className={classes.root}>
      <Box mb={3}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="..">Build history</Link>
          <Typography>Build details</Typography>
        </Breadcrumbs>
      </Box>
      <TableContainer component={Paper} className={classes.table}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography noWrap>Branch</Typography>
              </TableCell>
              <TableCell>{details.value?.substitutions.BRANCH_NAME}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Message</Typography>
              </TableCell>
              <TableCell>{details.value?.substitutions.REPO_NAME}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Commit ID</Typography>
              </TableCell>
              <TableCell>{details.value?.substitutions.COMMIT_SHA}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Status</Typography>
              </TableCell>
              <TableCell>
                <WorkflowRunStatus status={details.value?.status} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Service Account</Typography>
              </TableCell>
              <TableCell>
                {`${serviceAccount}`}@cloudbuild.gserviceaccount.com
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Links</Typography>
              </TableCell>
              <TableCell>
                {details.value?.logUrl && (
                  <MaterialLink target="_blank" href={details.value.logUrl}>
                    Workflow runs on Google{' '}
                    <ExternalLinkIcon className={classes.externalLinkIcon} />
                  </MaterialLink>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
