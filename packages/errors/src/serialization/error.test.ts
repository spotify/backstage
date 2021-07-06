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

import { deserializeError, serializeError } from './error';

class CustomError extends Error {
  readonly customField: any;
  constructor(message: string) {
    super(message);
    this.name = 'CustomError';
    this.customField = { complex: 'data' };
  }
}

describe('serialization', () => {
  it('runs the happy path with stack', () => {
    const before = new CustomError('m');
    const after = deserializeError<CustomError>(
      serializeError(before, { includeStack: true }),
    );
    expect(after.message).toEqual(before.message);
    expect(after.name).toEqual(before.name);
    expect(after.stack).toEqual(before.stack);
    expect(after.customField).toEqual(before.customField);
    // Does not reconstruct the actual class!
    expect(after.constructor).not.toBe(before.constructor);
  });

  it('runs the happy path without stack', () => {
    const before = new CustomError('m');
    const after = deserializeError<CustomError>(
      serializeError(before, { includeStack: false }),
    );
    expect(after.message).toEqual(before.message);
    expect(after.name).toEqual(before.name);
    expect(after.stack).not.toEqual(before.stack);
    expect(after.customField).toEqual(before.customField);
    // Does not reconstruct the actual class!
    expect(after.constructor).not.toBe(before.constructor);
  });

  it('serializes stack traces only when allowed', () => {
    const before = new CustomError('m');
    const withStack = serializeError(before, { includeStack: true });
    const withoutStack1 = serializeError(before, { includeStack: false });
    const withoutStack2 = serializeError(before);
    expect(withStack.stack).toEqual(before.stack);
    expect(withoutStack1.stack).not.toBeDefined();
    expect(withoutStack2.stack).not.toBeDefined();
  });
});
