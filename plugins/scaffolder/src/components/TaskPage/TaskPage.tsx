/*
 * Copyright 2021 The Backstage Authors
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

import React, { useState, useEffect, memo, useMemo } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useParams } from 'react-router';
import { useTaskEventStream } from '../hooks/useEventStream';
import LazyLog from 'react-lazylog/build/LazyLog';
import {
  CircularProgress,
  Paper,
  StepButton,
  StepIconProps,
} from '@material-ui/core';
import { Status, TaskOutput } from '../../types';
import { DateTime, Interval } from 'luxon';
import { useInterval } from 'react-use';
import Check from '@material-ui/icons/Check';
import Cancel from '@material-ui/icons/Cancel';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import classNames from 'classnames';
import { BackstageTheme } from '@backstage/theme';
import { TaskPageLinks } from './TaskPageLinks';
import {
  Page,
  Header,
  Lifecycle,
  Content,
  ErrorPage,
} from '@backstage/core-components';

// typings are wrong for this library, so fallback to not parsing types.
const humanizeDuration = require('humanize-duration');

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    actionsContainer: {
      marginBottom: theme.spacing(2),
    },
    resetContainer: {
      padding: theme.spacing(3),
    },
    labelWrapper: {
      display: 'flex',
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    stepWrapper: {
      width: '100%',
    },
  }),
);

type TaskStep = {
  id: string;
  name: string;
  status: Status;
  startedAt?: string;
  endedAt?: string;
};

const StepTimeTicker = ({ step }: { step: TaskStep }) => {
  const [time, setTime] = useState('');

  useInterval(() => {
    if (!step.startedAt) {
      setTime('');
      return;
    }

    const end = step.endedAt
      ? DateTime.fromISO(step.endedAt)
      : DateTime.local();

    const startedAt = DateTime.fromISO(step.startedAt);
    const formatted = Interval.fromDateTimes(startedAt, end)
      .toDuration()
      .valueOf();

    setTime(humanizeDuration(formatted, { round: true }));
  }, 1000);

  return <Typography variant="caption">{time}</Typography>;
};

const useStepIconStyles = makeStyles((theme: BackstageTheme) =>
  createStyles({
    root: {
      color: theme.palette.text.disabled,
      display: 'flex',
      height: 22,
      alignItems: 'center',
    },
    completed: {
      color: theme.palette.status.ok,
    },
    error: {
      color: theme.palette.status.error,
    },
  }),
);

function TaskStepIconComponent(props: StepIconProps) {
  const classes = useStepIconStyles();
  const { active, completed, error } = props;

  const getMiddle = () => {
    if (active) {
      return <CircularProgress size="24px" />;
    }
    if (completed) {
      return <Check />;
    }
    if (error) {
      return <Cancel />;
    }
    return <FiberManualRecordIcon />;
  };

  return (
    <div
      className={classNames(classes.root, {
        [classes.completed]: completed,
        [classes.error]: error,
      })}
    >
      {getMiddle()}
    </div>
  );
}

export const TaskStatusStepper = memo(
  ({
    steps,
    currentStepId,
    onUserStepChange,
  }: {
    steps: TaskStep[];
    currentStepId: string | undefined;
    onUserStepChange: (id: string) => void;
  }) => {
    const classes = useStyles();

    return (
      <div className={classes.root}>
        <Stepper
          activeStep={steps.findIndex(s => s.id === currentStepId)}
          orientation="vertical"
          nonLinear
        >
          {steps.map((step, index) => {
            const isCompleted = step.status === 'completed';
            const isFailed = step.status === 'failed';
            const isActive = step.status === 'processing';
            const isSkipped = step.status === 'skipped';

            return (
              <Step key={String(index)} expanded>
                <StepButton onClick={() => onUserStepChange(step.id)}>
                  <StepLabel
                    StepIconProps={{
                      completed: isCompleted,
                      error: isFailed,
                      active: isActive,
                    }}
                    StepIconComponent={TaskStepIconComponent}
                    className={classes.stepWrapper}
                  >
                    <div className={classes.labelWrapper}>
                      <Typography variant="subtitle2">{step.name}</Typography>
                      {isSkipped ? (
                        <Typography variant="caption">Skipped</Typography>
                      ) : (
                        <StepTimeTicker step={step} />
                      )}
                    </div>
                  </StepLabel>
                </StepButton>
              </Step>
            );
          })}
        </Stepper>
      </div>
    );
  },
);

const TaskLogger = memo(({ log }: { log: string }) => {
  return (
    <div style={{ height: '80vh' }}>
      <LazyLog text={log} extraLines={1} follow selectableLines enableSearch />
    </div>
  );
});

const hasLinks = ({ entityRef, remoteUrl, links = [] }: TaskOutput): boolean =>
  !!(entityRef || remoteUrl || links.length > 0);

export const TaskPage = () => {
  const [userSelectedStepId, setUserSelectedStepId] = useState<
    string | undefined
  >(undefined);
  const [lastActiveStepId, setLastActiveStepId] = useState<string | undefined>(
    undefined,
  );
  const { taskId } = useParams();
  const taskStream = useTaskEventStream(taskId);
  const completed = taskStream.completed;
  const steps = useMemo(
    () =>
      taskStream.task?.spec.steps.map(step => ({
        ...step,
        ...taskStream?.steps?.[step.id],
      })) ?? [],
    [taskStream],
  );

  useEffect(() => {
    const mostRecentFailedOrActiveStep = steps.find(step =>
      ['failed', 'processing'].includes(step.status),
    );
    if (completed && !mostRecentFailedOrActiveStep) {
      setLastActiveStepId(steps[steps.length - 1]?.id);
      return;
    }

    setLastActiveStepId(mostRecentFailedOrActiveStep?.id);
  }, [steps, completed]);

  const currentStepId = userSelectedStepId ?? lastActiveStepId;

  const logAsString = useMemo(() => {
    if (!currentStepId) {
      return 'Loading...';
    }
    const log = taskStream.stepLogs[currentStepId];

    if (!log?.length) {
      return 'Waiting for logs...';
    }
    return log.join('\n');
  }, [taskStream.stepLogs, currentStepId]);

  const taskNotFound =
    taskStream.completed === true &&
    taskStream.loading === false &&
    !taskStream.task;

  const { output } = taskStream;

  return (
    <Page themeId="home">
      <Header
        pageTitleOverride={`Task ${taskId}`}
        title={
          <>
            Task Activity <Lifecycle alpha shorthand />
          </>
        }
        subtitle={`Activity for task: ${taskId}`}
      />
      <Content>
        {taskNotFound ? (
          <ErrorPage
            status="404"
            statusMessage="Task not found"
            additionalInfo="No task found with this ID"
          />
        ) : (
          <div>
            <Grid container>
              <Grid item xs={3}>
                <Paper>
                  <TaskStatusStepper
                    steps={steps}
                    currentStepId={currentStepId}
                    onUserStepChange={setUserSelectedStepId}
                  />
                  {output && hasLinks(output) && (
                    <TaskPageLinks output={output} />
                  )}
                </Paper>
              </Grid>
              <Grid item xs={9}>
                <TaskLogger log={logAsString} />
              </Grid>
            </Grid>
          </div>
        )}
      </Content>
    </Page>
  );
};
