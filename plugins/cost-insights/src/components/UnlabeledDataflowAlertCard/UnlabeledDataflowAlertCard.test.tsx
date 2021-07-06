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

import React from 'react';
import { UnlabeledDataflowAlertCard } from './UnlabeledDataflowAlertCard';
import {
  createMockUnlabeledDataflowData,
  createMockUnlabeledDataflowAlertProject,
} from '../../testUtils';
import { renderInTestApp } from '@backstage/test-utils';

const MockUnlabeledDataflowAlertMultipleProjects = createMockUnlabeledDataflowData(
  data => ({
    ...data,
    projects: [...Array(10)].map(() =>
      createMockUnlabeledDataflowAlertProject(),
    ),
  }),
);

const MockUnlabeledDataflowAlertSingleProject = createMockUnlabeledDataflowData(
  data => ({
    ...data,
    projects: [...Array(1)].map(() =>
      createMockUnlabeledDataflowAlertProject(),
    ),
  }),
);

describe('<UnlabeledDataflowAlertCard />', () => {
  it('renders the correct subheader for multiple projects', async () => {
    const subheader = new RegExp(
      `Showing costs from ${MockUnlabeledDataflowAlertMultipleProjects.projects.length} ` +
        'projects with unlabeled Dataflow jobs in the last 30 days.',
    );
    const rendered = await renderInTestApp(
      <UnlabeledDataflowAlertCard
        alert={MockUnlabeledDataflowAlertMultipleProjects}
      />,
    );
    expect(rendered.getByText(subheader)).toBeInTheDocument();
  });

  it('renders the correct subheader for a single project', async () => {
    const subheader = new RegExp('1 project');
    const rendered = await renderInTestApp(
      <UnlabeledDataflowAlertCard
        alert={MockUnlabeledDataflowAlertSingleProject}
      />,
    );
    expect(rendered.getByText(subheader)).toBeInTheDocument();
  });
});
