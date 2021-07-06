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
import { ExploreLayout } from './ExploreLayout';

describe('<ExploreLayout />', () => {
  const Wrapper = ({ children }: { children?: React.ReactNode }) => (
    <>{children}</>
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders an explore tabbed layout page with defaults', async () => {
    const { getByText } = await renderInTestApp(
      <Wrapper>
        <ExploreLayout>
          <ExploreLayout.Route path="/tools" title="Tools">
            <div>Tools Content</div>
          </ExploreLayout.Route>
        </ExploreLayout>
      </Wrapper>,
    );

    await waitFor(() => {
      expect(getByText('Explore our ecosystem')).toBeInTheDocument();
      expect(
        getByText('Discover solutions available in our ecosystem'),
      ).toBeInTheDocument();
    });
  });

  it('renders a custom page title', async () => {
    const { getByText } = await renderInTestApp(
      <Wrapper>
        <ExploreLayout title="Explore our universe">
          <ExploreLayout.Route path="/tools" title="Tools">
            <div>Tools Content</div>
          </ExploreLayout.Route>
        </ExploreLayout>
      </Wrapper>,
    );

    await waitFor(() =>
      expect(getByText('Explore our universe')).toBeInTheDocument(),
    );
  });

  it('renders a custom page subtitle', async () => {
    const { getByText } = await renderInTestApp(
      <Wrapper>
        <ExploreLayout subtitle="Browse the ACME Corp ecosystem">
          <ExploreLayout.Route path="/tools" title="Tools">
            <div>Tools Content</div>
          </ExploreLayout.Route>
        </ExploreLayout>
      </Wrapper>,
    );

    await waitFor(() =>
      expect(getByText('Browse the ACME Corp ecosystem')).toBeInTheDocument(),
    );
  });
});
