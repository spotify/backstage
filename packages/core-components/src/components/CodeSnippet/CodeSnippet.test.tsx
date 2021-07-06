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
import { fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { renderInTestApp } from '@backstage/test-utils';

import { CodeSnippet } from './CodeSnippet';

const JAVASCRIPT = `
  const greeting = "Hello";
  const world = "World";
  const greet = person => gretting + " " + person + "!";
`;

const minProps = {
  text: JAVASCRIPT,
  language: 'javascript',
};

describe('<CodeSnippet />', () => {
  it('renders text without exploding', async () => {
    const { getByText } = await renderInTestApp(<CodeSnippet {...minProps} />);
    expect(getByText(/"Hello"/)).toBeInTheDocument();
    expect(getByText(/"World"/)).toBeInTheDocument();
  });

  it('renders without line numbers', async () => {
    const { queryByText } = await renderInTestApp(
      <CodeSnippet {...minProps} />,
    );
    expect(queryByText('1')).not.toBeInTheDocument();
    expect(queryByText('2')).not.toBeInTheDocument();
    expect(queryByText('3')).not.toBeInTheDocument();
  });

  it('renders with line numbers', async () => {
    const { getByText } = await renderInTestApp(
      <CodeSnippet {...minProps} showLineNumbers />,
    );
    expect(getByText('1')).toBeInTheDocument();
    expect(getByText('2')).toBeInTheDocument();
    expect(getByText('3')).toBeInTheDocument();
  });

  it('copy code using button', async () => {
    jest.useFakeTimers();
    document.execCommand = jest.fn();
    const { getByTitle } = await renderInTestApp(
      <CodeSnippet {...minProps} showCopyCodeButton />,
    );
    const button = getByTitle('Text copied to clipboard');
    fireEvent.click(button);
    act(() => {
      jest.runAllTimers();
    });
    expect(document.execCommand).toHaveBeenCalled();
    jest.useRealTimers();
  });
});
