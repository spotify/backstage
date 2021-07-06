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

import { createTestShadowDom, getSample } from '../../test-utils';
import { rewriteDocLinks } from '../transformers';
import { normalizeUrl } from './rewriteDocLinks';

describe('rewriteDocLinks', () => {
  it('should not do anything', () => {
    const shadowDom = createTestShadowDom(`
        <a href="http://example.org/">Test</a>
        <a href="../example">Test</a>
        <a href="example-docs">Test</a>
        <a href="example-docs/example-page">Test Sub Page</a>
    `);

    expect(getSample(shadowDom, 'a', 'href', 6)).toEqual([
      'http://example.org/',
      '../example',
      'example-docs',
      'example-docs/example-page',
    ]);
  });

  it('should transform a href with localhost as baseUrl', () => {
    const shadowDom = createTestShadowDom(
      `
        <a href="http://example.org/">Test</a>
        <a href="../example">Test</a>
        <a href="example-docs">Test</a>
        <a href="example-docs/example-page">Test Sub Page</a>
    `,
      {
        preTransformers: [rewriteDocLinks()],
        postTransformers: [],
      },
    );

    expect(getSample(shadowDom, 'a', 'href', 6)).toEqual([
      'http://example.org/',
      'http://localhost/example',
      'http://localhost/example-docs',
      'http://localhost/example-docs/example-page',
    ]);
  });

  it('should rewrite non-parseable URLs as text', () => {
    const expectedText = `www.my-internet.[top-level-domain]/pathname/[URLkey]`;
    const shadowDom = createTestShadowDom(
      `<a href="http://${expectedText}">${expectedText}</a>`,
      {
        preTransformers: [rewriteDocLinks()],
        postTransformers: [],
      },
    );

    // There should be no <a> tags, but the link text should remain.
    expect(getSample(shadowDom, 'a', 'href')).toEqual([]);
    expect(shadowDom.innerHTML).toContain(expectedText);
  });
});

describe('normalizeUrl', () => {
  it.each([
    ['http://example.org', 'http://example.org/'],
    ['http://example.org/', 'http://example.org/'],
    ['http://example.org/folder', 'http://example.org/folder/'],
    ['http://example.org/folder/', 'http://example.org/folder/'],
    ['http://example.org/folder#intro', 'http://example.org/folder/#intro'],
    ['http://example.org/folder/#intro', 'http://example.org/folder/#intro'],
    ['http://example.org/folder#', 'http://example.org/folder/#'],
    ['http://example.org/page.html', 'http://example.org/page.html'],
  ])('should handle %s', (url, expected) => {
    expect(normalizeUrl(url)).toEqual(expected);
  });
});
