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
import { render, fireEvent, act } from '@testing-library/react';
import { wrapInTestApp } from '@backstage/test-utils';
import { Button } from './Button';
import { Route, Routes } from 'react-router';

describe('<Button />', () => {
  it('navigates using react-router', async () => {
    const testString = 'This is test string';
    const buttonLabel = 'Navigate!';
    const { getByText } = render(
      wrapInTestApp(
        <Routes>
          <Route path="/test" element={<p>{testString}</p>} />
          <Button to="/test">{buttonLabel}</Button>
        </Routes>,
      ),
    );

    expect(() => getByText(testString)).toThrow();
    await act(async () => {
      fireEvent.click(getByText(buttonLabel));
    });
    expect(getByText(testString)).toBeInTheDocument();
  });
});
