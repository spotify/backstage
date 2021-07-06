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

import { renderInTestApp } from '@backstage/test-utils';
import { waitFor } from '@testing-library/react';
import React from 'react';
import { OpenApiDefinitionWidget } from './OpenApiDefinitionWidget';

describe('<OpenApiDefinitionWidget />', () => {
  it('renders openapi spec', async () => {
    const definition = `
openapi: "3.0.0"
info:
  version: 1.0.0
  title: Artist API
  license:
    name: MIT
servers:
  - url: http://artist.spotify.net/v1
paths:
  /artists:
    get:
      summary: List all artists
      responses:
        "200": 
          description: Success
    `;
    const { getByText } = await renderInTestApp(
      <OpenApiDefinitionWidget definition={definition} />,
    );

    // swagger-ui loads the documentation asynchronously
    await waitFor(() => {
      expect(getByText(/\/artists/i)).toBeInTheDocument();
      expect(getByText(/List all artists/i)).toBeInTheDocument();
    });
  });

  it('renders error if definition is missing', async () => {
    const { getByText } = await renderInTestApp(
      <OpenApiDefinitionWidget definition="" />,
    );
    expect(getByText(/No API definition provided/i)).toBeInTheDocument();
  });
});
