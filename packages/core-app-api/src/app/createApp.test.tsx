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

import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { defaultConfigLoader, OptionallyWrapInRouter } from './createApp';

(process as any).env = { NODE_ENV: 'test' };
const anyEnv = process.env as any;
const anyWindow = window as any;

describe('defaultConfigLoader', () => {
  afterEach(() => {
    delete anyEnv.APP_CONFIG;
    delete anyWindow.__APP_CONFIG__;
  });

  it('loads static config', async () => {
    anyEnv.APP_CONFIG = [
      { data: { my: 'config' }, context: 'a' },
      { data: { my: 'override-config' }, context: 'b' },
    ];

    const configs = await defaultConfigLoader();
    expect(configs).toEqual([
      { data: { my: 'config' }, context: 'a' },
      { data: { my: 'override-config' }, context: 'b' },
    ]);
  });

  it('loads runtime config', async () => {
    anyEnv.APP_CONFIG = [
      { data: { my: 'override-config' }, context: 'a' },
      { data: { my: 'config' }, context: 'b' },
    ];

    const configs = await (defaultConfigLoader as any)(
      '{"my":"runtime-config"}',
    );
    expect(configs).toEqual([
      { data: { my: 'override-config' }, context: 'a' },
      { data: { my: 'config' }, context: 'b' },
      { data: { my: 'runtime-config' }, context: 'env' },
    ]);
  });

  it('fails to load invalid missing config', async () => {
    await expect(defaultConfigLoader()).rejects.toThrow(
      'No static configuration provided',
    );
  });

  it('fails to load invalid static config', async () => {
    anyEnv.APP_CONFIG = { my: 'invalid-config' };
    await expect(defaultConfigLoader()).rejects.toThrow(
      'Static configuration has invalid format',
    );
  });

  it('fails to load bad runtime config', async () => {
    anyEnv.APP_CONFIG = [{ data: { my: 'config' }, context: 'a' }];

    await expect((defaultConfigLoader as any)('}')).rejects.toThrow(
      'Failed to load runtime configuration, SyntaxError: Unexpected token } in JSON at position 0',
    );
  });

  it('loads config from window.__APP_CONFIG__', async () => {
    anyEnv.APP_CONFIG = [
      { data: { my: 'config' }, context: 'a' },
      { data: { my: 'override-config' }, context: 'b' },
    ];
    const windowConfig = { app: { configKey: 'config-value' } };
    anyWindow.__APP_CONFIG__ = windowConfig;

    const configs = await defaultConfigLoader();

    expect(configs).toEqual([
      ...anyEnv.APP_CONFIG,
      { context: 'window', data: windowConfig },
    ]);
  });
});

describe('OptionallyWrapInRouter', () => {
  it('should wrap with router if not yet inside a router', async () => {
    const { getByText } = render(
      <OptionallyWrapInRouter>Test</OptionallyWrapInRouter>,
    );

    expect(getByText('Test')).toBeInTheDocument();
  });

  it('should not wrap with router if already inside a router', async () => {
    const { getByText } = render(
      <MemoryRouter>
        <OptionallyWrapInRouter>Test</OptionallyWrapInRouter>
      </MemoryRouter>,
    );

    expect(getByText('Test')).toBeInTheDocument();
  });
});
