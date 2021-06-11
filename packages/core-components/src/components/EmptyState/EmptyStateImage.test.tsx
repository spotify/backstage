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

import React from 'react';
import { renderWithEffects, wrapInTestApp } from '@backstage/test-utils';
import { EmptyStateImage } from './EmptyStateImage';

describe('<EmptyStateImage />', () => {
  it('render EmptyStateImage component with missing field', async () => {
    const { getByAltText } = await renderWithEffects(
      wrapInTestApp(<EmptyStateImage missing="field" />),
    );
    expect(getByAltText('annotation is missing')).toBeInTheDocument();
  });

  it('render EmptyStateImage component with missing info', async () => {
    const { getByAltText } = await renderWithEffects(
      wrapInTestApp(<EmptyStateImage missing="info" />),
    );
    expect(getByAltText('no Information')).toBeInTheDocument();
  });

  it('render EmptyStateImage component with missing content', async () => {
    const { getByAltText } = await renderWithEffects(
      wrapInTestApp(<EmptyStateImage missing="content" />),
    );
    expect(getByAltText('create Component')).toBeInTheDocument();
  });

  it('render EmptyStateImage component with missing data', async () => {
    const { getByAltText } = await renderWithEffects(
      wrapInTestApp(<EmptyStateImage missing="data" />),
    );
    expect(getByAltText('no Build')).toBeInTheDocument();
  });
});
