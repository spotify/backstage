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

import TechDocsProgressBar from './TechDocsProgressBar';
import React from 'react';
import { render } from '@testing-library/react';
import { wrapInTestApp } from '@backstage/test-utils';
import { act } from 'react-dom/test-utils';

jest.useFakeTimers();

describe('<TechDocsProgressBar />', () => {
  it('should render a message if techdocs page takes more time to load', () => {
    const rendered = render(wrapInTestApp(<TechDocsProgressBar />));
    act(() => {
      jest.advanceTimersByTime(250);
    });
    expect(rendered.getByTestId('progress')).toBeInTheDocument();
    expect(rendered.queryByTestId('delay-reason')).toBeNull();
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(rendered.getByTestId('delay-reason')).toBeInTheDocument();
  });
});
