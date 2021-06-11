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

import { Logger } from 'winston';

type TaskEnvelope = {
  task: Function;
  interval: number;
};

/**
 * TODO: coordination, error handling
 */

export class Scheduler {
  private logger: Logger;
  private schedule: TaskEnvelope[];
  private intervalTimeouts: NodeJS.Timeout[] = [];

  constructor({ logger }: { logger: Logger }) {
    this.logger = logger;
    this.schedule = [];
  }

  /**
   * Adds each task and interval to the schedule
   *
   */
  addToSchedule(task: Function, interval: number) {
    if (this.intervalTimeouts.length) {
      throw new Error(
        'Cannot add task to schedule that has already been started.',
      );
    }
    this.schedule.push({ task, interval });
  }

  /**
   * Starts the scheduling process for each task
   */
  start() {
    this.logger.info('Starting all scheduled search tasks.');
    this.schedule.forEach(({ task, interval }) => {
      this.intervalTimeouts.push(
        setInterval(() => {
          task();
        }, interval),
      );
    });
  }

  /**
   * Stop all scheduled tasks.
   */
  stop() {
    this.logger.info('Stopping all scheduled search tasks.');
    this.intervalTimeouts.forEach(timeout => {
      clearInterval(timeout);
    });
    this.intervalTimeouts = [];
  }
}
