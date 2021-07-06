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

import { Differ } from './Differ';
import { TEST_IDS } from '../test-helpers/test-ids';
import {
  mockReleaseCandidateCalver,
  mockReleaseVersionCalver,
  mockReleaseVersionSemver,
} from '../test-helpers/test-helpers';

describe('Differ', () => {
  it('should render icon and `none` for missing current & next', () => {
    const { getByTestId, queryByTestId } = render(<Differ icon="branch" />);

    const icon = getByTestId(TEST_IDS.components.differ.icons.branch);
    const current = queryByTestId(TEST_IDS.components.differ.current);
    const next = queryByTestId(TEST_IDS.components.differ.next);

    expect(icon).toBeInTheDocument();
    expect(current).toMatchInlineSnapshot(`null`);
    expect(next).not.toBeInTheDocument();
  });

  it('should render icon & current for missing next', () => {
    const { getByTestId, queryByTestId } = render(
      <Differ icon="branch" current={mockReleaseVersionSemver.tagName} />,
    );

    const icon = getByTestId(TEST_IDS.components.differ.icons.branch);
    const current = getByTestId(TEST_IDS.components.differ.current);
    const next = queryByTestId(TEST_IDS.components.differ.next);

    expect(icon).toBeInTheDocument();
    expect(current.innerHTML).toMatchInlineSnapshot(`"version-1.2.3"`);
    expect(next).not.toBeInTheDocument();
  });

  it('should render icon & current & next (with seperator)', () => {
    const { getByTestId, queryByTestId } = render(
      <Differ
        icon="branch"
        current={mockReleaseCandidateCalver.tagName}
        next={mockReleaseVersionCalver.tagName}
      />,
    );

    const icon = getByTestId(TEST_IDS.components.differ.icons.branch);
    const current = getByTestId(TEST_IDS.components.differ.current);
    const next = queryByTestId(TEST_IDS.components.differ.next);

    expect(icon).toBeInTheDocument();
    expect(current.innerHTML).toMatchInlineSnapshot(`"rc-2020.01.01_1"`);
    expect(next?.innerHTML).toMatchInlineSnapshot(`"version-2020.01.01_1"`);
  });
});
