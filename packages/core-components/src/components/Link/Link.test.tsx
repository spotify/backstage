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
import { render, fireEvent } from '@testing-library/react';
import { wrapInTestApp } from '@backstage/test-utils';
import { isExternalUri, Link } from './Link';
import { Route, Routes } from 'react-router';
import { act } from 'react-dom/test-utils';

describe('<Link />', () => {
  it('navigates using react-router', async () => {
    const testString = 'This is test string';
    const linkText = 'Navigate!';
    const { getByText } = render(
      wrapInTestApp(
        <Routes>
          <Link to="/test">{linkText}</Link>
          <Route path="/test" element={<p>{testString}</p>} />
        </Routes>,
      ),
    );
    expect(() => getByText(testString)).toThrow();
    await act(async () => {
      fireEvent.click(getByText(linkText));
    });
    expect(getByText(testString)).toBeInTheDocument();
  });

  describe('isExternalUri', () => {
    it.each([
      [true, 'http://'],
      [true, 'https://'],
      [true, 'https://some-host'],
      [true, 'https://some-host/path#fragment'],
      [true, 'https://some-host/path?param1=value'],
      [true, 'slack://'],
      [true, 'mailto:foo@example.org'],
      [true, 'ms-help://'],
      [true, 'ms.help://'],
      [true, 'ms+help://'],
      [false, '//'],
      [false, '123://'],
      [false, 'abc&xzy://'],
      [false, 'http'],
      [false, 'path/to'],
      [false, 'path/to/something#fragment'],
      [false, 'path/to/something?param1=value'],
      [false, '/path/to/something'],
      [false, '/path/to/something#fragment'],
    ])('should be %p when %p', (expected, uri) => {
      expect(isExternalUri(uri)).toBe(expected);
    });
  });
});
