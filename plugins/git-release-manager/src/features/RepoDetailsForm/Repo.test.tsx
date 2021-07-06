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
} from '../../test-helpers/test-helpers';
import { TEST_IDS } from '../../test-helpers/test-ids';
import { useProjectContext } from '../../contexts/ProjectContext';
import { Repo } from './Repo';

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

describe('Repo', () => {
  beforeEach(jest.clearAllMocks);

  it('should render select', async () => {
    const { getByTestId } = render(<Repo />);

    expect(getByTestId(TEST_IDS.form.repo.loading)).toBeInTheDocument();

    await waitFor(() => screen.getByTestId(TEST_IDS.form.repo.select));
    expect(getByTestId(TEST_IDS.form.repo.select)).toBeInTheDocument();
  });

  it('should render select for empty repo', async () => {
    (useProjectContext as jest.Mock).mockReturnValue({
      project: { ...mockCalverProject, repo: '' },
    });

    const { getAllByTestId, getByTestId } = render(<Repo />);

    expect(getByTestId(TEST_IDS.form.repo.loading)).toBeInTheDocument();

    await waitFor(() => screen.getAllByTestId(TEST_IDS.form.repo.empty));
    expect(getAllByTestId(TEST_IDS.form.repo.empty)).toMatchInlineSnapshot(`
      Array [
        <p
          class="MuiFormHelperText-root Mui-required"
          data-testid="grm--form--repo--empty"
        >
          Select a repository
        </p>,
        <p
          class="MuiFormHelperText-root Mui-required"
          data-testid="grm--form--repo--empty"
        >
          Custom queries can be made via the query param
           
          <strong>
            repo
          </strong>
        </p>,
      ]
    `);
  });

  it('should handle errors', async () => {
    (mockApiClient.getRepositories as jest.Mock).mockImplementationOnce(
      async () => {
        throw new Error('Kaboom');
      },
    );

    const { getByTestId } = render(<Repo />);

    expect(getByTestId(TEST_IDS.form.repo.loading)).toBeInTheDocument();
    await waitFor(() => screen.getByTestId(TEST_IDS.form.repo.error));
    expect(getByTestId(TEST_IDS.form.repo.error)).toMatchInlineSnapshot(`
      <p
        class="MuiFormHelperText-root Mui-error Mui-required"
        data-testid="grm--form--repo--error"
      >
        Encountered an error (
        Kaboom
        ")
      </p>
    `);
  });
});
