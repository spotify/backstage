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
  mockNextGitInfoSemver,
  mockReleaseBranch,
  mockReleaseCandidateCalver,
  mockReleaseVersionCalver,
  mockSemverProject,
} from '../../test-helpers/test-helpers';
import { CreateReleaseCandidate } from './CreateReleaseCandidate';
import { TEST_IDS } from '../../test-helpers/test-ids';
import { useCreateReleaseCandidate } from './hooks/useCreateReleaseCandidate';
import { useProjectContext } from '../../contexts/ProjectContext';

jest.mock('../../contexts/ProjectContext', () => ({
  useProjectContext: jest.fn(() => ({
    project: mockCalverProject,
  })),
}));
jest.mock('../../helpers/getReleaseCandidateGitInfo', () => ({
  getReleaseCandidateGitInfo: () => mockNextGitInfoSemver,
}));
jest.mock('./hooks/useCreateReleaseCandidate', () => ({
  useCreateReleaseCandidate: () =>
    ({
      run: jest.fn(),
      responseSteps: [],
      progress: 0,
      runInvoked: false,
    } as ReturnType<typeof useCreateReleaseCandidate>),
}));

describe('CreateReleaseCandidate', () => {
  it('should display CTA', () => {
    const { getByTestId } = render(
      <CreateReleaseCandidate
        defaultBranch="mockDefaultBranch"
        latestRelease={mockReleaseCandidateCalver}
        releaseBranch={mockReleaseBranch}
      />,
    );

    expect(getByTestId(TEST_IDS.createRc.cta)).toBeInTheDocument();
  });

  it('should display select element for semver', () => {
    (useProjectContext as jest.Mock).mockReturnValue({
      project: mockSemverProject,
    });

    const { getByTestId } = render(
      <CreateReleaseCandidate
        defaultBranch="mockDefaultBranch"
        latestRelease={mockReleaseVersionCalver}
        releaseBranch={mockReleaseBranch}
      />,
    );

    expect(getByTestId(TEST_IDS.createRc.semverSelect)).toBeInTheDocument();
  });
});
