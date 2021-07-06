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

import { createTestShadowDom } from '../../test-utils';
import { injectCss } from '../transformers';

describe('injectCss', () => {
  it('should inject style with passed css in head', () => {
    const html = `
        <html>
            <head></head>
            <body></body>
        </html>
    `;
    const injectedCss = '* {background-color: #fff}';

    const shadowDom = createTestShadowDom(html, {
      preTransformers: [injectCss({ css: injectedCss })],
      postTransformers: [],
    });

    const styleElement = shadowDom.querySelector('head > style');

    expect(styleElement).toBeTruthy();
    expect(styleElement!.innerHTML).toEqual(injectedCss);
  });
});
