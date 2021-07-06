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

import { renderWithEffects, wrapInTestApp } from '@backstage/test-utils';
import { fireEvent } from '@testing-library/react';
import React from 'react';
import { AuthProviders } from './AuthProviders';

import {
  ApiProvider,
  ApiRegistry,
  ConfigReader,
} from '@backstage/core-app-api';
import { configApiRef, googleAuthApiRef } from '@backstage/core-plugin-api';

const mockSignInHandler = jest.fn().mockReturnValue('');
const mockGoogleAuth = {
  sessionState$: () => ({
    subscribe: () => ({
      unsubscribe: () => null,
    }),
  }),
  signIn: mockSignInHandler,
};

const createConfig = () =>
  new ConfigReader({
    auth: {
      providers: {
        google: { development: {} },
      },
    },
  });

const config = createConfig();

const apiRegistry = ApiRegistry.from([
  [configApiRef, config],
  [googleAuthApiRef, mockGoogleAuth],
]);

describe('<AuthProviders />', () => {
  it('displays a provider and calls its sign-in handler on click', async () => {
    const rendered = await renderWithEffects(
      wrapInTestApp(
        <ApiProvider apis={apiRegistry}>
          <AuthProviders />
        </ApiProvider>,
      ),
    );

    expect(rendered.getByText('Google')).toBeInTheDocument();
    expect(
      rendered.getByText(
        'Provides authentication towards Google APIs and identities',
      ),
    ).toBeInTheDocument();

    const button = rendered.getByTitle('Sign in to Google');
    fireEvent.click(button);
    expect(mockSignInHandler).toHaveBeenCalledTimes(1);
  });
});
