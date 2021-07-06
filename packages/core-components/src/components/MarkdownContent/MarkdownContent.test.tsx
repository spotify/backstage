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
import { renderWithEffects, wrapInTestApp } from '@backstage/test-utils';
import { MarkdownContent } from './MarkdownContent';

describe('<MarkdownContent />', () => {
  it('render MarkdownContent component', async () => {
    const rendered = await renderWithEffects(
      wrapInTestApp(
        <MarkdownContent content={'# H1\n' + '## H2\n' + '### H3'} />,
      ),
    );
    expect(rendered.getByText('H1', { selector: 'h1' })).toBeInTheDocument();
    expect(rendered.getByText('H2', { selector: 'h2' })).toBeInTheDocument();
    expect(rendered.getByText('H3', { selector: 'h3' })).toBeInTheDocument();
  });

  it('render MarkdownContent component with GitHub flavored Markdown dialect', async () => {
    const rendered = await renderWithEffects(
      wrapInTestApp(<MarkdownContent content="https://example.com" />),
    );
    expect(
      rendered.getByText('https://example.com', { selector: 'a' }),
    ).toBeInTheDocument();
  });

  it('Render MarkdownContent component with common mark dialect', async () => {
    const rendered = await renderWithEffects(
      wrapInTestApp(
        <MarkdownContent content="https://example.com" dialect="common-mark" />,
      ),
    );
    expect(
      rendered.getByText('https://example.com', { selector: 'p' }),
    ).toBeInTheDocument();
  });

  it('render MarkdownContent component with CodeSnippet for code blocks', async () => {
    const rendered = await renderWithEffects(
      wrapInTestApp(<MarkdownContent content="    jest(test: string);" />),
    );
    const fp1 = rendered.getByText('jest', { selector: 'span' });
    expect(fp1).toBeInTheDocument();
    expect(fp1.className).toEqual('hljs-function');
    const fp2 = rendered.getByText('(test: string)', { selector: 'span' });
    expect(fp2).toBeInTheDocument();
    expect(fp2.className).toEqual('hljs-function');
    expect(rendered.getByText(';', { selector: 'span' })).toBeInTheDocument();
  });
});
