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

import { mockSearchSemver } from '../test-helpers/test-helpers';
import { useQueryHandler } from './useQueryHandler';

jest.mock('react-router', () => ({
  useLocation: jest.fn(() => ({
    search: mockSearchSemver,
  })),
}));

const TEST_ID = 'grm--use-query-handler';

const MockComponent = () => {
  const { getParsedQuery, getQueryParamsWithUpdates } = useQueryHandler();

  const { parsedQuery } = getParsedQuery();
  const { queryParams } = getQueryParamsWithUpdates({
    updates: [{ key: 'repo', value: 'updated_mock_repo' }],
  });

  return (
    <div data-testid={TEST_ID}>
      {JSON.stringify({ parsedQuery, queryParams }, null, 2)}
    </div>
  );
};

describe('useQueryHandler', () => {
  it('should get parsedQuery and queryParams', () => {
    const { getByTestId } = render(<MockComponent />);

    const result = getByTestId(TEST_ID).innerHTML;

    expect(result).toMatchInlineSnapshot(`
        "{
          \\"parsedQuery\\": {
            \\"versioningStrategy\\": \\"semver\\",
            \\"owner\\": \\"mock_owner\\",
            \\"repo\\": \\"mock_repo\\"
          },
          \\"queryParams\\": \\"versioningStrategy=semver&amp;owner=mock_owner&amp;repo=updated_mock_repo\\"
        }"
      `);
  });
});
