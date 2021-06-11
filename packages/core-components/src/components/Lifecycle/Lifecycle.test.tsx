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
import { renderInTestApp } from '@backstage/test-utils';
import { Lifecycle } from './Lifecycle';

describe('<Lifecycle />', () => {
  it('renders Alpha with shorthand', async () => {
    const { getByText } = await renderInTestApp(<Lifecycle alpha shorthand />);
    expect(getByText('α')).toBeInTheDocument();
  });

  it('renders Alpha without shorthand', async () => {
    const { getByText } = await renderInTestApp(<Lifecycle alpha />);
    expect(getByText('Alpha')).toBeInTheDocument();
  });

  it('renders Beta with shorthand', async () => {
    const { getByText } = await renderInTestApp(<Lifecycle shorthand />);
    expect(getByText('β')).toBeInTheDocument();
  });

  it('renders Beta without shorthand', async () => {
    const { getByText } = await renderInTestApp(<Lifecycle />);
    expect(getByText('Beta')).toBeInTheDocument();
  });
});
