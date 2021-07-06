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
import { ApiResolver } from './ApiResolver';
import { ApiFactoryRegistry } from './ApiFactoryRegistry';

const aRef = createApiRef<number>({ id: 'a' });
const otherARef = createApiRef<number>({ id: 'a' });
const bRef = createApiRef<string>({ id: 'b' });
const otherBRef = createApiRef<string>({ id: 'b' });
const cRef = createApiRef<{ x: string }>({ id: 'c' });
const otherCRef = createApiRef<{ x: string }>({ id: 'c' });

function createRegistry() {
  const registry = new ApiFactoryRegistry();
  registry.register('default', {
    api: aRef,
    deps: {},
    factory: () => 1,
  });
  registry.register('default', {
    api: bRef,
    deps: {},
    factory: () => 'b',
  });
  registry.register('default', {
    api: cRef,
    deps: { b: otherBRef },
    factory: ({ b }) => ({ x: 'x', b }),
  });
  return registry;
}

function createSelfCyclicRegistry() {
  const registry = new ApiFactoryRegistry();
  registry.register('default', {
    api: aRef,
    deps: { a: aRef },
    factory: () => 1,
  });
  return registry;
}

function createShortCyclicRegistry() {
  const registry = new ApiFactoryRegistry();
  registry.register('default', {
    api: aRef,
    deps: { b: bRef },
    factory: () => 1,
  });
  registry.register('default', {
    api: bRef,
    deps: { a: aRef },
    factory: () => 'x',
  });
  return registry;
}

function createShortCyclicRegistryWithOther() {
  const registry = new ApiFactoryRegistry();
  registry.register('default', {
    api: aRef,
    deps: { b: bRef },
    factory: () => 1,
  });
  registry.register('default', {
    api: otherBRef,
    deps: { a: otherARef },
    factory: () => 'x',
  });
  return registry;
}

function createLongCyclicRegistry() {
  const registry = new ApiFactoryRegistry();
  registry.register('default', {
    api: aRef,
    deps: { b: otherBRef },
    factory: () => 1,
  });
  registry.register('default', {
    api: bRef,
    deps: { c: cRef },
    factory: () => 'b',
  });
  registry.register('default', {
    api: cRef,
    deps: { a: aRef },
    factory: () => ({ x: 'x' }),
  });
  return registry;
}

