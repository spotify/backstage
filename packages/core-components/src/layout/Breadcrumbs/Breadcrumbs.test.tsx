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
import { Typography } from '@material-ui/core';
import { fireEvent } from '@testing-library/react';
import React from 'react';
import { Link } from '../../components/Link';
import { Breadcrumbs } from './Breadcrumbs';

describe('<Breadcrumbs/>', () => {
  it('should render', async () => {
    const rendered = await renderInTestApp(
      <Breadcrumbs>
        <Link to="/">General Page</Link>
        <Typography>Current Page</Typography>
      </Breadcrumbs>,
    );
    expect(rendered.getByLabelText('breadcrumb')).toBeVisible();
    expect(rendered.getByText('General Page')).toBeVisible();
    expect(rendered.getByText('Current Page')).toBeVisible();
  });

  it('should render hidden breadcrumbs', async () => {
    const rendered = await renderInTestApp(
      <Breadcrumbs>
        <Link to="/">General Page</Link>
        <Link to="/">Second Page</Link>
        <Link to="/">Third Page</Link>
        <Link to="/">Fourth Page</Link>
        <Typography>Current page</Typography>
      </Breadcrumbs>,
    );
    expect(rendered.getByText('...')).toBeVisible();
    expect(rendered.queryByText('Third Page')).not.toBeInTheDocument();
    expect(rendered.queryByText('Fourth Page')).not.toBeInTheDocument();
    fireEvent.click(rendered.getByText('...'));
    expect(rendered.getByText('Third Page')).toBeVisible();
    expect(rendered.getByText('Fourth Page')).toBeVisible();
  });
});
