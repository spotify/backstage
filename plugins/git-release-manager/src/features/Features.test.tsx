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
import { render, act, waitFor } from '@testing-library/react';

import { Features } from './Features';
import { mockApiClient, mockCalverProject } from '../test-helpers/test-helpers';
import { TEST_IDS } from '../test-helpers/test-ids';

jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
  useApi: () => mockApiClient,
}));
jest.mock('../contexts/ProjectContext', () => ({
  useProjectContext: () => ({
    project: mockCalverProject,
  }),
}));

describe('Features', () => {
  it('should omit features omitted via configuration', async () => {
    const { getByTestId } = render(
      <Features
        features={{
          info: { omit: false },
          createRc: { omit: true },
          promoteRc: { omit: true },
          patch: { omit: true },
        }}
      />,
    );

    await act(async () => {
      await waitFor(() => getByTestId(TEST_IDS.info.info));
    });

    expect(getByTestId(TEST_IDS.info.info)).toMatchInlineSnapshot(`
      <div
        class="MuiBox-root MuiBox-root-9"
        data-testid="grm--info"
      >
        <h6
          class="MuiTypography-root MuiTypography-h6"
        >
          Terminology
        </h6>
        <p
          class="MuiTypography-root MuiTypography-body1"
        >
          <strong>
            Git
          </strong>
          : The source control system where releases reside in a practical sense. Read more about
           
          <a
            class="MuiTypography-root MuiLink-root MuiLink-underlineHover MuiTypography-colorPrimary"
            href="https://docs.github.com/en/github/administering-a-repository/managing-releases-in-a-repository"
            rel="noopener"
            target="_blank"
            to="https://docs.github.com/en/github/administering-a-repository/managing-releases-in-a-repository"
          >
            Git releases
          </a>
          .
        </p>
        <p
          class="MuiTypography-root MuiTypography-body1"
        >
          <strong>
            Release Candidate
          </strong>
          : A Git 
          <i>
            prerelease
          </i>
           intended primarily for internal testing
        </p>
        <p
          class="MuiTypography-root MuiTypography-body1"
        >
          <strong>
            Release Version
          </strong>
          : A Git release intended for end users
        </p>
      </div>
    `);
  });
});
