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

import { ConfigReader } from './reader';

const DATA = {
  zero: 0,
  one: 1,
  true: true,
  false: false,
  null: null,
  string: 'string',
  emptyString: '',
  strings: ['string1', 'string2'],
  badStrings: ['string1', ''],
  worseStrings: ['string1', 3] as string[],
  worstStrings: ['string1', 'string2', {}] as string[],
  nested: {
    one: 1,
    null: null,
    string: 'string',
    strings: ['string1', 'string2'],
  },
  nestlings: [{ boolean: true }, { string: 'string' }, { number: 42 }] as {}[],
};

function expectValidValues(config: ConfigReader) {
  expect(config.keys()).toEqual(Object.keys(DATA));
  expect(config.get('zero')).toBe(0);
  expect(config.has('zero')).toBe(true);
  expect(config.has('false')).toBe(true);
  expect(config.has('null')).toBe(true);
  expect(config.has('missing')).toBe(false);
  expect(config.has('nested.one')).toBe(true);
  expect(config.has('nested.missing')).toBe(false);
  expect(config.has('nested.null')).toBe(true);
  expect(config.getNumber('zero')).toBe(0);
  expect(config.getNumber('one')).toBe(1);
  expect(config.getOptional('true')).toBe(true);
  expect(config.getBoolean('true')).toBe(true);
  expect(config.getBoolean('false')).toBe(false);
  expect(config.getString('string')).toBe('string');
  expect(config.get('strings')).toEqual(['string1', 'string2']);
  expect(config.getStringArray('strings')).toEqual(['string1', 'string2']);
  expect(config.getConfig('nested').getNumber('one')).toBe(1);
  expect(config.get('nested')).toEqual({
    one: 1,
    null: null,
    string: 'string',
    strings: ['string1', 'string2'],
  });
  expect(config.getConfig('nested').getString('string')).toBe('string');
  expect(
    config.getOptionalConfig('nested')!.getStringArray('strings'),
  ).toEqual(['string1', 'string2']);
  expect(config.getOptional('missing')).toBe(undefined);
  expect(config.getOptionalConfig('missing')).toBe(undefined);
  expect(config.getOptionalConfigArray('missing')).toBe(undefined);
  expect(config.getNumber('zero')).toBe(0);
  expect(config.getBoolean('true')).toBe(true);
  expect(config.getString('string')).toBe('string');
  expect(config.getStringArray('strings')).toEqual(['string1', 'string2']);

  const [config1, config2, config3] = config.getConfigArray('nestlings');
  expect(config1.getBoolean('boolean')).toBe(true);
  expect(config2.getString('string')).toBe('string');
  expect(config3.getNumber('number')).toBe(42);
  expect(
    config.getOptionalConfigArray('nestlings')![0].getBoolean('boolean'),
  ).toBe(true);
}

function expectInvalidValues(config: ConfigReader) {
  expect(() => config.getBoolean('string')).toThrow(
    "Invalid type in config for key 'string' in 'ctx', got string, wanted boolean",
  );
  expect(() => config.getNumber('string')).toThrow(
    "Unable to convert config value for key 'string' in 'ctx' to a number",
  );
  expect(() => config.getString('one')).toThrow(
    "Invalid type in config for key 'one' in 'ctx', got number, wanted string",
  );
  expect(() => config.getNumber('true')).toThrow(
    "Invalid type in config for key 'true' in 'ctx', got boolean, wanted number",
  );
  expect(() => config.getStringArray('null')).toThrow(
    "Invalid type in config for key 'null' in 'ctx', got null, wanted string-array",
  );
  expect(() => config.getString('emptyString')).toThrow(
    "Invalid type in config for key 'emptyString' in 'ctx', got empty-string, wanted string",
  );
  expect(() => config.getStringArray('badStrings')).toThrow(
    "Invalid type in config for key 'badStrings[1]' in 'ctx', got empty-string, wanted string",
  );
  expect(() => config.getStringArray('worseStrings')).toThrow(
    "Invalid type in config for key 'worseStrings[1]' in 'ctx', got number, wanted string",
  );
  expect(() => config.getStringArray('worstStrings')).toThrow(
    "Invalid type in config for key 'worstStrings[2]' in 'ctx', got object, wanted string",
  );
  expect(() => config.getConfig('one')).toThrow(
    "Invalid type in config for key 'one' in 'ctx', got number, wanted object",
  );
  expect(() => config.getConfigArray('one')).toThrow(
    "Invalid type in config for key 'one' in 'ctx', got number, wanted object-array",
  );
  expect(() => config.getBoolean('missing')).toThrow(
    "Missing required config value at 'missing'",
  );
  expect(() => config.getNumber('missing')).toThrow(
    "Missing required config value at 'missing'",
  );
  expect(() => config.getString('missing')).toThrow(
    "Missing required config value at 'missing'",
  );
  expect(() => config.getStringArray('missing')).toThrow(
    "Missing required config value at 'missing'",
  );
}

