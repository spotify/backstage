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

import {
  mockCalverProject,
  mockReleaseBranch,
  mockReleaseCandidateCalver,
} from '../../test-helpers/test-helpers';
import { Info } from './Info';

jest.mock('../../contexts/ProjectContext', () => ({
  useProjectContext: () => ({
    project: mockCalverProject,
  }),
}));

describe('Info', () => {
  it('should return early if no latestRelease exists', async () => {
    const { findByText } = render(
      <Info
        latestRelease={mockReleaseCandidateCalver}
        releaseBranch={mockReleaseBranch}
        statsEnabled
      />,
    );

    expect(await findByText(mockReleaseBranch.name)).toMatchInlineSnapshot(`
      <span
        data-testid="grm--differ-next"
        style="font-weight: bold;"
      >
        rc/1.2.3
      </span>
    `);

    expect(
      await findByText(`${mockCalverProject.owner}/${mockCalverProject.repo}`),
    ).toMatchInlineSnapshot(`
      <span
        data-testid="grm--differ-next"
        style="font-weight: bold;"
      >
        mock_owner/mock_repo
      </span>
    `);

    expect(await findByText(mockCalverProject.versioningStrategy))
      .toMatchInlineSnapshot(`
      <span
        data-testid="grm--differ-next"
        style="font-weight: bold;"
      >
        calver
      </span>
    `);

    expect(await findByText(mockReleaseCandidateCalver.tagName))
      .toMatchInlineSnapshot(`
      <span
        data-testid="grm--differ-next"
        style="font-weight: bold;"
      >
        rc-2020.01.01_1
      </span>
    `);
  });
});
