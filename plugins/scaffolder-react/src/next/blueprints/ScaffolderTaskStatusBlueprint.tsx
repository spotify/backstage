/*
 * Copyright 2026 The Backstage Authors
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
import { ComponentType, ReactNode } from 'react';
import { ScaffolderTask } from '@backstage/plugin-scaffolder-common';
import {
  createExtensionBlueprint,
  createExtensionDataRef,
} from '@backstage/frontend-plugin-api';

/**
 * Presentation of a task's status in the task list. `children` contains the
 * native status presentation and can be returned for tasks that are not handled.
 * This does not change the task's execution status or its permissions.
 *
 * @alpha
 */
export type ScaffolderTaskStatusComponent = ComponentType<{
  task: ScaffolderTask;
  children: ReactNode;
}>;

const componentRef =
  createExtensionDataRef<ScaffolderTaskStatusComponent>().with({
    id: 'scaffolder.task-status.component',
  });

/**
 * Registers one task-list status presentation, leaving the native list, data
 * loading, ownership filters and pagination in place.
 *
 * @alpha
 */
export const ScaffolderTaskStatusBlueprint = createExtensionBlueprint({
  kind: 'scaffolder-task-status',
  attachTo: { id: 'sub-page:scaffolder/tasks', input: 'taskStatus' },
  output: [componentRef],
  dataRefs: { component: componentRef },
  factory: (params: { component: ScaffolderTaskStatusComponent }) => {
    return [componentRef(params.component)];
  },
});