const CTX = 'ctx';

describe('ConfigReader', () => {
  it('should read empty config with valid keys', () => {
    const config = new ConfigReader({}, CTX);
    expect(config.keys()).toEqual([]);
    expect(config.getOptional()).toEqual({});
    expect(config.getOptional('x')).toBeUndefined();
    expect(config.getOptionalString('x')).toBeUndefined();
    expect(config.getOptionalString('x_x')).toBeUndefined();
    expect(config.getOptionalString('x-X')).toBeUndefined();
    expect(config.getOptionalString('x0')).toBeUndefined();
    expect(config.getOptionalString('X-x2')).toBeUndefined();
    expect(config.getOptionalString('x0_x0')).toBeUndefined();
    expect(config.getOptionalString('x_x-x_x')).toBeUndefined();

    expect(
      new ConfigReader(undefined, CTX).getOptionalString('x'),
    ).toBeUndefined();
  });

  it('should throw on invalid keys', () => {
    const config = new ConfigReader({}, CTX);

    expect(() => config.has('.')).toThrow(/^Invalid config key/);
    expect(() => config.get('0')).toThrow(/^Invalid config key/);
    expect(() => config.getOptional('(')).toThrow(/^Invalid config key/);
    expect(() => config.getString('z-_')).toThrow(/^Invalid config key/);
    expect(() => config.getOptionalString('-')).toThrow(/^Invalid config key/);
    expect(() => config.getNumber('.a')).toThrow(/^Invalid config key/);
    expect(() => config.getConfig('0.a')).toThrow(/^Invalid config key/);
    expect(() => config.getOptionalConfig('0a')).toThrow(/^Invalid config key/);
    expect(() => config.getString('a.0a')).toThrow(/^Invalid config key/);
    expect(() => config.getString('a..a')).toThrow(/^Invalid config key/);
    expect(() => config.getString('a.')).toThrow(/^Invalid config key/);
    expect(() => config.getString('a...')).toThrow(/^Invalid config key/);
    expect(() => config.getString('a.a.a.a.')).toThrow(/^Invalid config key/);
    expect(() => config.getString('a._')).toThrow(/^Invalid config key/);
    expect(() => config.getString('a.-.a')).toThrow(/^Invalid config key/);

    expect(() => new ConfigReader(undefined, CTX).getString('.')).toThrow(
      /^Invalid config key/,
    );
  });

  it('should read valid values', () => {
    const config = new ConfigReader(DATA, CTX);
    expectValidValues(config);
  });

  it('should fail to read invalid values', () => {
    const config = new ConfigReader(DATA, CTX);
    expectInvalidValues(config);
  });
});

