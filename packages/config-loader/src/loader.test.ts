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

import { loadConfig } from './loader';
import mockFs from 'mock-fs';

describe('loadConfig', () => {
  beforeAll(() => {
    process.env.MY_SECRET = 'is-secret';
    process.env.SUBSTITUTE_ME = 'substituted';

    mockFs({
      '/root/app-config.yaml': `
        app:
          title: Example App
          sessionKey:
            $file: secrets/session-key.txt
          escaped: \$\${Escaped}
      `,
      '/root/app-config.development.yaml': `
        app:
          sessionKey: development-key
        backend:
          $include: ./included.yaml
        other:
          $include: secrets/included.yaml
      `,
      '/root/secrets/session-key.txt': 'abc123',
      '/root/secrets/included.yaml': `
        secret:
          $file: session-key.txt
      `,
      '/root/included.yaml': `
        foo:
          bar: token \${MY_SECRET}
      `,
      '/root/app-config.substitute.yaml': `
        app:
          someConfig:
            $include: \${SUBSTITUTE_ME}.yaml
          noSubstitute:
            $file: \$\${ESCAPE_ME}.txt
      `,
      '/root/substituted.yaml': `
        secret:
          $file: secrets/\${SUBSTITUTE_ME}.txt
      `,
      '/root/secrets/substituted.txt': '123abc',
      '/root/${ESCAPE_ME}.txt': 'notSubstituted',
    });
  });

  afterAll(() => {
    mockFs.restore();
  });

  it('load config from default path', async () => {
    await expect(
      loadConfig({
        configRoot: '/root',
        configPaths: [],
        env: 'production',
      }),
    ).resolves.toEqual([
      {
        context: 'app-config.yaml',
        data: {
          app: {
            title: 'Example App',
            sessionKey: 'abc123',
            escaped: '${Escaped}',
          },
        },
      },
    ]);
  });

  it('loads config with secrets', async () => {
    await expect(
      loadConfig({
        configRoot: '/root',
        configPaths: ['/root/app-config.yaml'],
        env: 'production',
      }),
    ).resolves.toEqual([
      {
        context: 'app-config.yaml',
        data: {
          app: {
            title: 'Example App',
            sessionKey: 'abc123',
            escaped: '${Escaped}',
          },
        },
      },
    ]);
  });

  it('loads development config with secrets', async () => {
    await expect(
      loadConfig({
        configRoot: '/root',
        configPaths: [
          '/root/app-config.yaml',
          '/root/app-config.development.yaml',
        ],
        env: 'development',
      }),
    ).resolves.toEqual([
      {
        context: 'app-config.yaml',
        data: {
          app: {
            title: 'Example App',
            sessionKey: 'abc123',
            escaped: '${Escaped}',
          },
        },
      },
      {
        context: 'app-config.development.yaml',
        data: {
          app: {
            sessionKey: 'development-key',
          },
          backend: {
            foo: {
              bar: 'token is-secret',
            },
          },
          other: {
            secret: 'abc123',
          },
        },
      },
    ]);
  });

  it('loads deep substituted config', async () => {
    await expect(
      loadConfig({
        configRoot: '/root',
        configPaths: ['/root/app-config.substitute.yaml'],
        env: 'development',
      }),
    ).resolves.toEqual([
      {
        context: 'app-config.substitute.yaml',
        data: {
          app: {
            someConfig: {
              secret: '123abc',
            },
            noSubstitute: 'notSubstituted',
          },
        },
      },
    ]);
  });
});
