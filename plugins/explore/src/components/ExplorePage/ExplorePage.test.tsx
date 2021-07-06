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
import React from 'react';
import { useOutlet } from 'react-router';
import { ExplorePage } from './ExplorePage';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: jest.fn().mockReturnValue({
    search: '',
  }),
  useOutlet: jest.fn().mockReturnValue('Route Children'),
}));

jest.mock('../DefaultExplorePage', () => ({
  ...jest.requireActual('../DefaultExplorePage'),
  DefaultExplorePage: jest.fn().mockReturnValue('DefaultExplorePageMock'),
}));

describe('ExplorePage', () => {
  it('renders provided router element', async () => {
    const { getByText } = await renderInTestApp(<ExplorePage />);

    expect(getByText('Route Children')).toBeInTheDocument();
  });

  it('renders default explorer page when no router children are provided', async () => {
    (useOutlet as jest.Mock).mockReturnValueOnce(null);
    const { getByText } = await renderInTestApp(<ExplorePage />);

    expect(getByText('DefaultExplorePageMock')).toBeInTheDocument();
  });
});
