/*
 * Copyright 2023 The Backstage Authors
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
import { resolve as resolvePath } from 'node:path';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { ConfigSources } from './ConfigSources';
import { ConfigSource } from './types';
import { MutableConfigSource } from './MutableConfigSource';

jest.mock('./FileConfigSource', () => ({
  FileConfigSource: {
    create: (opts: {}) => ({ ...opts, name: 'FileConfigSource' }),
  },
}));
jest.mock('./RemoteConfigSource', () => ({
  RemoteConfigSource: {
    create: (opts: {}) => ({ ...opts, name: 'RemoteConfigSource' }),
  },
}));
jest.mock('./EnvConfigSource', () => ({
  EnvConfigSource: {
    create: (opts: {}) => ({ ...opts, name: 'EnvConfigSource' }),
  },
}));

function mergeSources(source: ConfigSource): ConfigSource[] {
  return (source as any)[
    Symbol.for('@backstage/config-loader#MergedConfigSource.sources')
  ] as ConfigSource[];
}

const root = resolvePath('/');

describe('ConfigSources', () => {
  it('should parse args', () => {
    expect(ConfigSources.parseArgs([])).toEqual([]);

    expect(
      ConfigSources.parseArgs(['--config', 'a.yaml', '--config=b.yaml']),
    ).toEqual([
      { type: 'path', target: 'a.yaml' },
      { type: 'path', target: 'b.yaml' },
    ]);

    expect(
      ConfigSources.parseArgs([
        '--config',
        'a.yaml',
        '--config',
        'http://example.com/config.yaml',
      ]),
    ).toEqual([
      { type: 'path', target: 'a.yaml' },
      { type: 'url', target: 'http://example.com/config.yaml' },
    ]);
  });

  it('should create default sources for targets', () => {
    const fsSpy = jest.spyOn(fs, 'pathExistsSync').mockImplementation(path => {
      return path === `${root}app-config.yaml`;
    });

    expect(
      mergeSources(
        ConfigSources.defaultForTargets({ rootDir: '/', targets: [] }),
      ),
    ).toEqual([{ name: 'FileConfigSource', path: `${root}app-config.yaml` }]);

    fsSpy.mockReturnValue(true);

    expect(
      mergeSources(
        ConfigSources.defaultForTargets({ rootDir: '/', targets: [] }),
      ),
    ).toEqual([
      { name: 'FileConfigSource', path: `${root}app-config.yaml` },
      { name: 'FileConfigSource', path: `${root}app-config.local.yaml` },
    ]);

    process.env = Object.assign(process.env, { BACKSTAGE_ENV: 'test' });
    expect(
      mergeSources(
        ConfigSources.defaultForTargets({ rootDir: '/', targets: [] }),
      ),
    ).toEqual([
      { name: 'FileConfigSource', path: `${root}app-config.yaml` },
      { name: 'FileConfigSource', path: `${root}app-config.test.yaml` },
      { name: 'FileConfigSource', path: `${root}app-config.local.yaml` },
      { name: 'FileConfigSource', path: `${root}app-config.test.local.yaml` },
    ]);

    fsSpy.mockRestore();

    expect(
      mergeSources(
        ConfigSources.defaultForTargets({
          rootDir: '/',
          targets: [{ type: 'path', target: '/config.yaml' }],
        }),
      ),
    ).toEqual([{ name: 'FileConfigSource', path: `${root}config.yaml` }]);

    expect(
      mergeSources(
        ConfigSources.defaultForTargets({
          targets: [{ type: 'path', target: 'config.yaml' }],
        }),
      ),
    ).toEqual([{ name: 'FileConfigSource', path: resolvePath('config.yaml') }]);

    const subFunc = async () => undefined;
    expect(
      mergeSources(
        ConfigSources.defaultForTargets({
          rootDir: '/',
          targets: [{ type: 'path', target: '/config.yaml' }],
          substitutionFunc: subFunc,
        }),
      ),
    ).toEqual([
      {
        name: 'FileConfigSource',
        path: '/config.yaml',
        substitutionFunc: subFunc,
      },
    ]);

    expect(() =>
      ConfigSources.defaultForTargets({
        rootDir: '/',
        targets: [{ type: 'url', target: 'http://example.com/config.yaml' }],
      }),
    ).toThrow(
      'Config argument "http://example.com/config.yaml" looks like a URL but remote configuration is not enabled. Enable it by passing the `remote` option',
    );

    expect(
      mergeSources(
        ConfigSources.defaultForTargets({
          rootDir: '/',
          targets: [{ type: 'url', target: 'http://example.com/config.yaml' }],
          remote: {},
        }),
      ),
    ).toEqual([
      { name: 'RemoteConfigSource', url: 'http://example.com/config.yaml' },
    ]);

    expect(
      mergeSources(
        ConfigSources.defaultForTargets({
          rootDir: '/',
          targets: [{ type: 'url', target: 'http://example.com/config.yaml' }],
          remote: { reloadInterval: { minutes: 2 } },
        }),
      ),
    ).toEqual([
      {
        name: 'RemoteConfigSource',
        url: 'http://example.com/config.yaml',
        reloadInterval: { minutes: 2 },
      },
    ]);
  });

  it('should create default sources for multiple environments', () => {
    const fsSpy = jest.spyOn(fs, 'pathExistsSync').mockReturnValue(true);

    process.env = Object.assign(process.env, {
      BACKSTAGE_ENV: 'e2e-test,production',
    });
    expect(
      mergeSources(
        ConfigSources.defaultForTargets({ rootDir: '/', targets: [] }),
      ),
    ).toEqual([
      { name: 'FileConfigSource', path: `${root}app-config.yaml` },
      { name: 'FileConfigSource', path: `${root}app-config.e2e-test.yaml` },
      { name: 'FileConfigSource', path: `${root}app-config.production.yaml` },
      { name: 'FileConfigSource', path: `${root}app-config.local.yaml` },
      {
        name: 'FileConfigSource',
        path: `${root}app-config.e2e-test.local.yaml`,
      },
      {
        name: 'FileConfigSource',
        path: `${root}app-config.production.local.yaml`,
      },
    ]);

    fsSpy.mockRestore();
  });

  it('should handle whitespace and empty segments in BACKSTAGE_ENV', () => {
    const fsSpy = jest.spyOn(fs, 'pathExistsSync').mockReturnValue(true);

    process.env = Object.assign(process.env, {
      BACKSTAGE_ENV: ' e2e-test , production ',
    });
    expect(
      mergeSources(
        ConfigSources.defaultForTargets({ rootDir: '/', targets: [] }),
      ),
    ).toEqual([
      { name: 'FileConfigSource', path: `${root}app-config.yaml` },
      { name: 'FileConfigSource', path: `${root}app-config.e2e-test.yaml` },
      { name: 'FileConfigSource', path: `${root}app-config.production.yaml` },
      { name: 'FileConfigSource', path: `${root}app-config.local.yaml` },
      {
        name: 'FileConfigSource',
        path: `${root}app-config.e2e-test.local.yaml`,
      },
      {
        name: 'FileConfigSource',
        path: `${root}app-config.production.local.yaml`,
      },
    ]);

    process.env = Object.assign(process.env, {
      BACKSTAGE_ENV: ',e2e-test,,production,',
    });
    expect(
      mergeSources(
        ConfigSources.defaultForTargets({ rootDir: '/', targets: [] }),
      ),
    ).toEqual([
      { name: 'FileConfigSource', path: `${root}app-config.yaml` },
      { name: 'FileConfigSource', path: `${root}app-config.e2e-test.yaml` },
      { name: 'FileConfigSource', path: `${root}app-config.production.yaml` },
      { name: 'FileConfigSource', path: `${root}app-config.local.yaml` },
      {
        name: 'FileConfigSource',
        path: `${root}app-config.e2e-test.local.yaml`,
      },
      {
        name: 'FileConfigSource',
        path: `${root}app-config.production.local.yaml`,
      },
    ]);

    fsSpy.mockRestore();
  });

  it('should skip missing files for multiple environments', () => {
    const fsSpy = jest.spyOn(fs, 'pathExistsSync').mockImplementation(path => {
      return (
        path === `${root}app-config.yaml` ||
        path === `${root}app-config.e2e-test.yaml` ||
        path === `${root}app-config.production.local.yaml`
      );
    });

    process.env = Object.assign(process.env, {
      BACKSTAGE_ENV: 'e2e-test,production',
    });
    expect(
      mergeSources(
        ConfigSources.defaultForTargets({ rootDir: '/', targets: [] }),
      ),
    ).toEqual([
      { name: 'FileConfigSource', path: `${root}app-config.yaml` },
      { name: 'FileConfigSource', path: `${root}app-config.e2e-test.yaml` },
      {
        name: 'FileConfigSource',
        path: `${root}app-config.production.local.yaml`,
      },
    ]);

    fsSpy.mockRestore();
  });

  it('should create a default source', () => {
    const fsSpy = jest.spyOn(fs, 'pathExistsSync').mockImplementation(path => {
      return path === `${root}app-config.yaml`;
    });

    expect(
      mergeSources(
        ConfigSources.default({
          rootDir: '/',
          env: { HOME: '/' },
        }),
      ),
    ).toEqual([
      { name: 'FileConfigSource', path: `${root}app-config.yaml` },
      { name: 'EnvConfigSource', env: { HOME: '/' } },
    ]);

    expect(
      mergeSources(
        ConfigSources.default({
          rootDir: '/',
          argv: ['--config', 'a.yaml', '--config=b.yaml'],
          env: { HOME: '/' },
        }),
      ),
    ).toEqual([
      { name: 'FileConfigSource', path: resolvePath('a.yaml') },
      { name: 'FileConfigSource', path: resolvePath('b.yaml') },
      { name: 'EnvConfigSource', env: { HOME: '/' } },
    ]);

    fsSpy.mockRestore();
  });

  it('should read the default files from the Backstage installation', () => {
    const workspaceDir = createMockDirectory({
      content: {
        'package.json': '{}',
        'pnpm-workspace.yaml': 'packages:\n  - apps/**\n',
        'app-config.yaml': '',
        'apps/backstage/package.json': JSON.stringify({
          workspaces: ['packages/*'],
        }),
        'apps/backstage/app-config.yaml': '',
        'apps/backstage/app-config.local.yaml': '',
        'apps/backstage/packages/backend/package.json': '{}',
      },
    });
    const standaloneDir = createMockDirectory({
      content: { 'package.json': '{}', 'app-config.yaml': '' },
    });
    const workspaceRoot = fs.realpathSync(workspaceDir.path);
    const standaloneRoot = fs.realpathSync(standaloneDir.path);
    const cwdSpy = jest.spyOn(process, 'cwd');

    // A nested installation in a pnpm workspace has its own config files
    cwdSpy.mockReturnValue(
      resolvePath(workspaceRoot, 'apps/backstage/packages/backend'),
    );
    expect(mergeSources(ConfigSources.default({ env: {} }))).toEqual([
      {
        name: 'FileConfigSource',
        path: resolvePath(workspaceRoot, 'apps/backstage/app-config.yaml'),
      },
      {
        name: 'FileConfigSource',
        path: resolvePath(
          workspaceRoot,
          'apps/backstage/app-config.local.yaml',
        ),
      },
      { name: 'EnvConfigSource', env: {} },
    ]);

    // Without a workspace, the files are read from the working directory
    cwdSpy.mockReturnValue(standaloneRoot);
    expect(mergeSources(ConfigSources.default({ env: {} }))).toEqual([
      {
        name: 'FileConfigSource',
        path: resolvePath(standaloneRoot, 'app-config.yaml'),
      },
      { name: 'EnvConfigSource', env: {} },
    ]);

    cwdSpy.mockRestore();
  });

  it('should merge sources', () => {
    expect(
      mergeSources(
        ConfigSources.merge([
          ConfigSources.defaultForTargets({
            rootDir: '/',
            targets: [
              { type: 'path', target: '/a.yaml' },
              { type: 'path', target: '/b.yaml' },
              { type: 'path', target: '/c.yaml' },
            ],
          }),
        ]),
      ),
    ).toEqual([
      { name: 'FileConfigSource', path: `${root}a.yaml` },
      { name: 'FileConfigSource', path: `${root}b.yaml` },
      { name: 'FileConfigSource', path: `${root}c.yaml` },
    ]);
  });

  it('should create an observable config', async () => {
    const source = MutableConfigSource.create({ data: { a: 1 } });
    const config = await ConfigSources.toConfig(source);
    const listener = jest.fn();
    const sub = config.subscribe?.(listener);

    expect(config.getNumber('a')).toBe(1);
    expect(listener).not.toHaveBeenCalled();

    source.setData({ a: 2 });
    await new Promise<void>(resolve => setTimeout(resolve));
    expect(config.getNumber('a')).toBe(2);
    expect(listener).toHaveBeenCalledTimes(1);

    sub?.unsubscribe();
    source.setData({ a: 3 });
    await new Promise<void>(resolve => setTimeout(resolve));
    expect(config.getNumber('a')).toBe(3);
    expect(listener).toHaveBeenCalledTimes(1);

    config.close();
    source.setData({ a: 4 });
    await new Promise<void>(resolve => setTimeout(resolve));
    expect(config.getNumber('a')).toBe(3);
  });

  it('should fail to create config', async () => {
    await expect(
      ConfigSources.toConfig({
        async *readConfigData() {
          throw new Error('NOPE');
        },
      }),
    ).rejects.toThrow('NOPE');
  });
});
