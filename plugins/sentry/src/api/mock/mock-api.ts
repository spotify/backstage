/*
 * Copyright 2020 The Backstage Authors
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

import { SentryIssue } from '../sentry-issue';
import { SentryApi } from '../sentry-api';
import mockData from './sentry-issue-mock.json';

function getMockIssue(): SentryIssue {
  const randomizedStats = {
    '12h': new Array(12)
      .fill(0)
      .map(() => [0, Math.floor(Math.random() * 100)]),
  };
  return {
    ...mockData,
    userCount: Math.floor(Math.random() * 1000),
    stats: randomizedStats,
  };
}
function getMockIssues(number: number): SentryIssue[] {
  return new Array(number).fill(0).map(getMockIssue);
}
export class MockSentryApi implements SentryApi {
  fetchIssues(): Promise<SentryIssue[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(getMockIssues(14)), 800);
    });
  }
}
