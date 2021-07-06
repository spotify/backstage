/*
 * Copyright 2021 The Backstage Authors
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
import { Entity } from '@backstage/catalog-model';
import { renderWithEffects } from '@backstage/test-utils';
import { BadgesApi, badgesApiRef } from '../api';
import { EntityBadgesDialog } from './EntityBadgesDialog';
import { EntityProvider } from '@backstage/plugin-catalog-react';

import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';
import { ErrorApi, errorApiRef } from '@backstage/core-plugin-api';

describe('EntityBadgesDialog', () => {
  it('should render', async () => {
    const mockApi: jest.Mocked<BadgesApi> = {
      getEntityBadgeSpecs: jest.fn().mockResolvedValue([
        {
          id: 'testbadge',
          badge: {
            label: 'test',
            message: 'badge',
          },
          url: 'http://127.0.0.1/badges/entity/.../testbadge',
          markdown: '![test: badge](http://127.0.0.1/catalog/...)',
        },
      ]),
    };
    const mockEntity = { metadata: { name: 'mock' } } as Entity;

    const rendered = await renderWithEffects(
      <ApiProvider
        apis={ApiRegistry.with(badgesApiRef, mockApi).with(
          errorApiRef,
          {} as ErrorApi,
        )}
      >
        <EntityProvider entity={mockEntity}>
          <EntityBadgesDialog open />
        </EntityProvider>
      </ApiProvider>,
    );

    await expect(
      rendered.findByText('![test: badge](http://127.0.0.1/catalog/...)'),
    ).resolves.toBeInTheDocument();
  });
});
