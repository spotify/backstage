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

import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { renderInTestApp } from '@backstage/test-utils';
import { waitFor, getByText } from '@testing-library/react';
import React from 'react';
import { DefaultExplorePage } from './DefaultExplorePage';
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';

describe('<DefaultExplorePage />', () => {
  const catalogApi: jest.Mocked<typeof catalogApiRef.T> = {
    addLocation: jest.fn(_a => new Promise(() => {})),
    getEntities: jest.fn(),
    getOriginLocationByEntity: jest.fn(),
    getLocationByEntity: jest.fn(),
    getLocationById: jest.fn(),
    removeLocationById: jest.fn(),
    removeEntityByUid: jest.fn(),
    getEntityByName: jest.fn(),
  };

  const Wrapper = ({ children }: { children?: React.ReactNode }) => (
    <ApiProvider apis={ApiRegistry.with(catalogApiRef, catalogApi)}>
      {children}
    </ApiProvider>
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders the default explore page', async () => {
    catalogApi.getEntities.mockResolvedValue({ items: [] });

    const { getAllByRole } = await renderInTestApp(
      <Wrapper>
        <DefaultExplorePage />
      </Wrapper>,
    );

    await waitFor(() => {
      const elements = getAllByRole('tab');
      expect(elements.length).toBe(3);
      expect(getByText(elements[0], 'Domains')).toBeInTheDocument();
      expect(getByText(elements[1], 'Groups')).toBeInTheDocument();
      expect(getByText(elements[2], 'Tools')).toBeInTheDocument();
    });
  });
});
