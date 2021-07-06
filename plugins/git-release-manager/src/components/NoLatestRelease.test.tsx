/*
 * Copyright 2021 The Backstage Authors
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

import { NoLatestRelease } from './NoLatestRelease';

describe('NoLatestRelease', () => {
  it('render NoLatestRelease', () => {
    const { container } = render(<NoLatestRelease />);

    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="MuiBox-root MuiBox-root-1"
        >
          <div
            class="MuiPaper-root MuiAlert-root MuiAlert-standardWarning MuiPaper-elevation0"
            data-testid="grm--no-latest-release"
            role="alert"
          >
            <div
              class="MuiAlert-icon"
            >
              <svg
                aria-hidden="true"
                class="MuiSvgIcon-root MuiSvgIcon-fontSizeInherit"
                focusable="false"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"
                />
              </svg>
            </div>
            <div
              class="MuiAlert-message"
            >
              Unable to find any Release
            </div>
          </div>
        </div>
      </div>
    `);
  });
});
