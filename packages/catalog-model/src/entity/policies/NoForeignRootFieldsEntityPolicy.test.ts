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

import yaml from 'yaml';
import { NoForeignRootFieldsEntityPolicy } from './NoForeignRootFieldsEntityPolicy';

describe('NoForeignRootFieldsEntityPolicy', () => {
  let data: any;
  let policy: NoForeignRootFieldsEntityPolicy;

  beforeEach(() => {
    data = yaml.parse(`
      apiVersion: backstage.io/v1alpha1
      kind: Component
      metadata:
        uid: e01199ab-08cc-44c2-8e19-5c29ded82521
        etag: lsndfkjsndfkjnsdfkjnsd==
        generation: 13
        name: my-component-yay
        namespace: the-namespace
        labels:
          backstage.io/custom: ValueStuff
        annotations:
          example.com/bindings: are-secret
      spec:
        custom: stuff
    `);
    policy = new NoForeignRootFieldsEntityPolicy();
  });

  it('works for the happy path', async () => {
    await expect(policy.enforce(data)).resolves.toBe(data);
  });

  it('rejects unknown root fields', async () => {
    data.spec2 = {};
    await expect(policy.enforce(data)).rejects.toThrow(/spec2/i);
  });
});
