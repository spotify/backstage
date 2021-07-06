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

import ObservableImpl from 'zen-observable';
import { ResponseError } from '@backstage/errors';
import { Schema } from 'jsonschema';
import { ConfigSchemaApi, ConfigSchemaResult } from './types';
import { Observable } from '@backstage/core-plugin-api';

const DEFAULT_URL = 'config-schema.json';

/**
 * A ConfigSchemaApi implementation that loads the configuration from a URL.
 */
export class StaticSchemaLoader implements ConfigSchemaApi {
  private readonly url: string;

  constructor({ url = DEFAULT_URL }: { url?: string } = {}) {
    this.url = url;
  }

  schema$(): Observable<ConfigSchemaResult> {
    return new ObservableImpl(subscriber => {
      this.fetchSchema().then(
        schema => subscriber.next({ schema }),
        error => subscriber.error(error),
      );
    });
  }

  private async fetchSchema(): Promise<undefined | Schema> {
    const res = await fetch(this.url);

    if (!res.ok) {
      if (res.status === 404) {
        return undefined;
      }

      throw ResponseError.fromResponse(res);
    }

    return await res.json();
  }
}