describe('ConfigReader with fallback', () => {
  it('should behave as if without fallback', () => {
    const config = new ConfigReader({}, CTX, new ConfigReader(DATA, CTX));
    expect(config.getOptionalString('x')).toBeUndefined();
    expect(() => config.getString('.')).toThrow(/^Invalid config key/);
    expect(() => config.getString('a.')).toThrow(/^Invalid config key/);
  });

  it('should read values from itself', () => {
    const config = new ConfigReader(DATA, CTX, new ConfigReader({}, CTX));
    expectValidValues(config);
    expectInvalidValues(config);
  });

  it('should read values from a fallback', () => {
    const config = new ConfigReader({}, CTX, new ConfigReader(DATA, CTX));
    expectValidValues(config);
    expectInvalidValues(config);
  });

  it('should read values from multiple levels of fallbacks', () => {
    const config = new ConfigReader(
      {},
      CTX,
      new ConfigReader(
        {},
        CTX,
        new ConfigReader({}, CTX, new ConfigReader(DATA, CTX)),
      ),
    );
    expectValidValues(config);
    expectInvalidValues(config);
  });

  it('should show error with correct context', () => {
    const config = ConfigReader.fromConfigs([
      {
        data: {
          a: true,
          b: true,
          c: true,
          nested1: {
            a: true,
            b: true,
          },
          badBefore: {
            a: true,
          },
          badAfter: true,
        },
        context: 'z',
      },
      {
        data: {
          b: true,
          c: true,
          nested1: {
            a: true,
          },
          badBefore: true,
          badAfter: {
            a: true,
          },
        },
        context: 'y',
      },
      {
        data: {
          c: true,
        },
        context: 'x',
      },
    ]);

    expect(() => config.getNumber('a')).toThrow(
      "Invalid type in config for key 'a' in 'z', got boolean, wanted number",
    );
    expect(() => config.getNumber('b')).toThrow(
      "Invalid type in config for key 'b' in 'y', got boolean, wanted number",
    );
    expect(() => config.getNumber('c')).toThrow(
      "Invalid type in config for key 'c' in 'x', got boolean, wanted number",
    );
    expect(() => config.getNumber('nested1.a')).toThrow(
      "Invalid type in config for key 'nested1.a' in 'y', got boolean, wanted number",
    );
    expect(() => config.getNumber('nested1.b')).toThrow(
      "Invalid type in config for key 'nested1.b' in 'z', got boolean, wanted number",
    );
    expect(() => config.getConfig('nested1').getNumber('a')).toThrow(
      "Invalid type in config for key 'nested1.a' in 'y', got boolean, wanted number",
    );
    expect(() => config.getConfig('nested1').getNumber('b')).toThrow(
      "Invalid type in config for key 'nested1.b' in 'z', got boolean, wanted number",
    );
    expect(() => config.getNumber('badBefore.a')).toThrow(
      "Invalid type in config for key 'badBefore' in 'y', got boolean, wanted object",
    );
    expect(() => config.getNumber('badBefore.b')).toThrow(
      "Invalid type in config for key 'badBefore' in 'y', got boolean, wanted object",
    );
    expect(() => config.getNumber('badAfter.a')).toThrow(
      "Invalid type in config for key 'badAfter.a' in 'y', got boolean, wanted number",
    );
    expect(() => config.getNumber('badAfter.b')).toThrow(
      "Invalid type in config for key 'badAfter' in 'z', got boolean, wanted object",
    );
  });

  it('should read merged objects', () => {
    const a = {
      merged: {
        x: 'x',
        z: 'z1',
        arr: ['a', 'b'],
        config: { d: 'd' },
        configs: [{ a: 'a' }],
      },
    };
    const b = {
      merged: {
        y: 'y',
        z: 'z2',
        arr: ['c'],
        config: { e: 'e' },
        configs: [{ b: 'b' }],
      },
    };

    const config = new ConfigReader(a, CTX, new ConfigReader(b, CTX));

    expect(config.keys()).toEqual(['merged']);
    expect(config.has('merged.x')).toBe(true);
    expect(config.has('merged.y')).toBe(true);
    expect(config.has('merged.w')).toBe(false);
    expect(config.getConfig('merged').has('x')).toBe(true);
    expect(config.getConfig('merged').has('y')).toBe(true);
    expect(config.getConfig('merged').has('w')).toBe(false);
    expect(config.getConfig('merged').keys()).toEqual([
      'x',
      'z',
      'arr',
      'config',
      'configs',
      'y',
    ]);
    expect(config.getConfig('merged.config').keys()).toEqual(['d', 'e']);

    expect(config.getString('merged.x')).toBe('x');
    expect(config.getString('merged.y')).toBe('y');
    expect(config.getString('merged.z')).toBe('z1');
    expect(config.getConfig('merged').getString('x')).toBe('x');
    expect(config.getConfig('merged').getString('y')).toBe('y');
    expect(config.getConfig('merged').getString('z')).toBe('z1');
    expect(config.getString('merged.config.d')).toBe('d');
    expect(config.getString('merged.config.e')).toBe('e');
    expect(config.getConfig('merged').getString('config.d')).toBe('d');
    expect(config.getConfig('merged').getString('config.e')).toBe('e');
    expect(config.getConfig('merged').getConfig('config').getString('d')).toBe(
      'd',
    );
    expect(config.getConfig('merged').getConfig('config').getString('e')).toBe(
      'e',
    );

    // Arrays are not merged
    expect(config.getStringArray('merged.arr')).toEqual(['a', 'b']);
    expect(config.getConfig('merged').getStringArray('arr')).toEqual([
      'a',
      'b',
    ]);
    expect(() => config.getConfig('merged').getStringArray('x')).toThrow(
      "Invalid type in config for key 'merged.x' in 'ctx', got string, wanted string-array",
    );

    // Config arrays aren't merged either
    expect(config.getConfigArray('merged.configs').length).toBe(1);
    expect(config.getConfigArray('merged.configs')[0].getString('a')).toBe('a');
    expect(config.getConfigArray('merged.configs')[0].getString('a')).toBe('a');
    expect(() =>
      config.getConfigArray('merged.configs')[0].getString('missing'),
    ).toThrow("Missing required config value at 'merged.configs[0].missing'");
    expect(
      config.getConfigArray('merged.configs')[0].getOptionalString('b'),
    ).toBeUndefined();

    // Config arrays aren't merged either
    expect(config.getConfig('merged').getConfigArray('configs').length).toBe(1);
    expect(
      config.getConfig('merged').getConfigArray('configs')[0].getString('a'),
    ).toBe('a');
    expect(
      config
        .getConfig('merged')
        .getConfigArray('configs')[0]
        .getOptionalString('b'),
    ).toBeUndefined();
  });
});

