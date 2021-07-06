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
import { Card, CardMedia } from '@material-ui/core';
import { screen } from '@testing-library/react';
import React from 'react';
import { ItemCardHeader } from './ItemCardHeader';

describe('<ItemCardHeader />', () => {
  it('renders default without exploding', async () => {
    await renderInTestApp(
      <Card>
        <CardMedia>
          <ItemCardHeader title="My Title" subtitle="My Subtitle" />
        </CardMedia>
      </Card>,
    );
    expect(screen.getByText('My Title')).toBeInTheDocument();
    expect(screen.getByText('My Subtitle')).toBeInTheDocument();
  });

  it('renders custom children', async () => {
    await renderInTestApp(
      <Card>
        <CardMedia>
          <ItemCardHeader title="My Title">My Custom Text</ItemCardHeader>
        </CardMedia>
      </Card>,
    );
    expect(screen.getByText('My Title')).toBeInTheDocument();
    expect(screen.getByText('My Custom Text')).toBeInTheDocument();
  });

  it('renders custom styles', async () => {
    await renderInTestApp(
      <Card>
        <CardMedia>
          <ItemCardHeader classes={{ root: 'my-css-class' }}>
            My Custom Text
          </ItemCardHeader>
        </CardMedia>
      </Card>,
    );
    expect(screen.getByText('My Custom Text')).toHaveClass('my-css-class');
  });
});
