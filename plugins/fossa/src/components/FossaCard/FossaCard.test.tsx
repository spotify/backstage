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

import { Entity } from '@backstage/catalog-model';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { renderInTestApp } from '@backstage/test-utils';
import React from 'react';
import { FossaApi, fossaApiRef } from '../../api';
import { FossaCard } from './FossaCard';
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';

describe('<FossaCard />', () => {
  const fossaApi: jest.Mocked<FossaApi> = {
    getFindingSummary: jest.fn(),
    getFindingSummaries: jest.fn(),
  };
  let Wrapper: React.ComponentType;

  beforeEach(() => {
    const apis = ApiRegistry.with(fossaApiRef, fossaApi);

    Wrapper = ({ children }: { children?: React.ReactNode }) => (
      <ApiProvider apis={apis}>{children}</ApiProvider>
    );
  });

  afterEach(() => jest.resetAllMocks());

  it('shows missing annotation', async () => {
    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'my-name',
      },
    };

    const { getByText } = await renderInTestApp(
      <Wrapper>
        <EntityProvider entity={entity}>
          <FossaCard />
        </EntityProvider>
      </Wrapper>,
    );

    expect(getByText(/Missing Annotation/i)).toBeInTheDocument();
    expect(getByText('fossa.io/project-name')).toBeInTheDocument();
  });

  it('shows error', async () => {
    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'my-name',
        annotations: {
          'fossa.io/project-name': 'my-name',
        },
      },
    };

    fossaApi.getFindingSummary.mockRejectedValue(new Error('My Error'));

    const { getByText } = await renderInTestApp(
      <Wrapper>
        <EntityProvider entity={entity}>
          <FossaCard />
        </EntityProvider>
      </Wrapper>,
    );

    expect(getByText(/Warning: My Error/i)).toBeInTheDocument();
  });

  it('shows empty', async () => {
    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'my-name',
        annotations: {
          'fossa.io/project-name': 'my-name',
        },
      },
    };

    fossaApi.getFindingSummary.mockResolvedValue(undefined);

    const { getByText } = await renderInTestApp(
      <Wrapper>
        <EntityProvider entity={entity}>
          <FossaCard />
        </EntityProvider>
      </Wrapper>,
    );

    expect(
      getByText(/There is no Fossa project with title 'my-name'./i),
    ).toBeInTheDocument();
  });

  it('shows fossa issues', async () => {
    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'my-name',
        annotations: {
          'fossa.io/project-name': 'my-name',
        },
      },
    };

    fossaApi.getFindingSummary.mockResolvedValue({
      timestamp: '2000-01-01T00:00:00Z',
      projectDefaultBranch: 'branch/default-branch',
      projectUrl: 'http://…',
      issueCount: 0,
      dependencyCount: 10,
    });

    const { getByText } = await renderInTestApp(
      <Wrapper>
        <EntityProvider entity={entity}>
          <FossaCard />
        </EntityProvider>
      </Wrapper>,
    );

    expect(getByText(/Number of issues/i)).toBeInTheDocument();
    expect(
      getByText(
        (_, node) =>
          node?.textContent ===
          'Based on 10 Dependencies on branch branch/default-branch.',
      ),
    ).toBeInTheDocument();
  });

  it('warns about zero dependencies', async () => {
    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'my-name',
        annotations: {
          'fossa.io/project-name': 'my-name',
        },
      },
    };

    fossaApi.getFindingSummary.mockResolvedValue({
      timestamp: '2000-01-01T00:00:00Z',
      projectDefaultBranch: 'branch/default-branch',
      projectUrl: 'http://…',
      issueCount: 0,
      dependencyCount: 0,
    });

    const { getByText } = await renderInTestApp(
      <Wrapper>
        <EntityProvider entity={entity}>
          <FossaCard />
        </EntityProvider>
      </Wrapper>,
    );

    expect(getByText(/No Dependencies/i)).toBeInTheDocument();
    expect(
      getByText(/Please check your FOSSA project settings/i),
    ).toBeInTheDocument();
  });
});
