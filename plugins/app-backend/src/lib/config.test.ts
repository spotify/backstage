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

import fs from 'fs-extra';
import { resolve as resolvePath } from 'path';
import { getVoidLogger } from '@backstage/backend-common';
import { injectConfig } from './config';

jest.mock('fs-extra');

const fsMock = fs as jest.Mocked<typeof fs>;
const readFileMock = (fsMock.readFile as unknown) as jest.MockedFunction<
  (name: string) => Promise<string>
>;

const MOCK_DIR = 'mock-dir';

const baseOptions = {
  appConfigs: [],
  staticDir: MOCK_DIR,
  logger: getVoidLogger(),
};

describe('injectConfig', () => {
  beforeEach(() => {
    fsMock.readdir.mockResolvedValue(['main.js'] as any);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should inject without config', async () => {
    fsMock.readdir.mockResolvedValue(['main.js'] as any);
    readFileMock.mockImplementation(
      async () => '"__APP_INJECTED_RUNTIME_CONFIG__"',
    );
    await injectConfig(baseOptions);
    expect(fsMock.readdir).toHaveBeenCalledTimes(1);
    expect(fsMock.readFile).toHaveBeenCalledTimes(1);
    expect(fsMock.writeFile).toHaveBeenCalledTimes(1);
    expect(fsMock.writeFile).toHaveBeenCalledWith(
      resolvePath(MOCK_DIR, 'main.js'),
      '/*__APP_INJECTED_CONFIG_MARKER__*/"[]"/*__INJECTED_END__*/',
      'utf8',
    );

    // eslint-disable-next-line no-eval
    expect(JSON.parse(eval(fsMock.writeFile.mock.calls[0][1]))).toEqual([]);
  });

  it('should find the correct file to inject', async () => {
    fsMock.readdir.mockResolvedValue([
      'before.js',
      'not-js.txt',
      'main.js',
      'after.js',
    ] as any);
    readFileMock.mockImplementation(async (file: string) => {
      if (file.endsWith('main.js')) {
        return '"__APP_INJECTED_RUNTIME_CONFIG__"';
      }
      return 'NO_PLACEHOLDER_HERE';
    });

    await injectConfig({
      ...baseOptions,
      appConfigs: [{ data: { x: 0 }, context: 'test' }],
    });
    expect(fsMock.readFile).toHaveBeenCalledTimes(2);
    expect(fsMock.readFile).toHaveBeenNthCalledWith(
      1,
      resolvePath(MOCK_DIR, 'before.js'),
      'utf8',
    );
    expect(fsMock.readFile).toHaveBeenNthCalledWith(
      2,
      resolvePath(MOCK_DIR, 'main.js'),
      'utf8',
    );

    expect(fsMock.writeFile).toHaveBeenCalledTimes(1);
    expect(fsMock.writeFile).toHaveBeenCalledWith(
      resolvePath(MOCK_DIR, 'main.js'),
      '/*__APP_INJECTED_CONFIG_MARKER__*/"[{\\"data\\":{\\"x\\":0},\\"context\\":\\"test\\"}]"/*__INJECTED_END__*/',
      'utf8',
    );

    // eslint-disable-next-line no-eval
    expect(JSON.parse(eval(fsMock.writeFile.mock.calls[0][1]))).toEqual([
      {
        data: {
          x: 0,
        },
        context: 'test',
      },
    ]);
  });

  it('should re-inject config', async () => {
    fsMock.readdir.mockResolvedValue(['main.js'] as any);
    readFileMock.mockResolvedValue(
      'JSON.parse("__APP_INJECTED_RUNTIME_CONFIG__")',
    );

    await injectConfig({
      ...baseOptions,
      appConfigs: [{ data: { x: 0 }, context: 'test' }],
    });

    expect(fsMock.writeFile).toHaveBeenCalledTimes(1);
    expect(fsMock.writeFile).toHaveBeenCalledWith(
      resolvePath(MOCK_DIR, 'main.js'),
      'JSON.parse(/*__APP_INJECTED_CONFIG_MARKER__*/"[{\\"data\\":{\\"x\\":0},\\"context\\":\\"test\\"}]"/*__INJECTED_END__*/)',
      'utf8',
    );

    // eslint-disable-next-line no-eval
    expect(eval(fsMock.writeFile.mock.calls[0][1])).toEqual([
      { data: { x: 0 }, context: 'test' },
    ]);

    readFileMock.mockResolvedValue(fsMock.writeFile.mock.calls[0][1]);

    await injectConfig({
      ...baseOptions,
      appConfigs: [{ data: { x: 1, y: 2 }, context: 'test' }],
    });

    expect(fsMock.writeFile).toHaveBeenCalledTimes(2);
    expect(fsMock.writeFile).toHaveBeenLastCalledWith(
      resolvePath(MOCK_DIR, 'main.js'),
      'JSON.parse(/*__APP_INJECTED_CONFIG_MARKER__*/"[{\\"data\\":{\\"x\\":1,\\"y\\":2},\\"context\\":\\"test\\"}]"/*__INJECTED_END__*/)',
      'utf8',
    );

    // eslint-disable-next-line no-eval
    expect(eval(fsMock.writeFile.mock.calls[1][1])).toEqual([
      { data: { x: 1, y: 2 }, context: 'test' },
    ]);
  });
});
