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

import { screen, waitFor } from '@testing-library/react';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import userEvent from '@testing-library/user-event';
import { configApiRef } from '@backstage/core-plugin-api';
import { ApiProvider, ConfigReader } from '@backstage/core-app-api';
import { rootRouteRef } from '../../plugin';
import {
  searchApiRef,
  SearchContextProvider,
} from '@backstage/plugin-search-react';

import { SearchModal } from './SearchModal';

const navigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => navigate,
}));

describe('SearchModal', () => {
  const configApiMock = new ConfigReader({ app: { title: 'Mock app' } });
  const searchApiMock = { query: jest.fn().mockResolvedValue({ results: [] }) };

  const apiRegistry = TestApiRegistry.from(
    [configApiRef, configApiMock],
    [searchApiRef, searchApiMock],
  );

  beforeEach(() => {
    navigate.mockClear();
    searchApiMock.query.mockClear();
  });

  const toggleModal = jest.fn();

  it('Should render the Modal correctly', async () => {
    await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <SearchModal open hidden={false} toggleModal={toggleModal} />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/search': rootRouteRef,
        },
      },
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(
      screen.queryByText('Sorry, no results were found'),
    ).not.toBeInTheDocument();
  });

  it('Should use parent search context if defined', async () => {
    const initialState = {
      term: 'term',
      filters: { filter: '' },
      types: ['type'],
      pageCursor: 'page cursor',
    };

    await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <SearchContextProvider initialState={initialState}>
          <SearchModal open hidden={false} toggleModal={toggleModal} />
        </SearchContextProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/search': rootRouteRef,
        },
      },
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(searchApiMock.query).toHaveBeenCalledWith(initialState, {
      signal: expect.any(AbortSignal),
    });
  });

  it('Should create a local search context if a parent is not defined', async () => {
    await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <SearchModal open hidden={false} toggleModal={toggleModal} />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/search': rootRouteRef,
        },
      },
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const input = screen.getByLabelText<HTMLInputElement>('Search');
    await userEvent.type(input, 'text');

    await waitFor(() => {
      expect(searchApiMock.query).toHaveBeenCalledWith(
        {
          term: 'text',
          filters: {},
          types: [],
          pageCursor: undefined,
        },
        { signal: expect.any(AbortSignal) },
      );
    });
  });

  it('Should render a custom Modal correctly', async () => {
    await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <SearchModal open hidden={false} toggleModal={toggleModal}>
          {() => <div>Custom Search Modal</div>}
        </SearchModal>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/search': rootRouteRef,
        },
      },
    );

    expect(screen.getByText('Custom Search Modal')).toBeInTheDocument();
  });

  it('Calls toggleModal handler', async () => {
    await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <SearchModal open toggleModal={toggleModal} />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/search': rootRouteRef,
        },
      },
    );

    await userEvent.keyboard('{Escape}');
    expect(toggleModal).toHaveBeenCalledTimes(1);
  });

  it('should focus on its search bar when opened', async () => {
    await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <SearchModal open hidden={false} toggleModal={toggleModal} />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/search': rootRouteRef,
        },
      },
    );

    expect(screen.getByLabelText('Search')).toHaveFocus();
  });

  it("Don't wait query debounce time when enter is pressed", async () => {
    const initialState = {
      term: 'term',
      filters: {},
      types: [],
      pageCursor: '',
    };

    await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <SearchContextProvider initialState={initialState}>
          <SearchModal open hidden={false} toggleModal={toggleModal} />
        </SearchContextProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/search': rootRouteRef,
        },
      },
    );

    expect(searchApiMock.query).toHaveBeenCalledWith(
      expect.objectContaining({ term: 'term' }),
      { signal: expect.any(AbortSignal) },
    );

    const input = screen.getByLabelText<HTMLInputElement>('Search');
    await userEvent.clear(input);
    await userEvent.type(input, 'new term{enter}');

    expect(navigate).toHaveBeenCalledWith('/search?query=new term');
  });

  it('should navigate with correct search terms to full results', async () => {
    const initialState = {
      term: 'term',
      filters: {},
      types: [],
      pageCursor: '',
    };

    await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <SearchContextProvider initialState={initialState}>
          <SearchModal open hidden={false} toggleModal={toggleModal} />
        </SearchContextProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/search': rootRouteRef,
        },
      },
    );

    expect(searchApiMock.query).toHaveBeenCalledWith(
      expect.objectContaining({ term: 'term' }),
      { signal: expect.any(AbortSignal) },
    );

    const fullResultsBtn = screen.getByRole('button', {
      name: /view full results/i,
    });
    await userEvent.click(fullResultsBtn);

    expect(navigate).toHaveBeenCalledWith('/search?query=term');
  });

  it('should completely unmount the Dialog from DOM when open prop is false', async () => {
    await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <SearchModal open={false} hidden={false} toggleModal={toggleModal} />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/search': rootRouteRef,
        },
      },
    );

    // Dialog should not exist in the DOM at all (unmounted, not just hidden)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should completely unmount the Dialog from DOM when hidden prop is true', async () => {
    await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <SearchModal open hidden toggleModal={toggleModal} />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/search': rootRouteRef,
        },
      },
    );

    // Dialog should not exist in the DOM at all (unmounted, not just hidden)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
