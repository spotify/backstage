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

import { useApi } from '@backstage/core-plugin-api';
import { useMemo, useReducer, useRef } from 'react';
import { useAsync, useAsyncRetry } from 'react-use';
import { techdocsStorageApiRef } from '../../api';

/**
 * A state representation that is used to configure the UI of <Reader />
 */
type ContentStateTypes =
  /** There is nothing to display but a loading indicator */
  | 'CHECKING'

  /** There is no content yet -> present a full screen loading page */
  | 'INITIAL_BUILD'

  /** There is content, but the backend is about to update it */
  | 'CONTENT_STALE_REFRESHING'

  /** There is content, but after a reload, the content will be different */
  | 'CONTENT_STALE_READY'

  /** There is content, the backend tried to update it, but failed */
  | 'CONTENT_STALE_ERROR'

  /** There is nothing to see but a "not found" page. Is also shown on page load errors */
  | 'CONTENT_NOT_FOUND'

  /** There is only the latest and greatest content */
  | 'CONTENT_FRESH';

/**
 * Calculate the state that should be reported to the display component.
 */
export function calculateDisplayState({
  contentLoading,
  content,
  activeSyncState,
}: Pick<
  ReducerState,
  'contentLoading' | 'content' | 'activeSyncState'
>): ContentStateTypes {
  // we have nothing to display yet
  if (contentLoading) {
    return 'CHECKING';
  }

  // the build is ready, but it triggered a content reload and the content variable is not trusted
  if (activeSyncState === 'BUILD_READY_RELOAD') {
    return 'CHECKING';
  }

  // there is no content, but the sync process is still evaluating
  if (!content && activeSyncState === 'CHECKING') {
    return 'CHECKING';
  }

  // there is no content yet so we assume that we are building it for the first time
  if (!content && activeSyncState === 'BUILDING') {
    return 'INITIAL_BUILD';
  }

  // if there is still no content after building, it might just not exist
  if (!content) {
    return 'CONTENT_NOT_FOUND';
  }

  // we are still building, but we already show stale content
  if (activeSyncState === 'BUILDING') {
    return 'CONTENT_STALE_REFRESHING';
  }

  // the build is ready, but the content is still stale
  if (activeSyncState === 'BUILD_READY') {
    return 'CONTENT_STALE_READY';
  }

  // the build failed, but the content is still stale
  if (activeSyncState === 'ERROR') {
    return 'CONTENT_STALE_ERROR';
  }

  // seems like the content is up-to-date (or we don't know yet and the sync process is still evaluating in the background)
  return 'CONTENT_FRESH';
}

/**
 * The state of the synchronization task. It checks whether the docs are
 * up-to-date. If they aren't, it triggers a build.
 */
type SyncStates =
  /** Checking if it should be synced */
  | 'CHECKING'

  /** Building the documentation */
  | 'BUILDING'

  /** Finished building the documentation */
  | 'BUILD_READY'

  /**
   * Finished building the documentation and triggered a content reload.
   * This state is left toward UP_TO_DATE when the content loading has finished.
   */
  | 'BUILD_READY_RELOAD'

  /** No need for a sync. The content was already up-to-date. */
  | 'UP_TO_DATE'

  /** An error occurred */
  | 'ERROR';

type ReducerActions =
  | {
      type: 'sync';
      state: SyncStates;
      syncError?: Error;
    }
  | { type: 'contentLoading' }
  | {
      type: 'content';
      path?: string;
      content?: string;
      contentError?: Error;
    }
  | { type: 'buildLog'; log: string };

type ReducerState = {
  /**
   * The path of the current page
   */
  path: string;

  /**
   * The current sync state
   */
  activeSyncState: SyncStates;

  /**
   * If true, the content is downloading from the storage.
   */
  contentLoading: boolean;
  /**
   * The content that has been downloaded and should be displayed.
   */
  content?: string;

  contentError?: Error;
  syncError?: Error;

  /**
   * A list of log messages that were emitted by the build process.
   */
  buildLog: string[];
};

