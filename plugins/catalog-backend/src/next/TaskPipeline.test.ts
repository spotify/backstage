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

import { startTaskPipeline } from './TaskPipeline';

function createLimitedLoader(count: number, loadDelay?: number) {
  const items = new Array(count).fill(0).map((_, index) => index);
  const loadCounts = new Array<number>();
  const processedTasks = new Array<number>();

  let resolveDone: (_: {
    loadCounts: number[];
    processedTasks: number[];
  }) => void;
  const done = new Promise<{ loadCounts: number[]; processedTasks: number[] }>(
    resolve => {
      resolveDone = resolve;
    },
  );

  const loadTasks = async (loadCount: number) => {
    if (loadCounts.length < (loadDelay || 0)) {
      loadCounts.push(0);
      return [];
    }
    const loadedItems = items.splice(0, loadCount);
    loadCounts.push(loadedItems.length);
    return loadedItems;
  };
  const processTask = async (item: number) => {
    processedTasks.push(item);
    await new Promise(resolve => setTimeout(resolve)); // emulate a bit of work
    if (processedTasks.length === count) {
      resolveDone({ processedTasks, loadCounts });
    }
  };

  return { loadTasks, processTask, done };
}

describe('startTaskPipeline', () => {
  it('should process some tasks', async () => {
    const { loadTasks, processTask, done } = createLimitedLoader(6);
    const stop = startTaskPipeline<number>({
      loadTasks,
      processTask,
      lowWatermark: 1,
      highWatermark: 3,
    });

    const { loadCounts, processedTasks } = await done;
    stop();

    expect(loadCounts).toEqual([3, 2, 1]);
    expect(processedTasks).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it('should pick up processing after it runs dry', async () => {
    const { loadTasks, processTask, done } = createLimitedLoader(5, 2);
    const stop = startTaskPipeline<number>({
      loadTasks,
      processTask,
      lowWatermark: 2,
      highWatermark: 3,
      pollingIntervalMs: 1,
    });

    const { loadCounts, processedTasks } = await done;
    stop();

    expect(loadCounts).toEqual([0, 0, 3, 1, 1]);
    expect(processedTasks).toEqual([0, 1, 2, 3, 4]);
  });

  it('should process in parallel', async () => {
    const { loadTasks, processTask, done } = createLimitedLoader(13);
    const stop1 = startTaskPipeline<number>({
      loadTasks,
      processTask,
      lowWatermark: 2,
      highWatermark: 4,
    });
    const stop2 = startTaskPipeline<number>({
      loadTasks,
      processTask,
      lowWatermark: 2,
      highWatermark: 4,
    });

    const { loadCounts, processedTasks } = await done;
    stop1();
    stop2();

    expect(loadCounts).toEqual([4, 4, 2, 2, 1]);
    expect(processedTasks).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it('should require lowWatermark to be lower than highWatermark', async () => {
    expect(() => {
      startTaskPipeline<number>({
        loadTasks: async () => [],
        processTask: async () => {},
        lowWatermark: 3,
        highWatermark: 3,
      });
    }).toThrow('must be lower');
  });
});
