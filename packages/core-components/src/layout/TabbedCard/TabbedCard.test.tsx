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

import { renderInTestApp, wrapInTestApp } from '@backstage/test-utils';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { CardTab, TabbedCard } from './TabbedCard';

const minProps = {
  title: 'Some title',
  deepLink: {
    title: 'A deepLink title',
    link: '/mocked',
  },
};

describe('<TabbedCard />', () => {
  it('renders without exploding', async () => {
    const rendered = await renderInTestApp(
      <TabbedCard title={minProps.title}>
        <CardTab label="Test 1">Test Content</CardTab>
        <CardTab label="Test 2">Test Content</CardTab>
      </TabbedCard>,
    );
    expect(rendered.getByText('Some title')).toBeInTheDocument();
  });

  it('renders a deepLink when prop is set', async () => {
    const rendered = await renderInTestApp(
      <TabbedCard deepLink={minProps.deepLink}>
        <CardTab label="Test 1">Test Content</CardTab>
        <CardTab label="Test 2">Test Content</CardTab>
      </TabbedCard>,
    );
    expect(rendered.getByText('A deepLink title')).toBeInTheDocument();
  });

  it('switches tabs when clicking', async () => {
    const rendered = await renderInTestApp(
      <TabbedCard>
        <CardTab label="Test 1">Test Content 1</CardTab>
        <CardTab label="Test 2">Test Content 2</CardTab>
      </TabbedCard>,
    );
    expect(rendered.getByText('Test Content 1')).toBeInTheDocument();

    fireEvent.click(rendered.getByText('Test 2'));
    expect(rendered.getByText('Test Content 2')).toBeInTheDocument();
  });

  it('switches tabs when clicking in controlled mode', () => {
    let selectedTab = 'one';

    const handleTabChange = jest.fn(
      (_ev, newSelectedTab) => (selectedTab = newSelectedTab),
    );

    const rendered = render(
      wrapInTestApp(
        <TabbedCard value={selectedTab} onChange={handleTabChange}>
          <CardTab value="one" label="Test 1">
            Test Content 1
          </CardTab>
          <CardTab value="two" label="Test 2">
            Test Content 2
          </CardTab>
        </TabbedCard>,
      ),
    );
    expect(rendered.getByText('Test Content 1')).toBeInTheDocument();

    fireEvent.click(rendered.getByText('Test 2'));
    expect(handleTabChange.mock.calls.length).toBe(1);
    rendered.rerender(
      <TabbedCard value={selectedTab} onChange={handleTabChange}>
        <CardTab value="one" label="Test 1">
          Test Content 1
        </CardTab>
        <CardTab value="two" label="Test 2">
          Test Content 2
        </CardTab>
      </TabbedCard>,
    );
    expect(rendered.getByText('Test Content 2')).toBeInTheDocument();
  });
});
