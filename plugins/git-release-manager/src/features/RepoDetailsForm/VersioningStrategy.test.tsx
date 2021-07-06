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
import { render, fireEvent } from '@testing-library/react';

import {
  mockSemverProject,
  mockSearchCalver,
} from '../../test-helpers/test-helpers';
import { VersioningStrategy } from './VersioningStrategy';

const mockNavigate = jest.fn();

jest.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
  useLocation: jest.fn(() => ({
    search: mockSearchCalver,
  })),
}));
jest.mock('../../contexts/ProjectContext', () => ({
  useProjectContext: () => ({
    project: mockSemverProject,
  }),
}));

describe('Repo', () => {
  beforeEach(jest.clearAllMocks);

  it('should render radio group with default values and handle changes', async () => {
    const { getByLabelText } = render(<VersioningStrategy />);

    const radio1 = getByLabelText('Semantic versioning');
    const radio2 = getByLabelText('Calendar versioning');

    expect(radio1).toBeChecked();
    expect(radio2).not.toBeChecked();

    fireEvent.click(radio2);
    expect(mockNavigate.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "?versioningStrategy=calver&owner=mock_owner&repo=mock_repo",
          Object {
            "replace": true,
          },
        ],
      ]
    `);
  });
});
