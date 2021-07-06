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

import { createApiRef } from '@backstage/core-plugin-api';
import { ApiRegistry } from './ApiRegistry';

describe('ApiRegistry', () => {
  const x1Ref = createApiRef<number>({ id: 'x1' });
  const x1DuplicateRef = createApiRef<number>({ id: 'x1' });
  const x2Ref = createApiRef<string>({ id: 'x2' });

  it('should be created', () => {
    const registry = ApiRegistry.from([]);
    expect(registry.get(x1Ref)).toBe(undefined);
  });

  it('should be created with APIs', () => {
    const registry = ApiRegistry.from([
      [x1Ref, 3],
      [x2Ref, 'y'],
    ]);
    expect(registry.get(x1Ref)).toBe(3);
    expect(registry.get(x1DuplicateRef)).toBe(3);
    expect(registry.get(x2Ref)).toBe('y');
  });

  it('should be built', () => {
    const registry = ApiRegistry.builder().build();
    expect(registry.get(x1Ref)).toBe(undefined);
    expect(registry.get(x1DuplicateRef)).toBe(undefined);
  });

  it('should be built with APIs', () => {
    const builder = ApiRegistry.builder();
    builder.add(x1Ref, 3);
    builder.add(x2Ref, 'y');

    const registry = builder.build();
    expect(registry.get(x1Ref)).toBe(3);
    expect(registry.get(x1DuplicateRef)).toBe(3);
    expect(registry.get(x2Ref)).toBe('y');
  });

  it('should be created with API', () => {
    const reg1 = ApiRegistry.with(x1Ref, 3);
    const reg2 = reg1.with(x2Ref, 'y');
    const reg3 = reg2.with(x2Ref, 'z');
    const reg4 = reg3.with(x1Ref, 2);
    const reg5 = reg3.with(x1DuplicateRef, 4);

    expect(reg1.get(x1Ref)).toBe(3);
    expect(reg1.get(x2Ref)).toBe(undefined);
    expect(reg2.get(x1Ref)).toBe(3);
    expect(reg2.get(x2Ref)).toBe('y');
    expect(reg3.get(x1Ref)).toBe(3);
    expect(reg3.get(x2Ref)).toBe('z');
    expect(reg4.get(x1Ref)).toBe(2);
    expect(reg4.get(x2Ref)).toBe('z');
    expect(reg5.get(x1Ref)).toBe(4);
    expect(reg5.get(x2Ref)).toBe('z');
  });
});
