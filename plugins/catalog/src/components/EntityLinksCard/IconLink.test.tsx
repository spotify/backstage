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

import { lightTheme } from '@backstage/theme';
import { ThemeProvider } from '@material-ui/core';
import CloudIcon from '@material-ui/icons/Cloud';
import { render } from '@testing-library/react';
import React from 'react';
import { IconLink } from './IconLink';

describe('IconLink', () => {
  it('should render an icon link', () => {
    const rendered = render(
      <ThemeProvider theme={lightTheme}>
        <IconLink
          href="https://example.com"
          text="I am Link"
          Icon={CloudIcon}
        />
      </ThemeProvider>,
    );

    expect(rendered.queryByText('I am Link')).toBeInTheDocument();
  });
});
