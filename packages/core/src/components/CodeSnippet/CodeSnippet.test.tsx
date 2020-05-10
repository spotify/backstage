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
import { render } from '@testing-library/react';
import { wrapInThemedTestApp } from '@backstage/test-utils';

import CodeSnippet from './CodeSnippet';

const javascript = `const greeting = "Hello";
const world = "World";

const greet = person => gretting + " " + person + "!";
`;

const minProps = {
  text: javascript,
  language: 'javascript',
};

describe('<CodeSnippet />', () => {
  it('renders text without exploding', () => {
    const { getByText } = render(
      wrapInThemedTestApp(<CodeSnippet {...minProps} />),
    );
    expect(getByText(/"Hello"/)).toBeInTheDocument();
    expect(getByText(/"World"/)).toBeInTheDocument();
  });

  it('renders without line numbers', () => {
    const { queryByText } = render(
      wrapInThemedTestApp(<CodeSnippet {...minProps} />),
    );
    expect(queryByText('1')).not.toBeInTheDocument();
    expect(queryByText('2')).not.toBeInTheDocument();
    expect(queryByText('3')).not.toBeInTheDocument();
    expect(queryByText('4')).not.toBeInTheDocument();
  });

  it('renders with line numbers', () => {
    const { getByText } = render(
      wrapInThemedTestApp(<CodeSnippet {...minProps} showLineNumbers />),
    );
    expect(getByText(/1/)).toBeInTheDocument();
    expect(getByText(/2/)).toBeInTheDocument();
    expect(getByText(/3/)).toBeInTheDocument();
    expect(getByText(/4/)).toBeInTheDocument();
  });
});
