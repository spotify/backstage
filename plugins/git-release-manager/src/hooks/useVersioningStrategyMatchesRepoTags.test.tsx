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
  mockReleaseVersionCalver,
  mockReleaseVersionSemver,
  mockSemverProject,
} from '../test-helpers/test-helpers';
import { Project } from '../contexts/ProjectContext';
import { useVersioningStrategyMatchesRepoTags } from './useVersioningStrategyMatchesRepoTags';

const TEST_ID = 'grm--use-versioning-strategy-matches-repo-tags';
const MATCH = 'match ✅';
const NO_MATCH = 'NO match ❌';

const MockComponent = ({
  project,
  latestReleaseTagName,
  repositoryName,
}: {
  project: Project;
  latestReleaseTagName?: string;
  repositoryName?: string;
}) => {
  const { versioningStrategyMatches } = useVersioningStrategyMatchesRepoTags({
    project,
    latestReleaseTagName,
    repositoryName,
  });

  return (
    <div data-testid={TEST_ID}>
      {versioningStrategyMatches ? MATCH : NO_MATCH}
    </div>
  );
};

describe('useVersioningStrategyMatchesRepoTags', () => {
  it('should NOT match for missing latestReleaseTagName & repositoryName', () => {
    const { getByTestId } = render(
      <MockComponent project={mockSemverProject} />,
    );

    const result = getByTestId(TEST_ID).innerHTML;

    expect(result).toEqual(NO_MATCH);
  });

  it('should NOT match for mismatching versioning strategies', () => {
    const { getByTestId } = render(
      <MockComponent
        project={mockSemverProject}
        repositoryName={mockSemverProject.repo}
        latestReleaseTagName={mockReleaseVersionCalver.tagName}
      />,
    );

    const result = getByTestId(TEST_ID).innerHTML;

    expect(result).toEqual(NO_MATCH);
  });

  it('should match for matching repositories with same versioning strategy', () => {
    const { getByTestId } = render(
      <MockComponent
        project={mockSemverProject}
        repositoryName={mockSemverProject.repo}
        latestReleaseTagName={mockReleaseVersionSemver.tagName}
      />,
    );

    const result = getByTestId(TEST_ID).innerHTML;

    expect(result).toEqual(MATCH);
  });
});
