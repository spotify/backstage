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

import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';
import { NotFoundError } from '@backstage/errors';
import { act, renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { techdocsStorageApiRef } from '../../api';
import {
  calculateDisplayState,
  reducer,
  useReaderState,
} from './useReaderState';

describe('useReaderState', () => {
  let Wrapper: React.ComponentType;

  const techdocsStorageApi: jest.Mocked<typeof techdocsStorageApiRef.T> = {
    getApiOrigin: jest.fn(),
    getBaseUrl: jest.fn(),
    getBuilder: jest.fn(),
    getEntityDocs: jest.fn(),
    getStorageUrl: jest.fn(),
    syncEntityDocs: jest.fn(),
  };

  beforeEach(() => {
    const apis = ApiRegistry.with(techdocsStorageApiRef, techdocsStorageApi);

    Wrapper = ({ children }: { children?: React.ReactNode }) => (
      <ApiProvider apis={apis}>{children}</ApiProvider>
    );
  });

  afterEach(() => jest.resetAllMocks());

  describe('calculateDisplayState', () => {
    it.each`
      contentLoading | content      | activeSyncState         | expected
      ${true}        | ${''}        | ${''}                   | ${'CHECKING'}
      ${false}       | ${undefined} | ${'CHECKING'}           | ${'CHECKING'}
      ${false}       | ${undefined} | ${'BUILDING'}           | ${'INITIAL_BUILD'}
      ${false}       | ${undefined} | ${'BUILD_READY'}        | ${'CONTENT_NOT_FOUND'}
      ${false}       | ${undefined} | ${'BUILD_READY_RELOAD'} | ${'CHECKING'}
      ${false}       | ${undefined} | ${'UP_TO_DATE'}         | ${'CONTENT_NOT_FOUND'}
      ${false}       | ${undefined} | ${'ERROR'}              | ${'CONTENT_NOT_FOUND'}
      ${false}       | ${'asdf'}    | ${'CHECKING'}           | ${'CONTENT_FRESH'}
      ${false}       | ${'asdf'}    | ${'BUILDING'}           | ${'CONTENT_STALE_REFRESHING'}
      ${false}       | ${'asdf'}    | ${'BUILD_READY'}        | ${'CONTENT_STALE_READY'}
      ${false}       | ${'asdf'}    | ${'BUILD_READY_RELOAD'} | ${'CHECKING'}
      ${false}       | ${'asdf'}    | ${'UP_TO_DATE'}         | ${'CONTENT_FRESH'}
      ${false}       | ${'asdf'}    | ${'ERROR'}              | ${'CONTENT_STALE_ERROR'}
    `(
      'should, when contentLoading=$contentLoading and content="$content" and activeSyncState=$activeSyncState, resolve to $expected',
      ({ contentLoading, content, activeSyncState, expected }) => {
        expect(
          calculateDisplayState({
            contentLoading,
            content,
            activeSyncState,
          }),
        ).toEqual(expected);
      },
    );
  });

  describe('reducer', () => {
    const oldState: Parameters<typeof reducer>[0] = {
      activeSyncState: 'CHECKING',
      contentLoading: false,
      path: '',
      buildLog: ['1', '2'],
    };

    it('should return a copy of the state', () => {
      expect(reducer(oldState, { type: 'content', path: '/' })).toEqual({
        activeSyncState: 'CHECKING',
        contentLoading: false,
        path: '/',
        buildLog: ['1', '2'],
      });

      expect(oldState).toEqual({
        activeSyncState: 'CHECKING',
        contentLoading: false,
        path: '',
        buildLog: ['1', '2'],
      });
    });

    it.each`
      type                | oldActiveSyncState      | newActiveSyncState
      ${'contentLoading'} | ${'BUILD_READY'}        | ${'UP_TO_DATE'}
      ${'contentLoading'} | ${'BUILD_READY_RELOAD'} | ${'UP_TO_DATE'}
      ${'content'}        | ${'BUILD_READY'}        | ${'UP_TO_DATE'}
      ${'content'}        | ${'BUILD_READY_RELOAD'} | ${'UP_TO_DATE'}
      ${'sync'}           | ${'BUILD_READY'}        | ${undefined /* undefined, because we don't set an input */}
      ${'sync'}           | ${'BUILD_READY_RELOAD'} | ${undefined /* undefined, because we don't set an input */}
    `(
      'should, when type=$type and activeSyncState=$oldActiveSyncState, set activeSyncState=$newActiveSyncState',
      ({ type, oldActiveSyncState, newActiveSyncState }) => {
        expect(
          reducer(
            {
              ...oldState,
              activeSyncState: oldActiveSyncState,
            },
            { type },
          ).activeSyncState,
        ).toEqual(newActiveSyncState);
      },
    );

    describe('"contentLoading" action', () => {
      it('should set loading', () => {
        expect(
          reducer(oldState, {
            type: 'contentLoading',
          }),
        ).toEqual({
          ...oldState,
          contentLoading: true,
        });
      });

      it('should keep content', () => {
        expect(
          reducer(
            {
              ...oldState,
              content: 'some-old-content',
            },
            {
              type: 'contentLoading',
            },
          ),
        ).toEqual({
          ...oldState,
          contentLoading: true,
          content: 'some-old-content',
        });
      });

      it('should reset errors', () => {
        expect(
          reducer(
            {
              ...oldState,
              contentError: new Error(),
            },
            {
              type: 'contentLoading',
            },
          ),
        ).toEqual({
          ...oldState,
          contentLoading: true,
        });
      });
    });

    describe('"content" action', () => {
      it('should set content', () => {
        expect(
          reducer(
            {
              ...oldState,
              contentLoading: true,
              contentError: new Error(),
            },
            {
              type: 'content',
              content: 'asdf',
            },
          ),
        ).toEqual({
          ...oldState,
          contentLoading: false,
          content: 'asdf',
        });
      });

      it('should set content and update path', () => {
        expect(
          reducer(
            {
              ...oldState,
              contentLoading: true,
            },
            {
              type: 'content',
              content: 'asdf',
              path: '/new-path',
            },
          ),
        ).toEqual({
          ...oldState,
          contentLoading: false,
          content: 'asdf',
          path: '/new-path',
        });
      });

      it('should set error', () => {
        expect(
          reducer(
            {
              ...oldState,
              contentLoading: true,
              content: 'asdf',
            },
            {
              type: 'content',
              contentError: new Error(),
            },
          ),
        ).toEqual({
          ...oldState,
          contentLoading: false,
          contentError: new Error(),
        });
      });
    });

    describe('"sync" action', () => {
      it('should update state', () => {
        expect(
          reducer(oldState, {
            type: 'sync',
            state: 'BUILDING',
          }),
        ).toEqual({
          ...oldState,
          activeSyncState: 'BUILDING',
        });
      });

      it('should clear buildLog on "CHECKING"', () => {
        expect(
          reducer(oldState, {
            type: 'sync',
            state: 'CHECKING',
          }),
        ).toEqual({
          ...oldState,
          activeSyncState: 'CHECKING',
          buildLog: [],
        });
      });
    });

    describe('"buildLog" action', () => {
      it('should work', () => {
        expect(
          reducer(oldState, {
            type: 'buildLog',
            log: 'Another Line',
          }),
        ).toEqual({
          ...oldState,
          buildLog: ['1', '2', 'Another Line'],
        });
      });
    });
  });

  describe('hook', () => {
    it('should handle up-to-date content', async () => {
      techdocsStorageApi.getEntityDocs.mockResolvedValue('my content');
      techdocsStorageApi.syncEntityDocs.mockImplementation(async () => {
        return 'cached';
      });

      await act(async () => {
        const { result, waitForValueToChange } = await renderHook(
          () => useReaderState('Component', 'default', 'backstage', '/example'),
          { wrapper: Wrapper },
        );

        expect(result.current).toEqual({
          state: 'CHECKING',
          path: '/example',
          content: undefined,
          contentErrorMessage: undefined,
          syncErrorMessage: undefined,
          buildLog: [],
          contentReload: expect.any(Function),
        });

        await waitForValueToChange(() => result.current.state);

        expect(result.current).toEqual({
          state: 'CONTENT_FRESH',
          path: '/example',
          content: 'my content',
          contentErrorMessage: undefined,
          syncErrorMessage: undefined,
          buildLog: [],
          contentReload: expect.any(Function),
        });

        expect(techdocsStorageApi.getEntityDocs).toBeCalledWith(
          { kind: 'Component', namespace: 'default', name: 'backstage' },
          '/example',
        );
        expect(techdocsStorageApi.syncEntityDocs).toBeCalledWith(
          {
            kind: 'Component',
            namespace: 'default',
            name: 'backstage',
          },
          expect.any(Function),
        );
      });
    });

    it('should reload initially missing content', async () => {
      techdocsStorageApi.getEntityDocs
        .mockRejectedValueOnce(new NotFoundError('Page Not Found'))
        .mockImplementationOnce(async () => {
          await new Promise(resolve => setTimeout(resolve, 500));
          return 'my content';
        });
      techdocsStorageApi.syncEntityDocs.mockImplementation(
        async (_, logHandler) => {
          logHandler?.call(this, 'Line 1');
          logHandler?.call(this, 'Line 2');
          await new Promise(resolve => setTimeout(resolve, 1100));
          return 'updated';
        },
      );

      await act(async () => {
        const { result, waitForValueToChange } = await renderHook(
          () => useReaderState('Component', 'default', 'backstage', '/example'),
          { wrapper: Wrapper },
        );

        expect(result.current).toEqual({
          state: 'CHECKING',
          path: '/example',
          content: undefined,
          contentErrorMessage: undefined,
          syncErrorMessage: undefined,
          buildLog: [],
          contentReload: expect.any(Function),
        });

        await waitForValueToChange(() => result.current.state);

        expect(result.current).toEqual({
          state: 'INITIAL_BUILD',
          path: '/example',
          content: undefined,
          contentErrorMessage: 'NotFoundError: Page Not Found',
          syncErrorMessage: undefined,
          buildLog: ['Line 1', 'Line 2'],
          contentReload: expect.any(Function),
        });

        await waitForValueToChange(() => result.current.state);

        expect(result.current).toEqual({
          state: 'CHECKING',
          path: '/example',
          content: undefined,
          contentErrorMessage: undefined,
          syncErrorMessage: undefined,
          buildLog: [],
          contentReload: expect.any(Function),
        });

        await waitForValueToChange(() => result.current.state);

        expect(result.current).toEqual({
          state: 'CONTENT_FRESH',
          path: '/example',
          content: 'my content',
          contentErrorMessage: undefined,
          syncErrorMessage: undefined,
          buildLog: [],
          contentReload: expect.any(Function),
        });

        expect(techdocsStorageApi.getEntityDocs).toBeCalledTimes(2);
        expect(techdocsStorageApi.getEntityDocs).toBeCalledWith(
          { kind: 'Component', namespace: 'default', name: 'backstage' },
          '/example',
        );
        expect(techdocsStorageApi.syncEntityDocs).toBeCalledTimes(1);
        expect(techdocsStorageApi.syncEntityDocs).toBeCalledWith(
          {
            kind: 'Component',
            namespace: 'default',
            name: 'backstage',
          },
          expect.any(Function),
        );
      });
    });

    it('should handle stale content', async () => {
      techdocsStorageApi.getEntityDocs
        .mockResolvedValueOnce('my content')
        .mockImplementationOnce(async () => {
          await new Promise(resolve => setTimeout(resolve, 1100));
          return 'my new content';
        });
      techdocsStorageApi.syncEntityDocs.mockImplementation(
        async (_, logHandler) => {
          logHandler?.call(this, 'Line 1');
          logHandler?.call(this, 'Line 2');
          await new Promise(resolve => setTimeout(resolve, 1100));
          return 'updated';
        },
      );

      await act(async () => {
        const { result, waitForValueToChange } = await renderHook(
          () => useReaderState('Component', 'default', 'backstage', '/example'),
          { wrapper: Wrapper },
        );

        expect(result.current).toEqual({
          state: 'CHECKING',
          path: '/example',
          content: undefined,
          contentErrorMessage: undefined,
          syncErrorMessage: undefined,
          buildLog: [],
          contentReload: expect.any(Function),
        });

        // the content is returned but the sync is in progress
        await waitForValueToChange(() => result.current.state);
        expect(result.current).toEqual({
          state: 'CONTENT_FRESH',
          path: '/example',
          content: 'my content',
          contentErrorMessage: undefined,
          syncErrorMessage: undefined,
          buildLog: ['Line 1', 'Line 2'],
          contentReload: expect.any(Function),
        });

        // the sync takes longer than 1 seconds so the refreshing state starts
        await waitForValueToChange(() => result.current.state);
        expect(result.current).toEqual({
          state: 'CONTENT_STALE_REFRESHING',
          path: '/example',
          content: 'my content',
          contentErrorMessage: undefined,
          syncErrorMessage: undefined,
          buildLog: ['Line 1', 'Line 2'],
          contentReload: expect.any(Function),
        });

        // the content is updated but not yet displayed
        await waitForValueToChange(() => result.current.state);
        expect(result.current).toEqual({
          state: 'CONTENT_STALE_READY',
          path: '/example',
          content: 'my content',
          contentErrorMessage: undefined,
          syncErrorMessage: undefined,
          buildLog: ['Line 1', 'Line 2'],
          contentReload: expect.any(Function),
        });

        // reload the content
        result.current.contentReload();

        // the new content refresh is triggered
        await waitForValueToChange(() => result.current.state);
        expect(result.current).toEqual({
          state: 'CHECKING',
          path: '/example',
          content: 'my content',
          contentErrorMessage: undefined,
          syncErrorMessage: undefined,
          buildLog: [],
          contentReload: expect.any(Function),
        });

        // the new content is loaded
        await waitForValueToChange(() => result.current.state);
        expect(result.current).toEqual({
          state: 'CONTENT_FRESH',
          path: '/example',
          content: 'my new content',
          contentErrorMessage: undefined,
          syncErrorMessage: undefined,
          buildLog: [],
          contentReload: expect.any(Function),
        });

        expect(techdocsStorageApi.getEntityDocs).toBeCalledTimes(2);
        expect(techdocsStorageApi.getEntityDocs).toBeCalledWith(
          { kind: 'Component', namespace: 'default', name: 'backstage' },
          '/example',
        );
        expect(techdocsStorageApi.syncEntityDocs).toBeCalledWith(
          {
            kind: 'Component',
            namespace: 'default',
            name: 'backstage',
          },
          expect.any(Function),
        );
      });
    });

    it('should handle navigation', async () => {
      techdocsStorageApi.getEntityDocs
        .mockResolvedValueOnce('my content')
        .mockImplementationOnce(async () => {
          await new Promise(resolve => setTimeout(resolve, 1100));
          return 'my new content';
        })
        .mockRejectedValueOnce(new NotFoundError('Some error description'));
      techdocsStorageApi.syncEntityDocs.mockResolvedValue('cached');

      await act(async () => {
        const { result, waitForValueToChange, rerender } = await renderHook(
          ({ path }: { path: string }) =>
            useReaderState('Component', 'default', 'backstage', path),
          { initialProps: { path: '/example' }, wrapper: Wrapper as any },
        );

        expect(result.current).toEqual({
          state: 'CHECKING',
          path: '/example',
          content: undefined,
          contentErrorMessage: undefined,
          syncErrorMessage: undefined,
          buildLog: [],
          contentReload: expect.any(Function),
        });

        // show the content
        await waitForValueToChange(() => result.current.state);
        expect(result.current).toEqual({
          state: 'CONTENT_FRESH',
          path: '/example',
          content: 'my content',
          contentErrorMessage: undefined,
          syncErrorMessage: undefined,
          buildLog: [],
          contentReload: expect.any(Function),
        });

        // navigate
        rerender({ path: '/new' });

        await waitForValueToChange(() => result.current.state);
        expect(result.current).toEqual({
          state: 'CHECKING',
          path: '/example',
          content: 'my content',
          contentErrorMessage: undefined,
          syncErrorMessage: undefined,
          buildLog: [],
          contentReload: expect.any(Function),
        });

        await waitForValueToChange(() => result.current.state);
        expect(result.current).toEqual({
          state: 'CONTENT_FRESH',
          path: '/new',
          content: 'my new content',
          contentErrorMessage: undefined,
          syncErrorMessage: undefined,
          buildLog: [],
          contentReload: expect.any(Function),
        });

        // navigate
        rerender({ path: '/missing' });

        await waitForValueToChange(() => result.current.state);
        expect(result.current).toEqual({
          state: 'CONTENT_NOT_FOUND',
          path: '/missing',
          content: undefined,
          contentErrorMessage: 'NotFoundError: Some error description',
          syncErrorMessage: undefined,
          buildLog: [],
          contentReload: expect.any(Function),
        });

        expect(techdocsStorageApi.getEntityDocs).toBeCalledWith(
          { kind: 'Component', namespace: 'default', name: 'backstage' },
          '/example',
        );
        expect(techdocsStorageApi.getEntityDocs).toBeCalledWith(
          { kind: 'Component', namespace: 'default', name: 'backstage' },
          '/new',
        );
        expect(techdocsStorageApi.syncEntityDocs).toBeCalledWith(
          {
            kind: 'Component',
            namespace: 'default',
            name: 'backstage',
          },
          expect.any(Function),
        );
      });
    });

    it('should handle content error', async () => {
      techdocsStorageApi.getEntityDocs.mockRejectedValue(
        new NotFoundError('Some error description'),
      );
      techdocsStorageApi.syncEntityDocs.mockResolvedValue('cached');

      await act(async () => {
        const { result, waitForValueToChange } = await renderHook(
          () => useReaderState('Component', 'default', 'backstage', '/example'),
          { wrapper: Wrapper },
        );

        expect(result.current).toEqual({
          state: 'CHECKING',
          path: '/example',
          content: undefined,
          contentErrorMessage: undefined,
          syncErrorMessage: undefined,
          buildLog: [],
          contentReload: expect.any(Function),
        });

        // the content loading threw an error
        await waitForValueToChange(() => result.current.state);
        expect(result.current).toEqual({
          state: 'CONTENT_NOT_FOUND',
          path: '/example',
          content: undefined,
          contentErrorMessage: 'NotFoundError: Some error description',
          syncErrorMessage: undefined,
          buildLog: [],
          contentReload: expect.any(Function),
        });

        expect(techdocsStorageApi.getEntityDocs).toBeCalledWith(
          { kind: 'Component', namespace: 'default', name: 'backstage' },
          '/example',
        );
        expect(techdocsStorageApi.syncEntityDocs).toBeCalledWith(
          {
            kind: 'Component',
            namespace: 'default',
            name: 'backstage',
          },
          expect.any(Function),
        );
      });
    });
  });
});
