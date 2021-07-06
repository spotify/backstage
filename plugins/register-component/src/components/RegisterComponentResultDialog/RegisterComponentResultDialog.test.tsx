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
import { lightTheme } from '@backstage/theme';
import { ThemeProvider } from '@material-ui/core';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { RegisterComponentResultDialog } from './RegisterComponentResultDialog';
import { createRouteRef } from '@backstage/core-plugin-api';

const Wrapper = ({ children }: { children?: React.ReactNode }) => (
  <MemoryRouter>
    <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
  </MemoryRouter>
);

describe('RegisterComponentResultDialog', () => {
  it('should render', () => {
    render(
      <RegisterComponentResultDialog
        onClose={() => {}}
        entities={[]}
        catalogRouteRef={createRouteRef({
          path: '/catalog',
          title: 'Software Catalog',
        })}
      />,
      { wrapper: Wrapper },
    );

    expect(screen.getByText('Registration Result')).toBeInTheDocument();
  });

  it('should show a list of components if success', async () => {
    const entities: Entity[] = [
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'Component1',
        },
        spec: {
          type: 'website',
        },
      },
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'Component2',
        },
        spec: {
          type: 'service',
        },
      },
    ];

    render(
      <RegisterComponentResultDialog
        onClose={() => {}}
        entities={entities}
        catalogRouteRef={createRouteRef({
          path: '/catalog',
          title: 'Software Catalog',
        })}
      />,
      { wrapper: Wrapper },
    );

    expect(
      screen.getByText(
        'The following entities have been successfully created:',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Component1')).toBeInTheDocument();
    expect(screen.getByText('Component2')).toBeInTheDocument();
  });
});
