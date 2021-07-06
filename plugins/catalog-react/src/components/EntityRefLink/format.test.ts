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

import { formatEntityRefTitle } from './format';

describe('formatEntityRefTitle', () => {
  it('formats entity in default namespace', () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };
    const title = formatEntityRefTitle(entity);
    expect(title).toEqual('component:software');
  });

  it('formats entity in other namespace', () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        namespace: 'test',
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };
    const title = formatEntityRefTitle(entity);
    expect(title).toEqual('component:test/software');
  });

  it('formats entity and hides default kind', () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        namespace: 'test',
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };
    const title = formatEntityRefTitle(entity, { defaultKind: 'Component' });
    expect(title).toEqual('test/software');
  });

  it('formats entity name in default namespace', () => {
    const entityName = {
      kind: 'Component',
      namespace: 'default',
      name: 'software',
    };
    const title = formatEntityRefTitle(entityName);
    expect(title).toEqual('component:software');
  });

  it('formats entity name in other namespace', () => {
    const entityName = {
      kind: 'Component',
      namespace: 'test',
      name: 'software',
    };

    const title = formatEntityRefTitle(entityName);
    expect(title).toEqual('component:test/software');
  });

  it('renders link for entity name and hides default kind', () => {
    const entityName = {
      kind: 'Component',
      namespace: 'test',
      name: 'software',
    };

    const title = formatEntityRefTitle(entityName, {
      defaultKind: 'component',
    });
    expect(title).toEqual('test/software');
  });
});