export function reducer(
  oldState: ReducerState,
  action: ReducerActions,
): ReducerState {
  const newState = { ...oldState };

  switch (action.type) {
    case 'sync':
      // reset the build log when a new check starts
      if (action.state === 'CHECKING') {
        newState.buildLog = [];
      }

      newState.activeSyncState = action.state;
      newState.syncError = action.syncError;
      break;

    case 'contentLoading':
      newState.contentLoading = true;

      // only reset errors but keep the old content until it is replaced by the 'content' action
      newState.contentError = undefined;
      break;

    case 'content':
      // only override the path if it is part of the action
      if (typeof action.path === 'string') {
        newState.path = action.path;
      }

      newState.contentLoading = false;
      newState.content = action.content;
      newState.contentError = action.contentError;
      break;

    case 'buildLog':
      newState.buildLog = newState.buildLog.concat(action.log);
      break;

    default:
      throw new Error();
  }

  // a content update loads fresh content so the build is updated to being up-to-date
  if (
    ['BUILD_READY', 'BUILD_READY_RELOAD'].includes(newState.activeSyncState) &&
    ['contentLoading', 'content'].includes(action.type)
  ) {
    newState.activeSyncState = 'UP_TO_DATE';
    newState.buildLog = [];
  }

  return newState;
}

export function useReaderState(
  kind: string,
  namespace: string,
  name: string,
  path: string,
): {
  state: ContentStateTypes;
  path: string;
  contentReload: () => void;
  content?: string;
  contentErrorMessage?: string;
  syncErrorMessage?: string;
  buildLog: string[];
} {
  const [state, dispatch] = useReducer(reducer, {
    activeSyncState: 'CHECKING',
    path,
    contentLoading: true,
    buildLog: [],
  });

  const techdocsStorageApi = useApi(techdocsStorageApiRef);

  // try to load the content. the function will fire events and we don't care for the return values
  const { retry: contentReload } = useAsyncRetry(async () => {
    dispatch({ type: 'contentLoading' });

    try {
      const entityDocs = await techdocsStorageApi.getEntityDocs(
        { kind, namespace, name },
        path,
      );

      // update content and path at the same time
      dispatch({ type: 'content', content: entityDocs, path });

      return entityDocs;
    } catch (e) {
      dispatch({ type: 'content', contentError: e, path });
    }

    return undefined;
  }, [techdocsStorageApi, kind, namespace, name, path]);

  // create a ref that holds the latest content. This provides a useAsync hook
  // with the latest content without restarting the useAsync hook.
  const contentRef = useRef<{ content?: string; reload: () => void }>({
    content: undefined,
    reload: () => {},
  });
  contentRef.current = { content: state.content, reload: contentReload };

  // try to derive the state. the function will fire events and we don't care for the return values
  useAsync(async () => {
    dispatch({ type: 'sync', state: 'CHECKING' });

    // should only switch to BUILDING if the request takes more than 1 seconds
    const buildingTimeout = setTimeout(() => {
      dispatch({ type: 'sync', state: 'BUILDING' });
    }, 1000);

    try {
      const result = await techdocsStorageApi.syncEntityDocs(
        {
          kind,
          namespace,
          name,
        },
        log => {
          dispatch({ type: 'buildLog', log });
        },
      );

      switch (result) {
        case 'updated':
          // if there was no content prior to building, retry the loading
          if (!contentRef.current.content) {
            contentRef.current.reload();
            dispatch({ type: 'sync', state: 'BUILD_READY_RELOAD' });
          } else {
            dispatch({ type: 'sync', state: 'BUILD_READY' });
          }
          break;
        case 'cached':
          dispatch({ type: 'sync', state: 'UP_TO_DATE' });
          break;

        default:
          dispatch({
            type: 'sync',
            state: 'ERROR',
            syncError: new Error('Unexpected return state'),
          });
          break;
      }
    } catch (e) {
      dispatch({ type: 'sync', state: 'ERROR', syncError: e });
    } finally {
      // Cancel the timer that sets the state "BUILDING"
      clearTimeout(buildingTimeout);
    }
  }, [kind, name, namespace, techdocsStorageApi, dispatch, contentRef]);

  const displayState = useMemo(
    () =>
      calculateDisplayState({
        activeSyncState: state.activeSyncState,
        contentLoading: state.contentLoading,
        content: state.content,
      }),
    [state.activeSyncState, state.content, state.contentLoading],
  );

  return {
    state: displayState,
    contentReload,
    path: state.path,
    content: state.content,
    contentErrorMessage: state.contentError?.toString(),
    syncErrorMessage: state.syncError?.toString(),
    buildLog: state.buildLog,
  };
}
