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

import { GaugeCard } from './GaugeCard';

const minProps = { title: 'Tingle upgrade', progress: 0.12 };

describe('<GaugeCard />', () => {
  it('renders without exploding', async () => {
    const { getByText } = await renderInTestApp(<GaugeCard {...minProps} />);
    expect(getByText(/Tingle.*/)).toBeInTheDocument();
  });

  it('renders progress and title', async () => {
    const { getByText } = await renderInTestApp(<GaugeCard {...minProps} />);
    expect(getByText(/Tingle.*/)).toBeInTheDocument();
    expect(getByText(/12%.*/)).toBeInTheDocument();
  });

  it('does not render deepLink', async () => {
    const { queryByText } = await renderInTestApp(<GaugeCard {...minProps} />);
    expect(queryByText('View more')).not.toBeInTheDocument();
  });

  it('handles invalid numbers', async () => {
    const badProps = { title: 'Tingle upgrade', progress: 'hejjo' } as any;
    const { getByText } = await renderInTestApp(<GaugeCard {...badProps} />);
    expect(getByText(/N\/A.*/)).toBeInTheDocument();
  });
});
