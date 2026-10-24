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

import { Routes, Route, useParams } from 'react-router-dom';
import { Content } from '@backstage/core-components';
import { BreadcrumbEntry } from '@backstage/frontend-plugin-api';
import { OngoingTaskBody } from '../../components/OngoingTask';
import { ListTaskPageContent } from '../../components/ListTasksPage';
import {
  ScaffolderTaskStatusComponent,
  ScaffolderTemplateOutputsComponent,
} from '@backstage/plugin-scaffolder-react/alpha';
import { useTaskEventStream } from '@backstage/plugin-scaffolder-react';

type TemplateOutputsRegistration = {
  component: ScaffolderTemplateOutputsComponent;
  templateRefs: string[];
};

function TaskDetailWithBreadcrumb(props: {
  templateOutputsComponents?: TemplateOutputsRegistration[];
}) {
  const { taskId } = useParams<{ taskId: string }>();
  const taskStream = useTaskEventStream(taskId!);
  const templateRef = taskStream.task?.spec.templateInfo?.entityRef;
  const TemplateOutputsComponent = props.templateOutputsComponents?.find(
    registration => registration.templateRefs.includes(templateRef ?? ''),
  )?.component;

  if (!taskId) {
    return (
      <OngoingTaskBody TemplateOutputsComponent={TemplateOutputsComponent} />
    );
  }
  return (
    <BreadcrumbEntry entry={{ label: taskId, href: taskId }}>
      <OngoingTaskBody TemplateOutputsComponent={TemplateOutputsComponent} />
    </BreadcrumbEntry>
  );
}

/**
 * Sub-page for the tasks tab. Renders the task list at the index route
 * and the ongoing task detail at the parameterized route.
 *
 * @internal
 */
export function TasksSubPage(props: {
  templateOutputsComponents?: TemplateOutputsRegistration[];
  TaskStatusComponent?: ScaffolderTaskStatusComponent;
}) {
  return (
    <Routes>
      <Route
        index
        element={
          <Content>
            <ListTaskPageContent
              TaskStatusComponent={props.TaskStatusComponent}
            />
          </Content>
        }
      />
      <Route
        path=":taskId"
        element={
          <TaskDetailWithBreadcrumb
            templateOutputsComponents={props.templateOutputsComponents}
          />
        }
      />
    </Routes>
  );
}
