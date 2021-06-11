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
import { Header } from './Header';

jest.mock('react-helmet', () => {
  return {
    Helmet: ({ defaultTitle }: any) => <div>defaultTitle: {defaultTitle}</div>,
  };
});

describe('<Header/>', () => {
  it('should render with title', async () => {
    const rendered = await renderInTestApp(<Header title="Title" />);
    rendered.getByText('Title');
  });

  it('should set document title', async () => {
    const rendered = await renderInTestApp(<Header title="Title1" />);
    rendered.getByText('Title1');
    rendered.getByText('defaultTitle: Title1 | Backstage');
  });

  it('should override document title', async () => {
    const rendered = await renderInTestApp(
      <Header title="Title1" pageTitleOverride="Title2" />,
    );
    rendered.getByText('Title1');
    rendered.getByText('defaultTitle: Title2 | Backstage');
  });

  it('should have subtitle', async () => {
    const rendered = await renderInTestApp(
      <Header title="Title" subtitle="Subtitle" />,
    );
    rendered.getByText('Subtitle');
  });

  it('should have type rendered', async () => {
    const rendered = await renderInTestApp(
      <Header title="Title" type="tool" />,
    );
    rendered.getByText('tool');
  });

  it('should have breadcrumb rendered', async () => {
    const rendered = await renderInTestApp(
      <Header title="Title" type="tool" typeLink="/tool" />,
    );
    rendered.getAllByText('Title');
  });
});
