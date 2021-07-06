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

import React from 'react';
import { renderInTestApp } from '@backstage/test-utils';

import { LinearGauge } from './LinearGauge';

describe('<LinearGauge />', () => {
  it('renders without exploding', async () => {
    const { getByTitle } = await renderInTestApp(<LinearGauge value={0.5} />);
    expect(getByTitle('50%')).toBeInTheDocument();
  });

  it('renders progress and title', async () => {
    const { container } = await renderInTestApp(<LinearGauge value={0 / 0} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders with 100 as max value', async () => {
    const { getByTitle } = await renderInTestApp(<LinearGauge value={1.5} />);
    expect(getByTitle('100%')).toBeInTheDocument();
  });
});
