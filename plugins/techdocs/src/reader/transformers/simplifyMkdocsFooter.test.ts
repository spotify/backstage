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

import { createTestShadowDom, FIXTURES } from '../../test-utils';
import { simplifyMkdocsFooter } from './simplifyMkdocsFooter';

describe('simplifyMkdocsFooter', () => {
  it('does not remove mkdocs copyright', () => {
    const shadowDom = createTestShadowDom(FIXTURES.FIXTURE_STANDARD_PAGE, {
      preTransformers: [],
      postTransformers: [],
    });

    expect(shadowDom.querySelector('.md-footer-copyright')).toBeTruthy();
  });

  it('does remove mkdocs copyright', () => {
    const shadowDom = createTestShadowDom(FIXTURES.FIXTURE_STANDARD_PAGE, {
      preTransformers: [simplifyMkdocsFooter()],
      postTransformers: [],
    });

    expect(shadowDom.querySelector('.md-footer-copyright')).toBeFalsy();
  });
});
