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

import { screen } from '@testing-library/react';
import { renderTestApp } from '@backstage/frontend-test-utils';
import { createFrontendModule } from '@backstage/frontend-plugin-api';
import { ScaffolderTaskStatusBlueprint } from '@backstage/plugin-scaffolder-react/alpha';
import { scaffolderApiRef } from '@backstage/plugin-scaffolder-react';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import { mockApis } from '@backstage/test-utils';
import scaffolder from './plugin';

const tasks = [
  {
    id: 'custom-task',
    status: 'failed' as const,
    createdAt: '2026-01-01T00:00:00Z',
    spec: { parameters: {}, steps: [] },
  },
  {
    id: 'native-task',
    status: 'completed' as const,
    createdAt: '2026-01-01T00:00:00Z',
    spec: { parameters: {}, steps: [] },
  },
];

it.each([false, true])(
  'keeps the native list and fallback with custom status registered: %s',
  async custom => {
    const listTasks = jest.fn().mockResolvedValue({ tasks, totalTasks: 2 });
    const received = jest.fn();
    const module = createFrontendModule({
      pluginId: 'scaffolder',
      extensions: [
        ScaffolderTaskStatusBlueprint.make({
          params: {
            component: ({ task, children }) => {
              received(task);
              return task.id === 'custom-task' ? (
                <>Needs attention</>
              ) : (
                <>{children}</>
              );
            },
          },
        }),
      ],
    });
    renderTestApp({
      features: custom ? [scaffolder, module] : [scaffolder],
      initialRouteEntries: ['/create/tasks'],
      apis: [
        [
          scaffolderApiRef,
          {
            listTasks,
            getTemplateParameterSchema: async () => ({
              title: 'Template',
              steps: [],
            }),
          } as any,
        ],
        [catalogApiRef, catalogApiMock()],
        [permissionApiRef, mockApis.permission()],
      ],
    });
    expect(await screen.findByText('completed')).toBeInTheDocument();
    expect(
      await screen.findByText(custom ? 'Needs attention' : 'failed'),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'custom-task' })).toHaveAttribute(
      'href',
      '/create/tasks/custom-task',
    );
    expect(listTasks).toHaveBeenCalledWith({
      filterByOwnership: 'owned',
      limit: 5,
      offset: 0,
    });
    expect(tasks[0].status).toBe('failed');
    expect(
      received.mock.calls.some(([task]) => task.id === 'custom-task'),
    ).toBe(custom);
    expect(
      received.mock.calls.some(([task]) => task.id === 'native-task'),
    ).toBe(custom);
  },
);
