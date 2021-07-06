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
import { Tabbed } from './Tabbed';
import { renderInTestApp } from '@backstage/test-utils';
import { fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { Routes, Route } from 'react-router';

describe('Tabbed layout', () => {
  it('renders simplest case', async () => {
    const rendered = await renderInTestApp(
      <Tabbed.Layout>
        <Tabbed.Content
          title="tabbed-test-title"
          path="*"
          element={<div>tabbed-test-content</div>}
        />
      </Tabbed.Layout>,
    );

    expect(rendered.getByText('tabbed-test-title')).toBeInTheDocument();
    expect(rendered.getByText('tabbed-test-content')).toBeInTheDocument();
  });

  it('throws if any other component is a child of Tabbed.Layout', async () => {
    await expect(
      renderInTestApp(
        <Tabbed.Layout>
          <Tabbed.Content
            title="tabbed-test-title"
            path="*"
            element={<div>tabbed-test-content</div>}
          />
          <div>This will cause app to throw</div>
        </Tabbed.Layout>,
      ),
    ).rejects.toThrow(/This component only accepts/);
  });

  it('navigates when user clicks different tab', async () => {
    const rendered = await renderInTestApp(
      <Routes>
        <Route
          path="/*"
          element={
            <Tabbed.Layout>
              <Tabbed.Content
                title="tabbed-test-title"
                path="/"
                element={<div>tabbed-test-content</div>}
              />
              <Tabbed.Content
                title="tabbed-test-title-2"
                path="/some-other-path"
                element={<div>tabbed-test-content-2</div>}
              />
            </Tabbed.Layout>
          }
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
              <Tabbed.Layout>
                <Tabbed.Content
                  title="tabbed-test-title"
                  path="/"
                  element={<div>tabbed-test-content</div>}
                />
                <Tabbed.Content
                  title="tabbed-test-title-2"
                  path="/some-other-path/*"
                  element={
                    <div>
                      tabbed-test-content-2
                      <Routes>
                        <Route
                          path="/nested"
                          element={<div>tabbed-test-nested-content-2</div>}
                        />
                      </Routes>
                    </div>
                  }
                />
              </Tabbed.Layout>
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
      <Tabbed.Layout>
        <Tabbed.Content
          title="tabbed-test-title"
          path="/"
          element={<div>tabbed-test-content</div>}
        />
        <Tabbed.Content
          title="tabbed-test-title-2"
          path="/some-other-path"
          element={<div>tabbed-test-content-2</div>}
        />
      </Tabbed.Layout>,
      { routeEntries: ['/some-other-path'] },
    );

    expect(rendered.getByText('tabbed-test-title')).toBeInTheDocument();
    expect(rendered.queryByText('tabbed-test-content')).not.toBeInTheDocument();

    expect(rendered.getByText('tabbed-test-title-2')).toBeInTheDocument();
    expect(rendered.queryByText('tabbed-test-content-2')).toBeInTheDocument();
  });

  it('redirects to the top level when no route is matching the url', async () => {
    const rendered = await renderInTestApp(
      <Tabbed.Layout>
        <Tabbed.Content
          title="tabbed-test-title"
          path="/"
          element={<div>tabbed-test-content</div>}
        />
        <Tabbed.Content
          title="tabbed-test-title-2"
          path="/some-other-path"
          element={<div>tabbed-test-content-2</div>}
        />
      </Tabbed.Layout>,
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
