/*
 * Copyright 2022 The Backstage Authors
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

import { waitFor } from '@testing-library/react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { createPlugin } from '@backstage/core-plugin-api';

import { searchApiRef } from '../../api';
import { useSearch } from '../../context';
import { createSearchResultListItemExtension } from '../../extensions';

import { SearchResult } from './SearchResult';

jest.mock('../../context', () => ({
  ...jest.requireActual('../../context'),
  useSearch: jest.fn().mockReturnValue({
    result: {},
  }),
}));

describe('SearchResult', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Progress rendered on Loading state', async () => {
    (useSearch as jest.Mock).mockReturnValue({
      result: { loading: true },
    });

    const { getByRole } = await renderInTestApp(
      <SearchResult>{() => <></>}</SearchResult>,
    );

    await waitFor(() => {
      expect(getByRole('progressbar')).toBeInTheDocument();
    });
  });

  it('Alert rendered on Error state', async () => {
    const error = new Error('some error');
    (useSearch as jest.Mock).mockReturnValue({
      result: { loading: false, error },
    });

    const { getByRole } = await renderInTestApp(
      <SearchResult>{() => <></>}</SearchResult>,
    );

    await waitFor(() => {
      expect(getByRole('alert')).toHaveTextContent(
        new RegExp(`Error encountered while fetching search results.*${error}`),
      );
    });
  });

  it('On no result value state', async () => {
    (useSearch as jest.Mock).mockReturnValue({
      result: { loading: false, error: '', value: undefined },
    });

    const { queryByRole } = await renderInTestApp(
      <SearchResult>{() => <></>}</SearchResult>,
    );

    expect(
      queryByRole('heading', { name: 'Sorry, no results were found' }),
    ).not.toBeInTheDocument();
  });

  it('On empty result value state', async () => {
    (useSearch as jest.Mock).mockReturnValue({
      result: { loading: false, error: '', value: { results: [] } },
    });

    const { getByRole } = await renderInTestApp(
      <SearchResult>{() => <></>}</SearchResult>,
    );

    await waitFor(() => {
      expect(
        getByRole('heading', { name: 'Sorry, no results were found' }),
      ).toBeInTheDocument();
    });
  });

  it('On empty result value state with custom component', async () => {
    (useSearch as jest.Mock).mockReturnValue({
      result: { loading: false, error: '', value: { results: [] } },
    });

    const { getByText } = await renderInTestApp(
      <SearchResult noResultsComponent={<>No results found</>}>
        {() => <></>}
      </SearchResult>,
    );

    await waitFor(() => {
      expect(getByText('No results found')).toBeInTheDocument();
    });
  });

  it('Calls children with results set to result.value', async () => {
    (useSearch as jest.Mock).mockReturnValue({
      result: {
        loading: false,
        error: '',
        value: {
          totalCount: 1,
          results: [
            {
              type: 'some-type',
              document: {
                title: 'some-title',
                text: 'some-text',
                location: 'some-location',
              },
            },
          ],
        },
      },
    });

    const { getByText } = await renderInTestApp(
      <SearchResult>
        {({ results }) => {
          return <>Results {results.length}</>;
        }}
      </SearchResult>,
    );

    expect(getByText('Results 1')).toBeInTheDocument();
  });

  it('Renders results from api', async () => {
    const results = [
      {
        type: 'some-type',
        document: {
          title: 'some-title',
          text: 'some-text',
          location: 'some-location',
        },
      },
    ];
    const query = jest.fn().mockResolvedValue({ results });
    await renderInTestApp(
      <TestApiProvider apis={[[searchApiRef, { query }]]}>
        <SearchResult query={{ types: ['techdocs'] }}>
          {value => {
            expect(value.results).toStrictEqual(results);
            return <></>;
          }}
        </SearchResult>
      </TestApiProvider>,
    );

    expect(query).toHaveBeenCalledWith({
      term: '',
      filters: {},
      types: ['techdocs'],
    });
  });

  it('Renders using search result item extensions', async () => {
    (useSearch as jest.Mock).mockReturnValue({
      result: {
        loading: false,
        error: '',
        value: {
          totalCount: 1,
          results: [
            {
              type: 'some-type',
              document: {
                title: 'some-title',
                text: 'some-text',
                location: 'some-location',
              },
            },
          ],
        },
      },
    });

    const { getByText, rerender } = await renderInTestApp(<SearchResult />);

    expect(getByText('some-title')).toBeInTheDocument();

    const SearchResultExtension = createPlugin({
      id: 'plugin',
    }).provide(
      createSearchResultListItemExtension({
        name: 'SearchResultExtension',
        component: async () => props => <>Result: {props.result?.title}</>,
      }),
    );

    rerender(
      <SearchResult>
        <SearchResultExtension />
      </SearchResult>,
    );

    await waitFor(() => {
      expect(getByText('Result: some-title')).toBeInTheDocument();
    });
  });
});
