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

/* eslint-disable no-console */

import { withLogCollector } from './logCollector';

describe('logCollector', () => {
  it('should collect some logs synchronously', () => {
    const logs = withLogCollector(() => {
      console.log('a');
      console.warn('b');
      console.error('c');
      console.error('3');
      console.warn('2');
      console.log('1');
    });

    expect(logs.log).toEqual(['a', '1']);
    expect(logs.warn).toEqual(['b', '2']);
    expect(logs.error).toEqual(['c', '3']);
  });

  it('should collect some logs asynchrnously', async () => {
    const logs = await withLogCollector(async () => {
      console.log('a');
      console.warn('b');
      console.error('c');
      console.error('3');
      console.warn('2');
      console.log('1');
    });

    expect(logs.log).toEqual(['a', '1']);
    expect(logs.warn).toEqual(['b', '2']);
    expect(logs.error).toEqual(['c', '3']);
  });

  it('should collect specific logs synchronously', () => {
    const missedLogs = withLogCollector(() => {
      const logs = withLogCollector(['warn', 'log'], () => {
        console.log('a');
        console.warn('b');
        console.error('c');
        console.error('3');
        console.warn('2');
        console.log('1');
      });

      expect(logs.log).toEqual(['a', '1']);
      expect(logs.warn).toEqual(['b', '2']);
      // @ts-ignore
      expect(logs.error).toEqual([]);
    });

    expect(missedLogs.log).toEqual([]);
    expect(missedLogs.warn).toEqual([]);
    expect(missedLogs.error).toEqual(['c', '3']);
  });

  it('should collect specific logs asynchrnously', async () => {
    const missedLogs = await withLogCollector(async () => {
      const logs = await withLogCollector(['error'], async () => {
        console.log('a');
        console.warn('b');
        console.error('c');
        console.error('3');
        console.warn('2');
        console.log('1');
      });

      // @ts-ignore
      expect(logs.log).toEqual([]);
      // @ts-ignore
      expect(logs.warn).toEqual([]);
      expect(logs.error).toEqual(['c', '3']);
    });

    expect(missedLogs.log).toEqual(['a', '1']);
    expect(missedLogs.warn).toEqual(['b', '2']);
    expect(missedLogs.error).toEqual([]);
  });
});
