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
import { ENTITY_DEFAULT_NAMESPACE } from '../constants';
import { DefaultNamespaceEntityPolicy } from './DefaultNamespaceEntityPolicy';

describe('DefaultNamespaceEntityPolicy', () => {
  let withNamespace: any;
  let withoutNamespace: any;
  let policy: DefaultNamespaceEntityPolicy;

  beforeEach(() => {
    withoutNamespace = yaml.parse(`
      apiVersion: backstage.io/v1alpha1
      kind: Component
      metadata:
        name: my-component-yay
    `);
    withNamespace = yaml.parse(`
      apiVersion: backstage.io/v1alpha1
      kind: Component
      metadata:
        name: my-component-yay
        namespace: my-home
    `);
    policy = new DefaultNamespaceEntityPolicy();
  });

  it('leaves untouched if it already has a namespace', async () => {
    const result = policy.enforce(withNamespace);
    await expect(result).resolves.toBe(withNamespace);
    await expect(result).resolves.toEqual(
      expect.objectContaining({
        metadata: { name: 'my-component-yay', namespace: 'my-home' },
      }),
    );
  });

  it('adds namespace in different object if it did not have one', async () => {
    const result = policy.enforce(withoutNamespace);
    await expect(result).resolves.not.toBe(withoutNamespace);
    await expect(result).resolves.toEqual(
      expect.objectContaining({
        metadata: {
          name: 'my-component-yay',
          namespace: ENTITY_DEFAULT_NAMESPACE,
        },
      }),
    );
  });
});
