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

import { entityRouteRef } from '@backstage/plugin-catalog-react';
import { renderInTestApp } from '@backstage/test-utils';
import React from 'react';
import { TaskPageLinks } from './TaskPageLinks';

describe('TaskPageLinks', () => {
  beforeEach(() => {});

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders the entityRef link', async () => {
    const output = { entityRef: 'Component:default/my-app' };
    const { findByText } = await renderInTestApp(
      <TaskPageLinks output={output} />,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
        },
      },
    );

    const element = await findByText('Open in catalog');

    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute(
      'href',
      '/catalog/default/Component/my-app',
    );
  });

  it('renders the remoteUrl link', async () => {
    const output = { remoteUrl: 'https://remote.url' };
    const { findByText } = await renderInTestApp(
      <TaskPageLinks output={output} />,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
        },
      },
    );

    const element = await findByText('Repo');

    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('href', 'https://remote.url');
  });

  it('renders further links', async () => {
    const output = {
      links: [
        { url: 'https://first.url', title: 'Cool link 1' },
        { url: 'https://second.url', title: 'Cool link 2' },
        { entityRef: 'Component:default/my-app', title: 'Open in catalog' },
        { title: 'Skipped' },
      ],
    };
    const { findByText, queryByText } = await renderInTestApp(
      <TaskPageLinks output={output} />,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
        },
      },
    );

    let element = await findByText('Cool link 1');

    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('href', 'https://first.url');

    element = await findByText('Cool link 2');

    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('href', 'https://second.url');

    element = await findByText('Open in catalog');

    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute(
      'href',
      '/catalog/default/Component/my-app',
    );

    expect(queryByText('Skipped')).not.toBeInTheDocument();
  });
});
