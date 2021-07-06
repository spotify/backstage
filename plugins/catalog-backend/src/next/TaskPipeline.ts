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

const DEFAULT_POLLING_INTERVAL_MS = 1000;

type Options<T> = {
  /**
   * The callback used to load in new tasks. The number of items returned
   * in the array must be at most `count` number of items, but may be lower.
   *
   * Any error thrown from this method fill be treated as an unhandled rejection.
   */
  loadTasks: (count: number) => Promise<Array<T>>;

  /**
   * The callback used to process a single item.
   *
   * Any error thrown from this method fill be treated as an unhandled rejection.
   */
  processTask: (item: T) => Promise<void>;

  /**
   * The target minimum number of items to process in parallel. Once the number
   * of in-flight tasks reaches this count, more tasks will be loaded in.
   */
  lowWatermark: number;

  /**
   * The maximum number of items to process in parallel.
   */
  highWatermark: number;

  /**
   * The interval at which tasks are polled for in the background when
   * there aren't enough tasks to load to satisfy the low watermark.
   *
   * @default 1000
   */
  pollingIntervalMs?: number;
};

/**
 * Creates a task processing pipeline which continuously loads in tasks to
 * keep the number of parallel in-flight tasks between a low and high watermark.
 *
 * @param options The options for the pipeline.
 * @returns A stop function which when called halts all processing.
 */
export function startTaskPipeline<T>(options: Options<T>) {
  const {
    loadTasks,
    processTask,
    lowWatermark,
    highWatermark,
    pollingIntervalMs = DEFAULT_POLLING_INTERVAL_MS,
  } = options;

  if (lowWatermark >= highWatermark) {
    throw new Error('lowWatermark must be lower than highWatermark');
  }

  let loading = false;
  let stopped = false;
  let inFlightCount = 0;

  async function maybeLoadMore() {
    if (stopped || loading || inFlightCount > lowWatermark) {
      return;
    }

    // Once we hit the low watermark we load in enough items to reach the high watermark
    loading = true;
    const loadCount = highWatermark - inFlightCount;
    const loadedItems = await loadTasks(loadCount);
    loading = false;

    // We might not reach the high watermark here, in case there weren't enough items to load
    inFlightCount += loadedItems.length;
    loadedItems.forEach(item => {
      processTask(item).finally(() => {
        if (stopped) {
          return;
        }

        // For each item we complete we check if it's time to load more
        inFlightCount -= 1;
        maybeLoadMore();
      });
    });

    // We might have processed some tasks while we where loading, so check if we can load more
    if (loadedItems.length > 1) {
      maybeLoadMore();
    }
  }

  // This interval makes sure that we load in new items if the loop runs
  // dry because of the lack of available tasks. As long as there are
  // enough items to process this will be a noop.
  const intervalId = setInterval(() => {
    maybeLoadMore();
  }, pollingIntervalMs);

  return () => {
    stopped = true;
    clearInterval(intervalId);
  };
}
