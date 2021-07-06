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

import { JsonValue, JsonObject } from '@backstage/config';

export type Status =
  | 'open'
  | 'processing'
  | 'failed'
  | 'cancelled'
  | 'completed';

export type CompletedTaskState = 'failed' | 'completed';

export type DbTaskRow = {
  id: string;
  spec: TaskSpec;
  status: Status;
  createdAt: string;
  lastHeartbeatAt?: string;
  secrets?: TaskSecrets;
};

export type TaskEventType = 'completion' | 'log';
export type DbTaskEventRow = {
  id: number;
  taskId: string;
  body: JsonObject;
  type: TaskEventType;
  createdAt: string;
};

export type TaskSpec = {
  baseUrl?: string;
  values: JsonObject;
  steps: Array<{
    id: string;
    name: string;
    action: string;
    input?: JsonObject;
    if?: string | boolean;
  }>;
  output: { [name: string]: string };
};

export type TaskSecrets = {
  token: string | undefined;
};

export type DispatchResult = {
  taskId: string;
};

export interface Task {
  spec: TaskSpec;
  secrets?: TaskSecrets;
  done: boolean;
  emitLog(message: string, metadata?: JsonValue): Promise<void>;
  complete(result: CompletedTaskState, metadata?: JsonValue): Promise<void>;
  getWorkspaceName(): Promise<string>;
}

export interface TaskBroker {
  claim(): Promise<Task>;
  dispatch(spec: TaskSpec, secrets?: TaskSecrets): Promise<DispatchResult>;
  vacuumTasks(timeoutS: { timeoutS: number }): Promise<void>;
  observe(
    options: {
      taskId: string;
      after: number | undefined;
    },
    callback: (
      error: Error | undefined,
      result: { events: DbTaskEventRow[] },
    ) => void,
  ): () => void;
}

export type TaskStoreEmitOptions = {
  taskId: string;
  body: JsonObject;
};

export type TaskStoreGetEventsOptions = {
  taskId: string;
  after?: number | undefined;
};

export interface TaskStore {
  createTask(
    task: TaskSpec,
    secrets?: TaskSecrets,
  ): Promise<{ taskId: string }>;
  getTask(taskId: string): Promise<DbTaskRow>;
  claimTask(): Promise<DbTaskRow | undefined>;
  completeTask(options: {
    taskId: string;
    status: Status;
    eventBody: JsonObject;
  }): Promise<void>;
  heartbeatTask(taskId: string): Promise<void>;
  listStaleTasks(options: {
    timeoutS: number;
  }): Promise<{
    tasks: { taskId: string }[];
  }>;

  emitLogEvent({ taskId, body }: TaskStoreEmitOptions): Promise<void>;
  listEvents({
    taskId,
    after,
  }: TaskStoreGetEventsOptions): Promise<{ events: DbTaskEventRow[] }>;
}
