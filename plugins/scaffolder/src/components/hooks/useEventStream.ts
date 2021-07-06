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
import { useImmerReducer } from 'use-immer';
import { useEffect } from 'react';
import { scaffolderApiRef, LogEvent } from '../../api';
import { ScaffolderTask, Status, TaskOutput } from '../../types';
import { Subscription, useApi } from '@backstage/core-plugin-api';

type Step = {
  id: string;
  status: Status;
  endedAt?: string;
  startedAt?: string;
};

export type TaskStream = {
  loading: boolean;
  error?: Error;
  stepLogs: { [stepId in string]: string[] };
  completed: boolean;
  task?: ScaffolderTask;
  steps: { [stepId in string]: Step };
  output?: TaskOutput;
};

type ReducerLogEntry = {
  createdAt: string;
  body: {
    stepId?: string;
    status?: Status;
    message: string;
    output?: TaskOutput;
  };
};

type ReducerAction =
  | { type: 'INIT'; data: ScaffolderTask }
  | { type: 'LOGS'; data: ReducerLogEntry[] }
  | { type: 'COMPLETED'; data: ReducerLogEntry }
  | { type: 'ERROR'; data: Error };

function reducer(draft: TaskStream, action: ReducerAction) {
  switch (action.type) {
    case 'INIT': {
      draft.steps = action.data.spec.steps.reduce((current, next) => {
        current[next.id] = { status: 'open', id: next.id };
        return current;
      }, {} as { [stepId in string]: Step });
      draft.stepLogs = action.data.spec.steps.reduce((current, next) => {
        current[next.id] = [];
        return current;
      }, {} as { [stepId in string]: string[] });
      draft.loading = false;
      draft.error = undefined;
      draft.completed = false;
      draft.task = action.data;
      return;
    }

    case 'LOGS': {
      const entries = action.data;
      const logLines = [];

      for (const entry of entries) {
        const logLine = `${entry.createdAt} ${entry.body.message}`;
        logLines.push(logLine);

        if (!entry.body.stepId || !draft.steps?.[entry.body.stepId]) {
          continue;
        }

        const currentStepLog = draft.stepLogs?.[entry.body.stepId];
        const currentStep = draft.steps?.[entry.body.stepId];

        if (entry.body.status && entry.body.status !== currentStep.status) {
          currentStep.status = entry.body.status;

          if (currentStep.status === 'processing') {
            currentStep.startedAt = entry.createdAt;
          }

          if (
            ['cancelled', 'failed', 'completed'].includes(currentStep.status)
          ) {
            currentStep.endedAt = entry.createdAt;
          }
        }

        currentStepLog?.push(logLine);
      }

      return;
    }

    case 'COMPLETED': {
      draft.completed = true;
      draft.output = action.data.body.output;
      return;
    }

    case 'ERROR': {
      draft.error = action.data;
      draft.loading = false;
      draft.completed = true;
      return;
    }

    default:
      return;
  }
}

export const useTaskEventStream = (taskId: string): TaskStream => {
  const scaffolderApi = useApi(scaffolderApiRef);
  const [state, dispatch] = useImmerReducer(reducer, {
    loading: true,
    completed: false,
    stepLogs: {} as { [stepId in string]: string[] },
    steps: {} as { [stepId in string]: Step },
  });

  useEffect(() => {
    let didCancel = false;
    let subscription: Subscription | undefined;
    let logPusher: NodeJS.Timeout | undefined;

    scaffolderApi.getTask(taskId).then(
      task => {
        if (didCancel) {
          return;
        }
        dispatch({ type: 'INIT', data: task });

        // TODO(blam): Use a normal fetch to fetch the current log for the event stream
        // and use that for an INIT_EVENTs dispatch event, and then
        // use the last event ID to subscribe using after option to
        // stream logs. Without this, if you have a lot of logs, it can look like the
        // task is being rebuilt on load as it progresses through the steps at a slower
        // rate whilst it builds the status from the event logs
        const observable = scaffolderApi.streamLogs({ taskId });

        const collectedLogEvents = new Array<LogEvent>();

        function emitLogs() {
          if (collectedLogEvents.length) {
            const logs = collectedLogEvents.splice(
              0,
              collectedLogEvents.length,
            );
            dispatch({ type: 'LOGS', data: logs });
          }
        }

        logPusher = setInterval(emitLogs, 500);

        subscription = observable.subscribe({
          next: event => {
            switch (event.type) {
              case 'log':
                return collectedLogEvents.push(event);
              case 'completion':
                emitLogs();
                dispatch({ type: 'COMPLETED', data: event });
                return undefined;
              default:
                throw new Error(
                  `Unhandled event type ${event.type} in observer`,
                );
            }
          },
          error: error => {
            emitLogs();
            dispatch({ type: 'ERROR', data: error });
          },
        });
      },
      error => {
        if (!didCancel) {
          dispatch({ type: 'ERROR', data: error });
        }
      },
    );

    return () => {
      didCancel = true;
      if (subscription) {
        subscription.unsubscribe();
      }
      if (logPusher) {
        clearInterval(logPusher);
      }
    };
  }, [scaffolderApi, dispatch, taskId]);

  return state;
};
