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
import { render, waitFor, screen } from '@testing-library/react';

import {
  mockApiClient,
  mockCalverProject,
  mockSearchCalver,
  mockUser,
} from '../../test-helpers/test-helpers';
import { TEST_IDS } from '../../test-helpers/test-ids';
import { useProjectContext } from '../../contexts/ProjectContext';
import { Owner } from './Owner';

jest.mock('react-router', () => ({
  useNavigate: jest.fn(),
  useLocation: jest.fn(() => ({
    search: mockSearchCalver,
  })),
}));
jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
  useApi: () => mockApiClient,
}));
jest.mock('../../contexts/ProjectContext', () => ({
  useProjectContext: jest.fn(() => ({
    project: mockCalverProject,
  })),
}));
jest.mock('../../contexts/UserContext', () => ({
  useUserContext: jest.fn(() => ({
    user: mockUser,
  })),
}));

describe('Owner', () => {
  beforeEach(jest.clearAllMocks);

  it('should render select', async () => {
    const { getByTestId } = render(<Owner />);

    expect(getByTestId(TEST_IDS.form.owner.loading)).toBeInTheDocument();

    await waitFor(() => screen.getByTestId(TEST_IDS.form.owner.select));
    expect(getByTestId(TEST_IDS.form.owner.select)).toBeInTheDocument();
  });

  it('should render select for empty owners', async () => {
    (useProjectContext as jest.Mock).mockReturnValue({
      project: { ...mockCalverProject, owner: '' },
    });

    const { getAllByTestId, getByTestId } = render(<Owner />);

    expect(getByTestId(TEST_IDS.form.owner.loading)).toBeInTheDocument();

    await waitFor(() => screen.getAllByTestId(TEST_IDS.form.owner.empty));
    expect(getAllByTestId(TEST_IDS.form.owner.empty)).toMatchInlineSnapshot(`
      Array [
        <p
          class="MuiFormHelperText-root Mui-required"
          data-testid="grm--form--owner--empty"
        >
          Select an owner (org or user)
        </p>,
        <p
          class="MuiFormHelperText-root Mui-required"
          data-testid="grm--form--owner--empty"
        >
          Custom queries can be made via the query param
           
          <strong>
            owner
          </strong>
        </p>,
      ]
    `);
  });

  it('should handle errors', async () => {
    (mockApiClient.getOwners as jest.Mock).mockImplementationOnce(async () => {
      throw new Error('Kaboom');
    });

    const { getByTestId } = render(<Owner />);

    expect(getByTestId(TEST_IDS.form.owner.loading)).toBeInTheDocument();
    await waitFor(() => screen.getByTestId(TEST_IDS.form.owner.error));
    expect(getByTestId(TEST_IDS.form.owner.error)).toMatchInlineSnapshot(`
      <p
        class="MuiFormHelperText-root Mui-error Mui-required"
        data-testid="grm--form--owner--error"
      >
        Encountered an error (
        Kaboom
        )
      </p>
    `);
  });
});
