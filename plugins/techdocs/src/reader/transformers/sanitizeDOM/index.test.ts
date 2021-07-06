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

import { createTestShadowDom, FIXTURES } from '../../../test-utils';
import { Transformer } from '../index';
import { sanitizeDOM } from '../sanitizeDOM';

const injectMaliciousLink = (): Transformer => dom => {
  const link = document.createElement('a');
  link.setAttribute('id', 'test-malicious-link');
  link.setAttribute('onclick', 'alert("Hello world");');
  dom.querySelector('body')?.appendChild(link);
  return dom;
};

describe('sanitizeDOM', () => {
  it('contains a script tag', () => {
    const shadowDom = createTestShadowDom(FIXTURES.FIXTURE_STANDARD_PAGE);

    expect(shadowDom.querySelectorAll('script').length).toBeGreaterThan(0);
  });

  it('does not contain a script tag', () => {
    const shadowDom = createTestShadowDom(FIXTURES.FIXTURE_STANDARD_PAGE, {
      preTransformers: [sanitizeDOM()],
      postTransformers: [],
    });

    expect(shadowDom.querySelectorAll('script').length).toBe(0);
  });

  it('contains link with a onClick attribute', () => {
    const shadowDom = createTestShadowDom(FIXTURES.FIXTURE_STANDARD_PAGE, {
      preTransformers: [injectMaliciousLink()],
      postTransformers: [],
    });

    expect(
      shadowDom.querySelector('#test-malicious-link')?.hasAttribute('onclick'),
    ).toBeTruthy();
  });

  it('does not contain link with a onClick attribute', () => {
    const shadowDom = createTestShadowDom(FIXTURES.FIXTURE_STANDARD_PAGE, {
      preTransformers: [sanitizeDOM()],
      postTransformers: [],
    });

    expect(
      shadowDom.querySelector('#test-malicious-link')?.hasAttribute('onclick'),
    ).toBeFalsy();
  });

  it('removes style tags', () => {
    const html = `
      <html>
        <head>
          <style>* {color: #f0f;}<style>
        </head>
        <body>
        </body>
      </html>
    `;

    const shadowDom = createTestShadowDom(html, {
      preTransformers: [sanitizeDOM()],
      postTransformers: [],
    });

    expect(shadowDom.querySelectorAll('style').length).toEqual(0);
  });

  it('does not remove link tags', () => {
    const html = `
      <html>
        <head>
          <link rel="stylesheet" href="style.css">
        </head>
        <body>
        </body>
      </html>
    `;

    const shadowDom = createTestShadowDom(html, {
      preTransformers: [sanitizeDOM()],
      postTransformers: [],
    });

    expect(shadowDom.querySelectorAll('link').length).toEqual(1);
  });
});
