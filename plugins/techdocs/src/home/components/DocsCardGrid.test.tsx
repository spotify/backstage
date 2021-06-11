/*
 * Copyright 2021 Spotify AB
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

import { wrapInTestApp } from '@backstage/test-utils';
import { render } from '@testing-library/react';
import React from 'react';
import { DocsCardGrid } from './DocsCardGrid';

describe('Entity Docs Card Grid', () => {
  it('should render all entities passed ot it', async () => {
    const { findByText } = render(
      wrapInTestApp(
        <DocsCardGrid
          entities={[
            {
              apiVersion: 'version',
              kind: 'TestKind',
              metadata: {
                name: 'testName',
              },
              spec: {
                owner: 'techdocs@example.com',
              },
            },
            {
              apiVersion: 'version',
              kind: 'TestKind2',
              metadata: {
                name: 'testName2',
              },
              spec: {
                owner: 'not-owned@example.com',
              },
            },
          ]}
        />,
      ),
    );
    expect(await findByText('testName')).toBeInTheDocument();
    expect(await findByText('testName2')).toBeInTheDocument();
  });
});
