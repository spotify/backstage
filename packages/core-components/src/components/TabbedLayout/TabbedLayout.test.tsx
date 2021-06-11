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
import { renderInTestApp, withLogCollector } from '@backstage/test-utils';
import { fireEvent } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Route, Routes } from 'react-router';
import { TabbedLayout } from './TabbedLayout';

describe('TabbedLayout', () => {
  it('renders simplest case', async () => {
    const { getByText } = await renderInTestApp(
      <TabbedLayout>
        <TabbedLayout.Route path="/" title="tabbed-test-title">
          <div>tabbed-test-content</div>
        </TabbedLayout.Route>
      </TabbedLayout>,
    );

    expect(getByText('tabbed-test-title')).toBeInTheDocument();
    expect(getByText('tabbed-test-content')).toBeInTheDocument();
  });

  it('throws if any other component is a child of TabbedLayout', async () => {
    const { error } = await withLogCollector(async () => {
      await expect(
        renderInTestApp(
          <TabbedLayout>
            <TabbedLayout.Route path="/" title="tabbed-test-title">
              <div>tabbed-test-content</div>
            </TabbedLayout.Route>
            <div>This will cause app to throw</div>
          </TabbedLayout>,
        ),
      ).rejects.toThrow(/Child of TabbedLayout must be an TabbedLayout.Route/);
    });

    expect(error).toEqual([
      expect.stringMatching(
        /Child of TabbedLayout must be an TabbedLayout.Route/,
      ),
      expect.stringMatching(
        /The above error occurred in the <TabbedLayout> component/,
      ),
    ]);
  });

  it('navigates when user clicks different tab', async () => {
    const { getByText, queryByText, queryAllByRole } = await renderInTestApp(
      <Routes>
        <Route
          path="/*"
          element={
            <TabbedLayout>
              <TabbedLayout.Route path="/" title="tabbed-test-title">
                <div>tabbed-test-content</div>
              </TabbedLayout.Route>
              <TabbedLayout.Route
                path="/some-other-path"
                title="tabbed-test-title-2"
              >
                <div>tabbed-test-content-2</div>
              </TabbedLayout.Route>
            </TabbedLayout>
          }
        />
      </Routes>,
    );

    const secondTab = queryAllByRole('tab')[1];
    act(() => {
      fireEvent.click(secondTab);
    });

    expect(getByText('tabbed-test-title')).toBeInTheDocument();
    expect(queryByText('tabbed-test-content')).not.toBeInTheDocument();

    expect(getByText('tabbed-test-title-2')).toBeInTheDocument();
    expect(queryByText('tabbed-test-content-2')).toBeInTheDocument();
  });
});
