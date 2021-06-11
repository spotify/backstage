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
import { renderInTestApp } from '@backstage/test-utils';
import { fireEvent } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Route, Routes } from 'react-router';
import { RoutedTabs } from './RoutedTabs';

const testRoute1 = {
  path: '',
  title: 'tabbed-test-title',
  children: <div>tabbed-test-content</div>,
};
const testRoute2 = {
  title: 'tabbed-test-title-2',
  path: '/some-other-path',
  children: <div>tabbed-test-content-2</div>,
};

describe('RoutedTabs', () => {
  it('renders simplest case', async () => {
    const rendered = await renderInTestApp(
      <RoutedTabs routes={[testRoute1]} />,
    );

    expect(rendered.getByText('tabbed-test-title')).toBeInTheDocument();
    expect(rendered.getByText('tabbed-test-content')).toBeInTheDocument();
  });

  it('navigates when user clicks different tab', async () => {
    const rendered = await renderInTestApp(
      <Routes>
        <Route
          path="/*"
          element={<RoutedTabs routes={[testRoute1, testRoute2]} />}
        />
      </Routes>,
    );

    const secondTab = rendered.queryAllByRole('tab')[1];
    act(() => {
      fireEvent.click(secondTab);
    });

    expect(rendered.getByText('tabbed-test-title')).toBeInTheDocument();
    expect(rendered.queryByText('tabbed-test-content')).not.toBeInTheDocument();

    expect(rendered.getByText('tabbed-test-title-2')).toBeInTheDocument();
    expect(rendered.queryByText('tabbed-test-content-2')).toBeInTheDocument();
  });

  describe('correctly delegates nested links', () => {
    const renderRoute = (route: string) =>
      renderInTestApp(
        <Routes>
          <Route
            path="/*"
            element={
              <RoutedTabs
                routes={[
                  testRoute1,
                  {
                    ...testRoute2,
                    children: (
                      <div>
                        tabbed-test-content-2
                        <Routes>
                          <Route
                            path="/nested"
                            element={<div>tabbed-test-nested-content-2</div>}
                          />
                        </Routes>
                      </div>
                    ),
                  },
                ]}
              />
            }
          />
        </Routes>,
        { routeEntries: [route] },
      );

    it('works for nested content', async () => {
      const rendered = await renderRoute('/some-other-path/nested');

      expect(
        rendered.queryByText('tabbed-test-content'),
      ).not.toBeInTheDocument();
      expect(rendered.queryByText('tabbed-test-content-2')).toBeInTheDocument();
      expect(
        rendered.queryByText('tabbed-test-nested-content-2'),
      ).toBeInTheDocument();
    });

    it('works for non-nested content', async () => {
      const rendered = await renderRoute('/some-other-path/');

      expect(
        rendered.queryByText('tabbed-test-content'),
      ).not.toBeInTheDocument();
      expect(rendered.queryByText('tabbed-test-content-2')).toBeInTheDocument();
      expect(
        rendered.queryByText('tabbed-test-nested-content-2'),
      ).not.toBeInTheDocument();
    });
  });

  it('shows only one tab contents at a time', async () => {
    const rendered = await renderInTestApp(
      <RoutedTabs routes={[testRoute1, testRoute2]} />,
      { routeEntries: ['/some-other-path'] },
    );

    expect(rendered.getByText('tabbed-test-title')).toBeInTheDocument();
    expect(rendered.queryByText('tabbed-test-content')).not.toBeInTheDocument();

    expect(rendered.getByText('tabbed-test-title-2')).toBeInTheDocument();
    expect(rendered.queryByText('tabbed-test-content-2')).toBeInTheDocument();
  });

  it('redirects to the top level when no route is matching the url', async () => {
    const rendered = await renderInTestApp(
      <RoutedTabs routes={[testRoute1, testRoute2]} />,
      { routeEntries: ['/non-existing-path'] },
    );

    expect(rendered.getByText('tabbed-test-title')).toBeInTheDocument();
    expect(rendered.getByText('tabbed-test-content')).toBeInTheDocument();
    expect(rendered.getByText('tabbed-test-title-2')).toBeInTheDocument();

    expect(
      rendered.queryByText('tabbed-test-content-2'),
    ).not.toBeInTheDocument();
  });
});
