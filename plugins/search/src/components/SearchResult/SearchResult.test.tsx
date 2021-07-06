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
import { render, waitFor } from '@testing-library/react';

import { SearchResult } from './SearchResult';
import { useSearch } from '../SearchContext';

jest.mock('../SearchContext', () => ({
  ...jest.requireActual('../SearchContext'),
  useSearch: jest.fn().mockReturnValue({
    result: {},
  }),
}));

describe('SearchResult', () => {
  it('Progress rendered on Loading state', async () => {
    (useSearch as jest.Mock).mockReturnValueOnce({
      result: { loading: true },
    });

    const { getByRole } = render(<SearchResult>{() => <></>}</SearchResult>);

    await waitFor(() => {
      expect(getByRole('progressbar')).toBeInTheDocument();
    });
  });

  it('Alert rendered on Error state', async () => {
    const error = 'error';
    (useSearch as jest.Mock).mockReturnValueOnce({
      result: { loading: false, error },
    });

    const { getByRole } = render(<SearchResult>{() => <></>}</SearchResult>);

    await waitFor(() => {
      expect(getByRole('alert')).toHaveTextContent(
        `Error encountered while fetching search results. ${error}`,
      );
    });
  });

  it('On no result value state', async () => {
    (useSearch as jest.Mock).mockReturnValueOnce({
      result: { loading: false, error: '', value: undefined },
    });

    const { getByRole } = render(<SearchResult>{() => <></>}</SearchResult>);

    await waitFor(() => {
      expect(
        getByRole('heading', { name: 'Sorry, no results were found' }),
      ).toBeInTheDocument();
    });
  });

  it('On empty result value state', async () => {
    (useSearch as jest.Mock).mockReturnValueOnce({
      result: { loading: false, error: '', value: { results: [] } },
    });

    const { getByRole } = render(<SearchResult>{() => <></>}</SearchResult>);

    await waitFor(() => {
      expect(
        getByRole('heading', { name: 'Sorry, no results were found' }),
      ).toBeInTheDocument();
    });
  });

  it('Calls children with results set to result.value', () => {
    (useSearch as jest.Mock).mockReturnValueOnce({
      result: { loading: false, error: '', value: { results: [] } },
    });

    render(
      <SearchResult>
        {({ results }) => {
          expect(results).toEqual([]);
          return <></>;
        }}
      </SearchResult>,
    );
  });
});
