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

import jscodeshift, { API } from 'jscodeshift';
import coreImportTransform from '../../transforms/core-imports';

function runTransform(source: string) {
  const j = jscodeshift.withParser('tsx');
  const api: API = {
    j,
    jscodeshift: j,
    stats: () => undefined,
    report: () => undefined,
  };
  const result = coreImportTransform({ source, file: 'test.ts' }, api);
  return result?.split('\r\n').join('\n');
}

describe('core-imports', () => {
  it('should leave file unchanged', () => {
    const input = `
import something from 'somewhere';

function nothing() {
return something()
}
`;

    expect(runTransform(input)).toBe(input);
  });

  it('should refactor imports', () => {
    const input = `
/* COPYRIGHT: ME */
import { Button as MyButton, createApiRef, createApp } from '@backstage/core';

const app = createApp();
const apiRef = createApiRef();
const button = <MyButton />
`;

    const output = `
/* COPYRIGHT: ME */
import { Button as MyButton } from '@backstage/core-components';

import { createApiRef } from '@backstage/core-plugin-api';
import { createApp } from '@backstage/core-app-api';

const app = createApp();
const apiRef = createApiRef();
const button = <MyButton />
`;

    expect(runTransform(input)).toBe(output);
  });
});
