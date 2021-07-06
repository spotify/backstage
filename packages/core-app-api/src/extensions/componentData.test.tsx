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

import React from 'react';
import { attachComponentData, getComponentData } from './componentData';

describe('elementData', () => {
  it('should attach a single piece of data', () => {
    const data = { foo: 'bar' };
    const Component = () => null;
    attachComponentData(Component, 'my-data', data);

    const element = <Component />;
    expect(getComponentData(element, 'my-data')).toBe(data);
  });

  it('should attach several distinct pieces of data', () => {
    const data1 = { foo: 'bar' };
    const data2 = { test: 'value' };
    const Component = () => null;
    attachComponentData(Component, 'my-data', data1);
    attachComponentData(Component, 'second', data2);

    const element = <Component />;
    expect(getComponentData(element, 'my-data')).toBe(data1);
    expect(getComponentData(element, 'second')).toBe(data2);
  });

  it('returns undefined for missing data', () => {
    const data = { foo: 'bar' };
    const Component1 = () => null;
    const Component2 = () => null;
    attachComponentData(Component2, 'my-data', data);

    const element1 = <Component1 />;
    const element2 = <Component2 />;
    expect(getComponentData(element1, 'missing')).toBeUndefined();
    expect(getComponentData(element2, 'missing')).toBeUndefined();
  });

  it('should throw when attempting to overwrite data', () => {
    const data = { foo: 'bar' };
    const MyComponent = () => null;
    attachComponentData(MyComponent, 'my-data', data);
    expect(() => attachComponentData(MyComponent, 'my-data', data)).toThrow(
      'Attempted to attach duplicate data "my-data" to component "MyComponent"',
    );
  });

  describe('works across versions', () => {
    function getDataSymbol() {
      const Component = () => null;
      attachComponentData(Component, 'my-data', {});
      const [symbol] = Object.getOwnPropertySymbols(Component);
      return symbol;
    }

    it('should should be able to get data from older versions', () => {
      const symbol = getDataSymbol();

      const data = { foo: 'bar' };
      const Component = () => null;
      attachComponentData(Component, 'my-data', data);

      const element = <Component />;
      expect((element as any).type[symbol].map.get('my-data')).toBe(data);
    });

    it('should should be able to attach data for older versions', () => {
      const symbol = getDataSymbol();

      const data = { foo: 'bar' };
      const Component = () => null;
      (Component as any)[symbol] = {
        map: new Map([['my-data', data]]),
      };

      const element = <Component />;
      expect(getComponentData(element, 'my-data')).toBe(data);
    });

    it('should be able to get data from newer versions', () => {
      const data = { foo: 'bar' };
      const Component = () => null;
      attachComponentData(Component, 'my-data', data);

      const element = <Component />;
      const container = (global as any)[
        '__@backstage/component-data-store__'
      ].get(element.type);
      expect(container.map.get('my-data')).toBe(data);
    });

    it('should should be able to attach data for newer versions', () => {
      const data = { foo: 'bar' };
      const Component = () => null;
      (global as any)['__@backstage/component-data-store__'].set(Component, {
        map: new Map([['my-data', data]]),
      });

      const element = <Component />;
      expect(getComponentData(element, 'my-data')).toBe(data);
    });
  });
});
