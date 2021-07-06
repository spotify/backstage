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
import { readGitHubIntegrationConfigs } from '@backstage/integration';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  LinearProgress,
  Link as MaterialLink,
  ListItemText,
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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExternalLinkIcon from '@material-ui/icons/Launch';
import { DateTime } from 'luxon';
import React from 'react';
import { Job, Jobs, Step } from '../../api';
import { useProjectName } from '../useProjectName';
import { WorkflowRunStatus } from '../WorkflowRunStatus';
import { useWorkflowRunJobs } from './useWorkflowRunJobs';
import { useWorkflowRunsDetails } from './useWorkflowRunsDetails';
import { WorkflowRunLogs } from '../WorkflowRunLogs';

import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { Breadcrumbs, Link } from '@backstage/core-components';

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

const getElapsedTime = (start: string, end: string) => {
  const startDate = DateTime.fromISO(start);
  const endDate = end ? DateTime.fromISO(end) : DateTime.now();
  const diff = endDate.diff(startDate);
  const timeElapsed = diff.toFormat(`m 'minutes' s 'seconds'`);
  return timeElapsed;
};

const StepView = ({ step }: { step: Step }) => {
  return (
    <TableRow>
      <TableCell>
        <ListItemText
          primary={step.name}
          secondary={getElapsedTime(step.started_at, step.completed_at)}
        />
      </TableCell>
      <TableCell>
        <WorkflowRunStatus
          status={step.status.toLocaleUpperCase('en-US')}
          conclusion={step.conclusion?.toLocaleUpperCase('en-US')}
        />
      </TableCell>
    </TableRow>
  );
};

const JobListItem = ({
  job,
  className,
  entity,
}: {
  job: Job;
  className: string;
  entity: Entity;
}) => {
  const classes = useStyles();
  return (
    <Accordion TransitionProps={{ unmountOnExit: true }} className={className}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel-${name}-content`}
        id={`panel-${name}-header`}
        IconButtonProps={{
          className: classes.button,
        }}
      >
        <Typography variant="button">
          {job.name} ({getElapsedTime(job.started_at, job.completed_at)})
        </Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.accordionDetails}>
        <TableContainer>
          <Table>
            {job.steps.map(step => (
              <StepView key={step.number} step={step} />
            ))}
          </Table>
        </TableContainer>
      </AccordionDetails>
      {job.status === 'queued' || job.status === 'in_progress' ? (
        <WorkflowRunLogs runId={job.id} inProgress entity={entity} />
      ) : (
        <WorkflowRunLogs runId={job.id} inProgress={false} entity={entity} />
      )}
    </Accordion>
  );
};

const JobsList = ({ jobs, entity }: { jobs?: Jobs; entity: Entity }) => {
  const classes = useStyles();
  return (
    <Box>
      {jobs &&
        jobs.total_count > 0 &&
        jobs.jobs.map(job => (
          <JobListItem
            key={job.id}
            job={job}
            className={
              job.status !== 'success' ? classes.failed : classes.success
            }
            entity={entity}
          />
        ))}
    </Box>
  );
};

export const WorkflowRunDetails = ({ entity }: { entity: Entity }) => {
  const config = useApi(configApiRef);
  const projectName = useProjectName(entity);

  // TODO: Get github hostname from metadata annotation
  const hostname = readGitHubIntegrationConfigs(
    config.getOptionalConfigArray('integrations.github') ?? [],
  )[0].host;
  const [owner, repo] = projectName.value ? projectName.value.split('/') : [];
  const details = useWorkflowRunsDetails({ hostname, owner, repo });
  const jobs = useWorkflowRunJobs({ hostname, owner, repo });

  const error = projectName.error || (projectName.value && details.error);
  const classes = useStyles();
  if (error) {
    return (
      <Typography variant="h6" color="error">
        Failed to load build, {error.message}
      </Typography>
    );
  } else if (projectName.loading || details.loading) {
    return <LinearProgress />;
  }
  return (
    <div className={classes.root}>
      <Box mb={3}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="..">Workflow runs</Link>
          <Typography>Workflow run details</Typography>
        </Breadcrumbs>
      </Box>
      <TableContainer component={Paper} className={classes.table}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography noWrap>Branch</Typography>
              </TableCell>
              <TableCell>{details.value?.head_branch}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Message</Typography>
              </TableCell>
              <TableCell>{details.value?.head_commit?.message}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Commit ID</Typography>
              </TableCell>
              <TableCell>{details.value?.head_commit?.id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Workflow</Typography>
              </TableCell>
              <TableCell>{details.value?.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Status</Typography>
              </TableCell>
              <TableCell>
                <WorkflowRunStatus
                  status={details.value?.status || undefined}
                  conclusion={details.value?.conclusion || undefined}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Author</Typography>
              </TableCell>
              <TableCell>{`${details.value?.head_commit?.author?.name} (${details.value?.head_commit?.author?.email})`}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Links</Typography>
              </TableCell>
              <TableCell>
                {details.value?.html_url && (
                  <MaterialLink target="_blank" href={details.value.html_url}>
                    Workflow runs on GitHub{' '}
                    <ExternalLinkIcon className={classes.externalLinkIcon} />
                  </MaterialLink>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>
                <Typography noWrap>Jobs</Typography>
                {jobs.loading ? (
                  <CircularProgress />
                ) : (
                  <JobsList jobs={jobs.value} entity={entity} />
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
