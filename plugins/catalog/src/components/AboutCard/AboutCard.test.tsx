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

import { RELATION_OWNED_BY } from '@backstage/catalog-model';
import {
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { renderInTestApp } from '@backstage/test-utils';
import { act, fireEvent } from '@testing-library/react';
import React from 'react';
import { AboutCard } from './AboutCard';
import {
  ApiProvider,
  ApiRegistry,
  ConfigReader,
} from '@backstage/core-app-api';

describe('<AboutCard />', () => {
  it('renders info', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        description: 'This is the description',
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
      relations: [
        {
          type: RELATION_OWNED_BY,
          target: {
            kind: 'user',
            name: 'guest',
            namespace: 'default',
          },
        },
      ],
    };
    const apis = ApiRegistry.with(
      scmIntegrationsApiRef,
      ScmIntegrationsApi.fromConfig(
        new ConfigReader({
          integrations: {},
        }),
      ),
    );

    const { getByText } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={entity}>
          <AboutCard />
        </EntityProvider>
      </ApiProvider>,
    );

    expect(getByText('service')).toBeInTheDocument();
    expect(getByText('user:guest')).toBeInTheDocument();
    expect(getByText('production')).toBeInTheDocument();
    expect(getByText('This is the description')).toBeInTheDocument();
  });

  it('renders "view source" link', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        annotations: {
          'backstage.io/source-location':
            'url:https://github.com/backstage/backstage/blob/master/software.yaml',
        },
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };
    const apis = ApiRegistry.with(
      scmIntegrationsApiRef,
      ScmIntegrationsApi.fromConfig(
        new ConfigReader({
          integrations: {
            github: [
              {
                host: 'github.com',
                token: '...',
              },
            ],
          },
        }),
      ),
    );

    const { getByText } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={entity}>
          <AboutCard />
        </EntityProvider>
      </ApiProvider>,
    );
    expect(getByText('View Source').closest('a')).toHaveAttribute(
      'href',
      'https://github.com/backstage/backstage/blob/master/software.yaml',
    );
  });

  it('renders "edit metadata" button', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        annotations: {
          'backstage.io/edit-url':
            'https://github.com/backstage/backstage/edit/master/software.yaml',
        },
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };
    const apis = ApiRegistry.with(
      scmIntegrationsApiRef,
      ScmIntegrationsApi.fromConfig(
        new ConfigReader({
          integrations: {
            github: [
              {
                host: 'github.com',
                token: '...',
              },
            ],
          },
        }),
      ),
    );

    const { getByTitle } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={entity}>
          <AboutCard />
        </EntityProvider>
      </ApiProvider>,
    );

    const editButton = getByTitle('Edit Metadata');
    window.open = jest.fn();
    await act(async () => {
      fireEvent.click(editButton);
    });
    expect(window.open).toHaveBeenCalledWith(
      `https://github.com/backstage/backstage/edit/master/software.yaml`,
      '_blank',
    );
  });

  it('renders without "view source" link', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };
    const apis = ApiRegistry.with(
      scmIntegrationsApiRef,
      ScmIntegrationsApi.fromConfig(new ConfigReader({})),
    );

    const { getByText } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={entity}>
          <AboutCard />
        </EntityProvider>
      </ApiProvider>,
    );
    expect(getByText('View Source').closest('a')).not.toHaveAttribute('href');
  });
});
