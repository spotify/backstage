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

import { MockErrorApi } from './MockErrorApi';

async function ifResolved<T>(promise: Promise<T>): Promise<T | 'not-yet'> {
  return Promise.race([promise, Promise.resolve<'not-yet'>('not-yet')]);
}

describe('MockErrorApi', () => {
  it('should throw errors by default', () => {
    const api = new MockErrorApi();
    expect(() => api.post(new Error('NOPE'))).toThrow(
      'MockErrorApi received unexpected error, Error: NOPE',
    );
  });

  it('should collect errors', () => {
    const api = new MockErrorApi({ collect: true });

    api.post(new Error('e1'));
    api.post(new Error('e2'), { hidden: true });
    api.post(new Error('e3'));

    expect(api.getErrors()).toEqual([
      {
        error: new Error('e1'),
      },
      {
        error: new Error('e2'),
        context: { hidden: true },
      },
      {
        error: new Error('e3'),
      },
    ]);
  });

  it('should not emit values', async () => {
    const api = new MockErrorApi({ collect: true });

    const promise = new Promise((resolve, reject) => {
      api.error$().subscribe({
        next({ error }) {
          reject(error);
        },
        error(error) {
          reject(error);
        },
        complete() {
          reject(new Error('observable was completed'));
        },
      });

      setTimeout(() => resolve('timed-out'), 100);
    });

    await expect(promise).resolves.toBe('timed-out');
  });

  it('should wait for errors', async () => {
    const api = new MockErrorApi({ collect: true });

    const wait1 = api.waitForError(/1/);
    const wait2 = api.waitForError(/2/);

    await expect(ifResolved(wait1)).resolves.toBe('not-yet');
    await expect(ifResolved(wait2)).resolves.toBe('not-yet');
    api.post(new Error('e0'));
    await expect(ifResolved(wait1)).resolves.toBe('not-yet');
    await expect(ifResolved(wait2)).resolves.toBe('not-yet');
    api.post(new Error('e1'));
    await expect(ifResolved(wait1)).resolves.toEqual({
      error: new Error('e1'),
    });
    await expect(ifResolved(wait2)).resolves.toBe('not-yet');
    api.post(new Error('e2'), { hidden: true });
    await expect(ifResolved(wait2)).resolves.toEqual({
      error: new Error('e2'),
      context: { hidden: true },
    });
  });

  it('should time out waiting for error', async () => {
    const api = new MockErrorApi({ collect: true });

    await expect(api.waitForError(/1/, 1)).rejects.toThrow(
      'Timed out waiting for error',
    );
  });
});
