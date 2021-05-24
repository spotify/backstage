/*
 * Copyright 2020 Spotify AB
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

import {
  ApiProvider,
  ApiRegistry,
  createRouteRef,
  errorApiRef,
} from '@backstage/core';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { renderInTestApp } from '@backstage/test-utils';
import { lightTheme } from '@backstage/theme';
import { ThemeProvider } from '@material-ui/core';
import React from 'react';
import { RegisterComponentPage } from './RegisterComponentPage';

const errorApi: jest.Mocked<typeof errorApiRef.T> = {
  post: jest.fn(),
  error$: jest.fn(),
};

const catalogApi: jest.Mocked<typeof catalogApiRef.T> = {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  addLocation: jest.fn(_a => new Promise(() => {})),
  getEntities: jest.fn(),
  getOriginLocationByEntity: jest.fn(),
  getLocationByEntity: jest.fn(),
  getLocationById: jest.fn(),
  removeLocationById: jest.fn(),
  removeEntityByUid: jest.fn(),
  getEntityByName: jest.fn(),
  getAttachment: jest.fn(),
};

const Wrapper = ({ children }: { children?: React.ReactNode }) => (
  <ApiProvider
    apis={ApiRegistry.with(errorApiRef, errorApi).with(
      catalogApiRef,
      catalogApi,
    )}
  >
    <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
  </ApiProvider>
);

describe('RegisterComponentPage', () => {
  it('should render', async () => {
    const { getByText } = await renderInTestApp(
      <Wrapper>
        <RegisterComponentPage
          catalogRouteRef={createRouteRef({
            path: '/catalog',
            title: 'Service Catalog',
          })}
        />
      </Wrapper>,
    );

    expect(getByText('Register existing component')).toBeInTheDocument();
  });
});