describe('ConfigReader.get()', () => {
  const config1 = {
    a: {
      x: 'x1',
      y: ['y11', 'y12', 'y13'],
      z: false,
    },
    b: {
      x: 'x1',
      y: ['y11'],
    },
  };
  const config2 = {
    b: {
      x: 'x2',
      y: ['y21', 'y22'],
      z: 'z2',
    },
    c: {
      c1: {
        c2: 'c2',
      },
    },
  };
  const config3 = {
    c: {
      c1: 'c1',
    },
  };
  const configs = [
    {
      data: config1,
      context: '1',
    },
    {
      data: config2,
      context: '2',
    },
    {
      data: config3,
      context: '3',
    },
  ];

  it('should be able to select sub-configs', () => {
    expect(new ConfigReader(config1).get('a')).toEqual(config1.a);
    expect(new ConfigReader(config1).get('b')).toEqual(config1.b);
    expect(new ConfigReader(config2).get('b')).toEqual(config2.b);
    expect(new ConfigReader(config2).get('c')).toEqual(config2.c);
    expect(new ConfigReader(config3).get('c')).toEqual(config3.c);
    expect(new ConfigReader(config2).get('c.c1')).toEqual(config2.c.c1);
    expect(new ConfigReader(config2).getConfig('c').get('c1')).toEqual(
      config2.c.c1,
    );
  });

  it('should merge in fallback configs', () => {
    expect(
      ConfigReader.fromConfigs([configs[0], configs[1], configs[2]]).get(),
    ).toEqual({
      a: {
        x: 'x1',
        y: ['y11', 'y12', 'y13'],
        z: false,
      },
      b: {
        x: 'x2',
        y: ['y21', 'y22'],
        z: 'z2',
      },
      c: { c1: 'c1' },
    });
    expect(ConfigReader.fromConfigs([configs[1], configs[0]]).get('a')).toEqual(
      {
        x: 'x1',
        y: ['y11', 'y12', 'y13'],
        z: false,
      },
    );
    expect(ConfigReader.fromConfigs([configs[1], configs[0]]).get('b')).toEqual(
      {
        x: 'x1',
        y: ['y11'],
        z: 'z2',
      },
    );
    expect(ConfigReader.fromConfigs([configs[1], configs[0]]).get('c')).toEqual(
      {
        c1: {
          c2: 'c2',
        },
      },
    );
    expect(ConfigReader.fromConfigs([configs[1], configs[0]]).get('a')).toEqual(
      {
        x: 'x1',
        y: ['y11', 'y12', 'y13'],
        z: false,
      },
    );
    expect(ConfigReader.fromConfigs([configs[1], configs[0]]).get('b')).toEqual(
      {
        x: 'x1',
        y: ['y11'],
        z: 'z2',
      },
    );
    expect(ConfigReader.fromConfigs([configs[1], configs[0]]).get('c')).toEqual(
      {
        c1: {
          c2: 'c2',
        },
      },
    );

    expect(
      ConfigReader.fromConfigs([configs[1], configs[2]]).getOptional('b'),
    ).toEqual({
      x: 'x2',
      y: ['y21', 'y22'],
      z: 'z2',
    });
    expect(
      ConfigReader.fromConfigs([configs[1], configs[2]]).getOptional('c'),
    ).toEqual({
      c1: 'c1',
    });
  });

  it('should not merge non-objects', () => {
    const config = ConfigReader.fromConfigs([
      {
        data: {
          a: ['x', 'y', 'z'],
          b: ['1'],
          c: ['1'],
          d: ['2'],
          e: {
            y: 'y',
          },
          f: { x: 'x' },
          g: 'bar',
          h: {
            a: 'a2',
            b: 'b2',
          },
        },
        context: '2',
      },
      {
        data: {
          a: ['1', '2'],
          c: [],
          d: {
            x: 'x',
          },
          e: ['3'],
          f: 'foo',
          g: { z: 'z' },
          h: {
            a: 'a1',
            c: 'c1',
          },
        },
        context: '1',
      },
    ]);
    expect(config.get('a')).toEqual(['1', '2']);
    expect(config.get('b')).toEqual(['1']);
    expect(config.get('c')).toEqual([]);
    expect(config.get('d')).toEqual({ x: 'x' });
    expect(config.get('e')).toEqual(['3']);
    expect(config.get('f')).toEqual('foo');
    expect(config.get('g')).toEqual({ z: 'z' });
    expect(config.get('h')).toEqual({ a: 'a1', b: 'b2', c: 'c1' });
    expect(config.getConfig('h').get()).toEqual({ a: 'a1', b: 'b2', c: 'c1' });
    expect(config.getOptional()).toEqual({
      a: ['1', '2'],
      b: ['1'],
      c: [],
      d: {
        x: 'x',
      },
      e: ['3'],
      f: 'foo',
      g: { z: 'z' },
      h: {
        a: 'a1',
        b: 'b2',
        c: 'c1',
      },
    });
  });

  it('coerces number strings to numbers', () => {
    const config = ConfigReader.fromConfigs([
      {
        data: {
          port: '123',
        },
        context: '1',
      },
    ]);

    expect(config.getNumber('port')).toEqual(123);
  });
});
