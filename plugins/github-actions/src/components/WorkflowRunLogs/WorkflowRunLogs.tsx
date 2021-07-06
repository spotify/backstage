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
  Accordion,
  AccordionSummary,
  CircularProgress,
  Fade,
  LinearProgress,
  makeStyles,
  Modal,
  Theme,
  Tooltip,
  Typography,
  Zoom,
} from '@material-ui/core';

import React, { Suspense } from 'react';
import { useDownloadWorkflowRunLogs } from './useDownloadWorkflowRunLogs';
import { useProjectName } from '../useProjectName';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DescriptionIcon from '@material-ui/icons/Description';
import { Entity } from '@backstage/catalog-model';
import { readGitHubIntegrationConfigs } from '@backstage/integration';
import { configApiRef, useApi } from '@backstage/core-plugin-api';

const LazyLog = React.lazy(() => import('react-lazylog/build/LazyLog'));
const LinePart = React.lazy(() => import('react-lazylog/build/LinePart'));

const useStyles = makeStyles<Theme>(() => ({
  button: {
    order: -1,
    marginRight: 0,
    marginLeft: '-20px',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    width: '85%',
    height: '85%',
    justifyContent: 'center',
    margin: 'auto',
  },
  normalLog: {
    height: '75vh',
    width: '100%',
  },
  modalLog: {
    height: '100%',
    width: '100%',
  },
}));

const DisplayLog = ({
  jobLogs,
  className,
}: {
  jobLogs: any;
  className: string;
}) => {
  return (
    <Suspense fallback={<LinearProgress />}>
      <div className={className}>
        <LazyLog
          text={jobLogs ?? 'No Values Found'}
          extraLines={1}
          caseInsensitive
          enableSearch
          formatPart={line => {
            if (
              line.toLocaleLowerCase().includes('error') ||
              line.toLocaleLowerCase().includes('failed') ||
              line.toLocaleLowerCase().includes('failure')
            ) {
              return (
                <LinePart style={{ color: 'red' }} part={{ text: line }} />
              );
            }
            return line;
          }}
        />
      </div>
    </Suspense>
  );
};

/**
 * A component for Run Logs visualization.
 */
export const WorkflowRunLogs = ({
  entity,
  runId,
  inProgress,
}: {
  entity: Entity;
  runId: number;
  inProgress: boolean;
}) => {
  const config = useApi(configApiRef);
  const classes = useStyles();
  const projectName = useProjectName(entity);

  // TODO: Get github hostname from metadata annotation
  const hostname = readGitHubIntegrationConfigs(
    config.getOptionalConfigArray('integrations.github') ?? [],
  )[0].host;
  const [owner, repo] = projectName.value ? projectName.value.split('/') : [];
  const jobLogs = useDownloadWorkflowRunLogs({
    hostname,
    owner,
    repo,
    id: runId,
  });
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }} disabled={inProgress}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel-${name}-content`}
        id={`panel-${name}-header`}
        IconButtonProps={{
          className: classes.button,
        }}
      >
        <Typography variant="button">
          {jobLogs.loading ? <CircularProgress /> : 'Job Log'}
        </Typography>
        <Tooltip title="Open Log" TransitionComponent={Zoom} arrow>
          <DescriptionIcon
            onClick={event => {
              event.stopPropagation();
              handleOpen();
            }}
            style={{ marginLeft: 'auto' }}
          />
        </Tooltip>
        <Modal
          className={classes.modal}
          onClick={event => event.stopPropagation()}
          open={open}
          onClose={handleClose}
        >
          <Fade in={open}>
            <DisplayLog
              jobLogs={jobLogs.value || undefined}
              className={classes.modalLog}
            />
          </Fade>
        </Modal>
      </AccordionSummary>
      {jobLogs.value && (
        <DisplayLog
          jobLogs={jobLogs.value || undefined}
          className={classes.normalLog}
        />
      )}
    </Accordion>
  );
};
