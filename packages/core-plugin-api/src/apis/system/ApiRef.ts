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

import type { ApiRef } from './types';

export type ApiRefConfig = {
  id: string;
  /**
   * @deprecated Will be removed in the future
   */
  description?: string;
};

class ApiRefImpl<T> implements ApiRef<T> {
  constructor(private readonly config: ApiRefConfig) {
    const valid = config.id
      .split('.')
      .flatMap(part => part.split('-'))
      .every(part => part.match(/^[a-z][a-z0-9]*$/));
    if (!valid) {
      throw new Error(
        `API id must only contain period separated lowercase alphanum tokens with dashes, got '${config.id}'`,
      );
    }
  }

  get id(): string {
    return this.config.id;
  }

  get description() {
    // eslint-disable-next-line no-console
    console.warn('Deprecated use of ApiRef.description');
    return this.config.description;
  }

  // Utility for getting type of an api, using `typeof apiRef.T`
  get T(): T {
    throw new Error(`tried to read ApiRef.T of ${this}`);
  }

  toString() {
    return `apiRef{${this.config.id}}`;
  }
}

export function createApiRef<T>(config: ApiRefConfig): ApiRef<T> {
  return new ApiRefImpl<T>(config);
}
