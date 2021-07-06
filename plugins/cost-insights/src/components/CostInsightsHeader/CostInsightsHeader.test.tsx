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

import { CostInsightsHeader } from './CostInsightsHeader';
import { renderInTestApp } from '@backstage/test-utils';
import React from 'react';

import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';
import { IdentityApi, identityApiRef } from '@backstage/core-plugin-api';

describe('<CostInsightsHeader/>', () => {
  const identityApi: Partial<IdentityApi> = {
    getProfile: () => ({
      email: 'test-email@example.com',
      displayName: 'User 1',
    }),
  };

  const apis = ApiRegistry.from([[identityApiRef, identityApi]]);

  it('Shows nothing to do when no alerts exist', async () => {
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <CostInsightsHeader
          owner="test-owner"
          groups={[{ id: 'test-user-group-1' }]}
          hasCostData
          alerts={0}
        />
      </ApiProvider>,
    );

    expect(rendered.queryByText(/doing great/)).toBeInTheDocument();
  });

  it('Shows work to do when alerts > 1', async () => {
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <CostInsightsHeader
          owner="test-owner"
          groups={[{ id: 'test-user-group-1' }]}
          hasCostData
          alerts={4}
        />
      </ApiProvider>,
    );
    expect(rendered.queryByText(/few things/)).toBeInTheDocument();
  });

  it('Handles grammar with a single alert', async () => {
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <CostInsightsHeader
          owner="test-owner"
          groups={[{ id: 'test-user-group-1' }]}
          hasCostData
          alerts={1}
        />
      </ApiProvider>,
    );

    expect(rendered.queryByText(/things/)).not.toBeInTheDocument();
    expect(rendered.queryByText(/one thing/)).toBeInTheDocument();
  });

  it('Shows no costs when hasCostData is false', async () => {
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <CostInsightsHeader
          owner="test-owner"
          groups={[{ id: 'test-user-group-1' }]}
          hasCostData={false}
          alerts={1}
        />
      </ApiProvider>,
    );
    expect(rendered.queryByText(/this is awkward/)).toBeInTheDocument();
  });
});
