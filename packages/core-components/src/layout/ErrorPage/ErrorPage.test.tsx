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
import { ErrorPage } from './ErrorPage';
import { renderInTestApp } from '@backstage/test-utils';

describe('<ErrorPage/>', () => {
  it('should render with status code, status message and go back link', async () => {
    const { getByText, getByTestId } = await renderInTestApp(
      <ErrorPage status="404" statusMessage="PAGE NOT FOUND" />,
    );
    expect(getByText(/page not found/i)).toBeInTheDocument();
    expect(getByText(/404/i)).toBeInTheDocument();
    expect(
      getByText(/looks like someone dropped the mic!/i),
    ).toBeInTheDocument();
    expect(getByTestId('go-back-link')).toBeInTheDocument();
  });
});
