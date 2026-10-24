/*
 * Copyright 2022 The Backstage Authors
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

import { TestApiProvider } from '@backstage/test-utils';
// eslint-disable-next-line no-restricted-imports
import { TextEncoder } from 'node:util';
import {
  base64EncodeContent,
  DryRunProvider,
  useDryRun,
} from './DryRunContext';

import { errorApiRef } from '@backstage/core-plugin-api';
import {
  scaffolderApiRef,
  SecretsContextProvider,
} from '@backstage/plugin-scaffolder-react';
import { renderHook } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import { formDecoratorsApiRef } from '../../api';

window.TextEncoder = TextEncoder as any;

describe('base64EncodeContent', () => {
  it('encodes text files', () => {
    expect(base64EncodeContent('abc')).toBe('YWJj');
    expect(base64EncodeContent('abc'.repeat(1000000))).toBe(
      window.btoa('<file too large>'),
    );
  });

  it('encodes binary files', () => {
    expect(base64EncodeContent('\x00\x01\x02')).toBe('AAEC');
    expect(base64EncodeContent('😅')).toBe('8J+YhQ==');
    // Triggers chunking
    expect(base64EncodeContent('😅'.repeat(18000))).toBe(
      '8J+YhfCfmIXwn5iF8J+YhfCfmIXwn5iF'.repeat(3000),
    );
    // Triggers size check
    expect(base64EncodeContent('😅'.repeat(1000000))).toBe(
      window.btoa('<file too large>'),
    );
  });

  it('encodes characters that btoa would emit as single bytes', () => {
    // btoa succeeds for U+0080-U+00FF and would emit one Latin-1 byte each,
    // which is not valid UTF-8 when the content is decoded again
    expect(base64EncodeContent('ä')).toBe('w6Q=');
  });
});

describe('DryRunProvider', () => {
  describe('execute', () => {
    it('passes the secrets from the SecretsContext to the dryRun call', async () => {
      const scaffolderApiMock = {
        dryRun: jest.fn(),
      };

      const formDecoratorsApiMock = {
        getFormDecorators: jest.fn().mockResolvedValue([]),
      };
      const { result } = renderHook(
        () => ({
          hook: useDryRun(),
        }),
        {
          wrapper: ({ children }: PropsWithChildren<{}>) => (
            <TestApiProvider
              apis={[
                [scaffolderApiRef, scaffolderApiMock],
                [formDecoratorsApiRef, formDecoratorsApiMock],
                [errorApiRef, { post: jest.fn() }],
              ]}
            >
              <SecretsContextProvider initialSecrets={{ foo: 'bar' }}>
                <DryRunProvider>{children}</DryRunProvider>
              </SecretsContextProvider>
            </TestApiProvider>
          ),
        },
      );

      const {
        hook: { execute },
      } = result.current;

      // When
      await execute({
        templateContent: 'content',
        values: {},
        files: [],
      });

      // Then
      expect(scaffolderApiMock.dryRun).toHaveBeenCalledWith({
        template: 'content',
        values: {},
        secrets: { foo: 'bar' },
        directoryContents: [],
      });
    });
  });
});
