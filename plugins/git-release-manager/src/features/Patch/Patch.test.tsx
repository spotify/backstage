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
  mockReleaseBranch,
  mockCalverProject,
} from '../../test-helpers/test-helpers';
import { TEST_IDS } from '../../test-helpers/test-ids';
import { Patch } from './Patch';

jest.mock('../../contexts/ProjectContext', () => ({
  useProjectContext: () => ({
    project: mockCalverProject,
  }),
}));

describe('Patch', () => {
  it('should return early if no latestRelease exists', () => {
    const { getByTestId } = render(
      <Patch latestRelease={null} releaseBranch={mockReleaseBranch} />,
    );

    expect(
      getByTestId(TEST_IDS.components.noLatestRelease),
    ).toBeInTheDocument();
  });
});
