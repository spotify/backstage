/*
 * Copyright 2021 Spotify AB
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

import { getVoidLogger } from '@backstage/backend-common';
import { Scheduler } from './index';

describe('Scheduler', () => {
  let testScheduler: Scheduler;

  beforeEach(() => {
    const logger = getVoidLogger();
    testScheduler = new Scheduler({
      logger,
    });
  });

  describe('addToSchedule', () => {
    it('should not add a task and interval to schedule, if already started', async () => {
      jest.useFakeTimers();
      const mockTask1 = jest.fn();
      const mockTask2 = jest.fn();

      // Add a task and interval to schedule
      testScheduler.addToSchedule(mockTask1, 2);

      // Starts scheduling process
      testScheduler.start();

      // Throws Error if task and interval is added to a already started schedule
      expect(() => testScheduler.addToSchedule(mockTask2, 2)).toThrowError();

      jest.runOnlyPendingTimers();
      expect(mockTask1).toHaveBeenCalled();
      expect(mockTask2).not.toHaveBeenCalled();
    });

    it('should be possible to add a task and interval to schedule, if already started, but stopped in between', async () => {
      jest.useFakeTimers();
      const mockTask1 = jest.fn();
      const mockTask2 = jest.fn();

      // Add a task and interval to schedule
      testScheduler.addToSchedule(mockTask1, 2);

      // Starts scheduling process
      testScheduler.start();

      // Stop scheduling process
      testScheduler.stop();

      // Should't throw error, as it is stopped.
      expect(() =>
        testScheduler.addToSchedule(mockTask2, 4),
      ).not.toThrowError();

      // Starts scheduling process
      testScheduler.start();

      jest.runOnlyPendingTimers();
      expect(mockTask1).toHaveBeenCalled();
      expect(mockTask2).toHaveBeenCalled();
    });
  });
});
