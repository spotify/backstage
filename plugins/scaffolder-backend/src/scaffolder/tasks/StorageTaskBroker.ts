/*
 * Copyright 2021 Spotify AB
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
import { JsonObject } from '@backstage/config';
import { Logger } from 'winston';
import {
  CompletedTaskState,
  Task,
  TaskSecrets,
  TaskSpec,
  TaskStore,
  TaskBroker,
  DispatchResult,
  DbTaskEventRow,
  DbTaskRow,
} from './types';

export class TaskAgent implements Task {
  private isDone = false;

  private heartbeatTimeoutId?: ReturnType<typeof setInterval>;

  static create(state: TaskState, storage: TaskStore, logger: Logger) {
    const agent = new TaskAgent(state, storage, logger);
    agent.startTimeout();
    return agent;
  }

  // Runs heartbeat internally
  private constructor(
    private readonly state: TaskState,
    private readonly storage: TaskStore,
    private readonly logger: Logger,
  ) {}

  get spec() {
    return this.state.spec;
  }

  get secrets() {
    return this.state.secrets;
  }

  async getWorkspaceName() {
    return this.state.taskId;
  }

  get done() {
    return this.isDone;
  }

  async emitLog(message: string, metadata?: JsonObject): Promise<void> {
    await this.storage.emitLogEvent({
      taskId: this.state.taskId,
      body: { message, ...metadata },
    });
  }

  async complete(
    result: CompletedTaskState,
    metadata?: JsonObject,
  ): Promise<void> {
    await this.storage.completeTask({
      taskId: this.state.taskId,
      status: result === 'failed' ? 'failed' : 'completed',
      eventBody: {
        message: `Run completed with status: ${result}`,
        ...metadata,
      },
    });
    this.isDone = true;
    if (this.heartbeatTimeoutId) {
      clearTimeout(this.heartbeatTimeoutId);
    }
  }

  private startTimeout() {
    this.heartbeatTimeoutId = setTimeout(async () => {
      try {
        await this.storage.heartbeatTask(this.state.taskId);
        this.startTimeout();
      } catch (error) {
        this.isDone = true;

        this.logger.error(
          `Heartbeat for task ${this.state.taskId} failed`,
          error,
        );
      }
    }, 1000);
  }
}

interface TaskState {
  spec: TaskSpec;
  taskId: string;
  secrets?: TaskSecrets;
}

function defer() {
  let resolve = () => {};
  const promise = new Promise<void>(_resolve => {
    resolve = _resolve;
  });
  return { promise, resolve };
}

export class StorageTaskBroker implements TaskBroker {
  constructor(
    private readonly storage: TaskStore,
    private readonly logger: Logger,
  ) {}
  private deferredDispatch = defer();

  async claim(): Promise<Task> {
    for (;;) {
      const pendingTask = await this.storage.claimTask();
      if (pendingTask) {
        return TaskAgent.create(
          {
            taskId: pendingTask.id,
            spec: pendingTask.spec,
            secrets: pendingTask.secrets,
          },
          this.storage,
          this.logger,
        );
      }

      await this.waitForDispatch();
    }
  }

  async dispatch(
    spec: TaskSpec,
    secrets?: TaskSecrets,
  ): Promise<DispatchResult> {
    const taskRow = await this.storage.createTask(spec, secrets);
    this.signalDispatch();
    return {
      taskId: taskRow.taskId,
    };
  }

  async get(taskId: string): Promise<DbTaskRow> {
    return this.storage.getTask(taskId);
  }

  observe(
    options: {
      taskId: string;
      after: number | undefined;
    },
    callback: (
      error: Error | undefined,
      result: { events: DbTaskEventRow[] },
    ) => void,
  ): () => void {
    const { taskId } = options;

    let cancelled = false;
    const unsubscribe = () => {
      cancelled = true;
    };

    (async () => {
      let after = options.after;
      while (!cancelled) {
        const result = await this.storage.listEvents({ taskId, after: after });
        const { events } = result;
        if (events.length) {
          after = events[events.length - 1].id;
          try {
            callback(undefined, result);
          } catch (error) {
            callback(error, { events: [] });
          }
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    })();

    return unsubscribe;
  }

  async vacuumTasks(timeoutS: { timeoutS: number }): Promise<void> {
    const { tasks } = await this.storage.listStaleTasks(timeoutS);
    await Promise.all(
      tasks.map(async task => {
        try {
          await this.storage.completeTask({
            taskId: task.taskId,
            status: 'failed',
            eventBody: {
              message:
                'The task was cancelled because the task worker lost connection to the task broker',
            },
          });
        } catch (error) {
          this.logger.warn(`Failed to cancel task '${task.taskId}', ${error}`);
        }
      }),
    );
  }

  private waitForDispatch() {
    return this.deferredDispatch.promise;
  }

  private signalDispatch() {
    this.deferredDispatch.resolve();
    this.deferredDispatch = defer();
  }
}
