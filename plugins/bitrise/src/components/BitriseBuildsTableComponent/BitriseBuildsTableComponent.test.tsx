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

import React from 'react';
import { bitriseApiRef } from '../../plugin';
import { BitriseClientApi } from '../../api/bitriseApi.client';
import { setupServer } from 'msw/node';
import { msw, renderInTestApp } from '@backstage/test-utils';
import { useBitriseBuilds } from '../../hooks/useBitriseBuilds';
import { BitriseBuildsTable } from './BitriseBuildsTableComponent';
import {
  ApiProvider,
  ApiRegistry,
  UrlPatternDiscovery,
} from '@backstage/core-app-api';

jest.mock('../../hooks/useBitriseBuilds', () => ({
  useBitriseBuilds: jest.fn(),
}));

const server = setupServer();

describe('BitriseBuildsFetchComponent', () => {
  msw.setupDefaultHandlers(server);
  const mockBaseUrl = 'http://backstage:9191';
  const discoveryApi = UrlPatternDiscovery.compile(mockBaseUrl);
  let apis: ApiRegistry;

  beforeEach(() => {
    apis = ApiRegistry.with(bitriseApiRef, new BitriseClientApi(discoveryApi));
  });

  it('should display `no records` message if there are no builds', async () => {
    (useBitriseBuilds as jest.Mock).mockReturnValue({ value: [] });

    const { getByText } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <BitriseBuildsTable appName="some-app-name" />,
      </ApiProvider>,
    );

    expect(getByText(/No records to display/)).toBeInTheDocument();
  });

  it('should display a table if there are builds', async () => {
    (useBitriseBuilds as jest.Mock).mockReturnValue({
      value: {
        data: [
          {
            id: 'some-id-1',
            slug: 'some-slug',
            commitHash: 'some-commit',
          },
          {
            id: 'some-id-2',
            slug: 'some-slug',
            commitHash: 'some-commit',
          },
        ],
      },
    });

    const { getByText } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <BitriseBuildsTable appName="some-app-name" />,
      </ApiProvider>,
    );
    expect(getByText(/some-id-1/)).toBeInTheDocument();
    expect(getByText(/some-id-2/)).toBeInTheDocument();
  });

  it('should display pagination', async () => {
    (useBitriseBuilds as jest.Mock).mockReturnValue({
      value: {
        data: [
          {
            id: 'some-id-1',
            slug: 'some-slug',
            commitHash: 'some-commit',
          },
          {
            id: 'some-id-2',
            slug: 'some-slug',
            commitHash: 'some-commit',
          },
        ],
        paging: {
          next: 'fae3232de3d2',
          page_item_limit: 20,
          total_item_count: 400,
        },
      },
    });

    const { getAllByText, getByText } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <BitriseBuildsTable appName="some-app-name" />,
      </ApiProvider>,
    );
    expect(getAllByText(/1-20 of 400/).length).toEqual(2);
    expect(getByText(/20 rows/)).toBeInTheDocument();
  });
});
