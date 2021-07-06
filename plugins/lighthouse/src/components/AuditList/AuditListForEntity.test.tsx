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

import { Entity } from '@backstage/catalog-model';
import { EntityContext } from '@backstage/plugin-catalog-react';
import { lightTheme } from '@backstage/theme';
import { ThemeProvider } from '@material-ui/core';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import {
  lighthouseApiRef,
  LighthouseRestApi,
  WebsiteListResponse,
} from '../../api';
import { useWebsiteForEntity } from '../../hooks/useWebsiteForEntity';
import * as data from '../../__fixtures__/website-list-response.json';
import { AuditListForEntity } from './AuditListForEntity';

import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';
import { errorApiRef } from '@backstage/core-plugin-api';

jest.mock('../../hooks/useWebsiteForEntity', () => ({
  useWebsiteForEntity: jest.fn(),
}));

const websiteListResponse = data as WebsiteListResponse;
const entityWebsite = websiteListResponse.items[0];

describe('<AuditListTableForEntity />', () => {
  let apis: ApiRegistry;

  const mockErrorApi: jest.Mocked<typeof errorApiRef.T> = {
    post: jest.fn(),
    error$: jest.fn(),
  };

  beforeEach(() => {
    apis = ApiRegistry.from([
      [lighthouseApiRef, new LighthouseRestApi('http://lighthouse')],
      [errorApiRef, mockErrorApi],
    ]);

    (useWebsiteForEntity as jest.Mock).mockReturnValue({
      value: entityWebsite,
      loading: false,
      error: null,
    });
  });

  const entity: Entity = {
    apiVersion: 'v1',
    kind: 'Component',
    metadata: {
      name: 'software',
      annotations: {
        'lighthouse.com/website-url': entityWebsite.url,
      },
    },
    spec: {
      owner: 'guest',
      type: 'Website',
      lifecycle: 'development',
    },
  };

  const subject = (value = {}) =>
    render(
      <ThemeProvider theme={lightTheme}>
        <MemoryRouter>
          <ApiProvider apis={apis}>
            <EntityContext.Provider
              value={{ entity: entity, loading: false, ...value }}
            >
              <AuditListForEntity />
            </EntityContext.Provider>
          </ApiProvider>
        </MemoryRouter>
      </ThemeProvider>,
    );

  it('renders the audit list for the entity', async () => {
    const { findByText } = subject();
    expect(await findByText(entityWebsite.url)).toBeInTheDocument();
  });

  describe('where the data is loading', () => {
    beforeEach(() => {
      (useWebsiteForEntity as jest.Mock).mockReturnValue({
        value: null,
        loading: true,
        error: null,
      });
    });

    it('renders a Progress element', async () => {
      const { findByTestId } = subject();
      expect(await findByTestId('progress')).toBeInTheDocument();
    });
  });

  describe('where there is an error loading data', () => {
    beforeEach(() => {
      (useWebsiteForEntity as jest.Mock).mockReturnValue({
        value: null,
        loading: false,
        error: 'error',
      });
    });

    it('renders nothing', async () => {
      const { queryByTestId } = subject();
      expect(await queryByTestId('AuditListTable')).toBeNull();
    });
  });

  describe('where there is not data', () => {
    beforeEach(() => {
      (useWebsiteForEntity as jest.Mock).mockReturnValue({
        value: null,
        loading: false,
        error: null,
      });
    });

    it('renders nothing', async () => {
      const { queryByTestId } = subject();
      expect(await queryByTestId('AuditListTable')).toBeNull();
    });
  });
});
