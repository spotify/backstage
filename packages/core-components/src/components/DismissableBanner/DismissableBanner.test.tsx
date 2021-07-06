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
import { fireEvent } from '@testing-library/react';
import { renderWithEffects, wrapInTestApp } from '@backstage/test-utils';
import { DismissableBanner } from './DismissableBanner';
import { ApiRegistry, ApiProvider, WebStorage } from '@backstage/core-app-api';
import { storageApiRef, StorageApi } from '@backstage/core-plugin-api';

describe('<DismissableBanner />', () => {
  let apis: ApiRegistry;
  const mockErrorApi = { post: jest.fn(), error$: jest.fn() };
  const createWebStorage = (): StorageApi => {
    return WebStorage.create({
      errorApi: mockErrorApi,
    });
  };

  beforeEach(() => {
    apis = ApiRegistry.from([[storageApiRef, createWebStorage()]]);
  });

  it('renders the message and the popover', async () => {
    const rendered = await renderWithEffects(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <DismissableBanner
            variant="info"
            // setting={mockSetting}
            message="test message"
            id="catalog_page_welcome_banner"
          />
        </ApiProvider>,
      ),
    );
    const element = await rendered.findByText('test message');
    expect(element).toBeInTheDocument();
  });

  it('gets placed in local storage on dismiss', async () => {
    const rendered = await renderWithEffects(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <DismissableBanner
            variant="info"
            // setting={mockSetting}
            message="test message"
            id="catalog_page_welcome_banner"
          />
        </ApiProvider>,
      ),
    );
    const webstore = apis.get(storageApiRef);
    const notifications = webstore?.forBucket('notifications');
    const button = await rendered.findByTitle(
      'Permanently dismiss this message',
    );
    fireEvent.click(button);
    const dismissedBanners =
      notifications?.get<string[]>('dismissedBanners') ?? [];
    expect(
      dismissedBanners.includes('catalog_page_welcome_banner'),
    ).toBeTruthy();
  });
});
