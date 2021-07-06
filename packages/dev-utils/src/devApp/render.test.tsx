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
import { render } from '@testing-library/react';
import { createDevApp } from './render';
import { useApi, configApiRef } from '@backstage/core-plugin-api';

const anyEnv = (process.env = { ...process.env }) as any;

describe('DevAppBuilder', () => {
  it('should be able to render a component in a dev app', async () => {
    anyEnv.APP_CONFIG = [
      { context: 'test', data: { app: { title: 'Test App' } } },
    ];

    const MyComponent = () => {
      const configApi = useApi(configApiRef);
      return <div>My App: {configApi.getString('app.title')}</div>;
    };

    const DevApp = createDevApp()
      .addRootChild(<MyComponent key="test-key" />)
      .build();

    const rendered = render(<DevApp />);

    expect(await rendered.findByText('My App: Test App')).toBeInTheDocument();
  });
});
