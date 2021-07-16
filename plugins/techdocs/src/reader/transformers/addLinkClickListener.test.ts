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
import { addLinkClickListener } from './addLinkClickListener';

describe('addLinkClickListener', () => {
  it('calls onClick when a link has been clicked', async () => {
    const fn = jest.fn();
    const shadowDom = await createTestShadowDom(
      `
      <!DOCTYPE html>
      <html>
        <body>
          <a href="http://localhost:3000/docs/test">Link</a>
        </body>
      </html>
    `,
      {
        preTransformers: [],
        postTransformers: [
          addLinkClickListener({
            baseUrl: 'http://localhost:3000',
            onClick: fn,
          }),
        ],
      },
    );

    shadowDom.querySelector('a')?.click();

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when a link links to another baseUrl', async () => {
    const fn = jest.fn();
    const shadowDom = await createTestShadowDom(
      `
      <!DOCTYPE html>
      <html>
        <body>
          <a href="http://example.com/docs/test">Link</a>
        </body>
      </html>
    `,
      {
        preTransformers: [],
        postTransformers: [
          addLinkClickListener({
            baseUrl: 'http://localhost:3000',
            onClick: fn,
          }),
        ],
      },
    );

    shadowDom.querySelector('a')?.click();

    expect(fn).toHaveBeenCalledTimes(0);
  });
});