describe('ApiResolver', () => {
  it('should be created empty', () => {
    const resolver = new ApiResolver(new ApiFactoryRegistry());
    expect(resolver.get(aRef)).toBe(undefined);
    expect(resolver.get(bRef)).toBe(undefined);
    expect(resolver.get(otherBRef)).toBe(undefined);
    expect(resolver.get(cRef)).toBe(undefined);
  });

  it('should instantiate APIs', () => {
    const resolver = new ApiResolver(createRegistry());
    expect(resolver.get(aRef)).toBe(1);
    expect(resolver.get(otherARef)).toBe(1);
    expect(resolver.get(bRef)).toBe('b');
    expect(resolver.get(otherBRef)).toBe('b');
    expect(resolver.get(cRef)).toEqual({ x: 'x', b: 'b' });
    expect(resolver.get(cRef)).toBe(resolver.get(otherCRef));
  });

  it('should detect self dependency cycles', () => {
    const resolver = new ApiResolver(createSelfCyclicRegistry());
    expect(() => resolver.get(aRef)).toThrow(
      'Circular dependency of api factory for apiRef{a}',
    );
  });

  it('should detect short dependency cycles', () => {
    const resolver = new ApiResolver(createShortCyclicRegistry());
    expect(() => resolver.get(aRef)).toThrow(
      'Circular dependency of api factory for apiRef{a}',
    );
    expect(() => resolver.get(bRef)).toThrow(
      'Circular dependency of api factory for apiRef{b}',
    );
  });

  it('should detect short dependency cycles with other refs', () => {
    const resolver = new ApiResolver(createShortCyclicRegistryWithOther());
    expect(() => resolver.get(aRef)).toThrow(
      'Circular dependency of api factory for apiRef{a}',
    );
    expect(() => resolver.get(bRef)).toThrow(
      'Circular dependency of api factory for apiRef{b}',
    );
    expect(() => resolver.get(otherARef)).toThrow(
      'Circular dependency of api factory for apiRef{a}',
    );
    expect(() => resolver.get(otherBRef)).toThrow(
      'Circular dependency of api factory for apiRef{b}',
    );
  });

  it('should detect long dependency cycles', () => {
    const resolver = new ApiResolver(createLongCyclicRegistry());
    expect(() => resolver.get(aRef)).toThrow(
      'Circular dependency of api factory for apiRef{a}',
    );
    // Second call for same ref should still throw
    expect(() => resolver.get(aRef)).toThrow(
      'Circular dependency of api factory for apiRef{a}',
    );
    expect(() => resolver.get(bRef)).toThrow(
      'Circular dependency of api factory for apiRef{b}',
    );
    expect(() => resolver.get(otherBRef)).toThrow(
      'Circular dependency of api factory for apiRef{b}',
    );
    expect(() => resolver.get(cRef)).toThrow(
      'Circular dependency of api factory for apiRef{c}',
    );
  });

  it('should validate a factory holder', () => {
    expect(() => {
      ApiResolver.validateFactories(createRegistry(), [
        aRef,
        bRef,
        otherBRef,
        cRef,
      ]);
    }).not.toThrow();
  });

  it('should find self cycles with validation', () => {
    const self = createSelfCyclicRegistry();
    expect(() => ApiResolver.validateFactories(self, [aRef])).toThrow(
      'Circular dependency of api factory for apiRef{a}',
    );
    expect(() => ApiResolver.validateFactories(self, [otherARef])).toThrow(
      'Circular dependency of api factory for apiRef{a}',
    );
  });

  it('should find dependency cycles with validation', () => {
    const short = createShortCyclicRegistry();
    expect(() => ApiResolver.validateFactories(short, [aRef])).toThrow(
      'Circular dependency of api factory for apiRef{a}',
    );
    expect(() => ApiResolver.validateFactories(short, [otherARef])).toThrow(
      'Circular dependency of api factory for apiRef{a}',
    );
    expect(() => ApiResolver.validateFactories(short, [bRef])).toThrow(
      'Circular dependency of api factory for apiRef{b}',
    );
    expect(() => ApiResolver.validateFactories(short, [otherBRef])).toThrow(
      'Circular dependency of api factory for apiRef{b}',
    );

    const shortOther = createShortCyclicRegistryWithOther();
    expect(() => ApiResolver.validateFactories(shortOther, [aRef])).toThrow(
      'Circular dependency of api factory for apiRef{a}',
    );
    expect(() =>
      ApiResolver.validateFactories(shortOther, [otherARef]),
    ).toThrow('Circular dependency of api factory for apiRef{a}');
    expect(() => ApiResolver.validateFactories(shortOther, [bRef])).toThrow(
      'Circular dependency of api factory for apiRef{b}',
    );
    expect(() =>
      ApiResolver.validateFactories(shortOther, [otherBRef]),
    ).toThrow('Circular dependency of api factory for apiRef{b}');

    const long = createLongCyclicRegistry();
    expect(() =>
      ApiResolver.validateFactories(long, long.getAllApis()),
    ).toThrow('Circular dependency of api factory for apiRef{a}');
    expect(() => ApiResolver.validateFactories(long, [bRef])).toThrow(
      'Circular dependency of api factory for apiRef{b}',
    );
    expect(() => ApiResolver.validateFactories(long, [otherBRef])).toThrow(
      'Circular dependency of api factory for apiRef{b}',
    );
    expect(() => ApiResolver.validateFactories(long, [cRef])).toThrow(
      'Circular dependency of api factory for apiRef{c}',
    );
  });

  it('should only call factory func once', () => {
    const registry = new ApiFactoryRegistry();
    const factory = jest.fn().mockReturnValue(2);
    registry.register('default', {
      api: aRef,
      deps: {},
      factory,
    });

    const resolver = new ApiResolver(registry);
    expect(factory).toHaveBeenCalledTimes(0);
    expect(resolver.get(aRef)).toBe(2);
    expect(factory).toHaveBeenCalledTimes(1);
    expect(resolver.get(aRef)).toBe(2);
    expect(factory).toHaveBeenCalledTimes(1);
    expect(resolver.get(otherARef)).toBe(2);
    expect(factory).toHaveBeenCalledTimes(1);
  });
});
