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
import { Card } from '@material-ui/core';
import { screen } from '@testing-library/react';
import React from 'react';
import { ItemCardGrid } from './ItemCardGrid';

describe('<ItemCardGrid />', () => {
  it('renders default without exploding', async () => {
    await renderInTestApp(
      <ItemCardGrid>
        <Card>Hello!</Card>
      </ItemCardGrid>,
    );
    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getByText('Hello!')).toBeInTheDocument();
  });

  it('renders custom styles', async () => {
    await renderInTestApp(
      <>
        <ItemCardGrid>
          <Card>Hello!</Card>
        </ItemCardGrid>
        <ItemCardGrid classes={{ root: 'my-css-class' }}>
          <Card>Goodbye!</Card>
        </ItemCardGrid>
      </>,
    );
    expect(screen.getAllByRole('grid')[0]).toHaveStyle({
      gridTemplateColumns: 'repeat(auto-fill, minmax(22em, 1fr))',
    });
    expect(screen.getAllByRole('grid')[1]).toHaveClass('my-css-class');
  });
});
