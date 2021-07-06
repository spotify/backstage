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

import { useEffect, useMemo, useReducer, useRef } from 'react';
import { useAsync, useAsyncRetry } from 'react-use';
import { techdocsStorageApiRef } from '../../api';
import { useApi } from '@backstage/core-plugin-api';

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

  /** There is content, the backend tried to update it, but it took too long */
  | 'CONTENT_STALE_TIMEOUT'

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

  // the build timed out, but the content is still stale
  if (activeSyncState === 'BUILD_TIMED_OUT') {
    return 'CONTENT_STALE_TIMEOUT';
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

  /** Building the documentation timed out */
  | 'BUILD_TIMED_OUT'

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
  | {
      type: 'content';
      content?: string;
      contentLoading?: true;
      contentError?: Error;
    }
  | { type: 'navigate'; path: string };

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
};

export function reducer(
  oldState: ReducerState,
  action: ReducerActions,
): ReducerState {
  const newState = { ...oldState };

  switch (action.type) {
    case 'sync':
      newState.activeSyncState = action.state;
      newState.syncError = action.syncError;
      break;

    case 'content':
      newState.content = action.content;
      newState.contentLoading = action.contentLoading ?? false;
      newState.contentError = action.contentError;
      break;

    case 'navigate':
      newState.path = action.path;
      break;

    default:
      throw new Error();
  }

  // a navigation or a content update loads fresh content so the build is updated to being up-to-date
  if (
    ['BUILD_READY', 'BUILD_READY_RELOAD'].includes(newState.activeSyncState) &&
    ['content', 'navigate'].includes(action.type)
  ) {
    newState.activeSyncState = 'UP_TO_DATE';
  }

  return newState;
}

export function useReaderState(
  kind: string,
  namespace: string,
  name: string,
  path: string,
): { state: ContentStateTypes; content?: string; errorMessage?: string } {
  const [state, dispatch] = useReducer(reducer, {
    activeSyncState: 'CHECKING',
    path,
    contentLoading: true,
  });

  const techdocsStorageApi = useApi(techdocsStorageApiRef);

  // convert all path changes into actions
  useEffect(() => {
    dispatch({ type: 'navigate', path });
  }, [path]);

  // try to load the content. the function will fire events and we don't care for the return values
  const { retry: contentReload } = useAsyncRetry(async () => {
    dispatch({ type: 'content', contentLoading: true });

    try {
      const entityDocs = await techdocsStorageApi.getEntityDocs(
        { kind, namespace, name },
        path,
      );

      dispatch({ type: 'content', content: entityDocs });

      return entityDocs;
    } catch (e) {
      dispatch({ type: 'content', contentError: e });
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
      const result = await techdocsStorageApi.syncEntityDocs({
        kind,
        namespace,
        name,
      });

      if (result === 'updated') {
        // if there was no content prior to building, retry the loading
        if (!contentRef.current.content) {
          contentRef.current.reload();
          dispatch({ type: 'sync', state: 'BUILD_READY_RELOAD' });
        } else {
          dispatch({ type: 'sync', state: 'BUILD_READY' });
        }
      } else if (result === 'cached') {
        dispatch({ type: 'sync', state: 'UP_TO_DATE' });
      } else {
        dispatch({ type: 'sync', state: 'BUILD_TIMED_OUT' });
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

  const errorMessage = useMemo(() => {
    let errMessage = '';
    if (state.contentError) {
      errMessage += ` Load error: ${state.contentError}`;
    }
    if (state.syncError) errMessage += ` Build error: ${state.syncError}`;

    return errMessage;
  }, [state.syncError, state.contentError]);

  return {
    state: displayState,
    content: state.content,
    errorMessage,
  };
}
