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

import { UserEntity } from '@backstage/catalog-model';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { renderWithEffects, wrapInTestApp } from '@backstage/test-utils';
import React from 'react';
import { UserProfileCard } from './UserProfileCard';

describe('UserSummary Test', () => {
  const userEntity: UserEntity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'User',
    metadata: {
      name: 'calum.leavy',
    },
    spec: {
      profile: {
        displayName: 'Calum Leavy',
        email: 'calum-leavy@example.com',
        picture: 'https://example.com/staff/calum.jpeg',
      },
      memberOf: ['ExampleGroup'],
    },
    relations: [
      {
        type: 'memberOf',
        target: {
          kind: 'group',
          name: 'ExampleGroup',
          namespace: 'default',
        },
      },
    ],
  };

  it('Display Profile Card', async () => {
    const rendered = await renderWithEffects(
      wrapInTestApp(
        <EntityProvider entity={userEntity}>
          <UserProfileCard entity={userEntity} variant="gridItem" />
        </EntityProvider>,
      ),
    );

    expect(rendered.getByText('calum-leavy@example.com')).toBeInTheDocument();
    expect(rendered.getByAltText('Calum Leavy')).toHaveAttribute(
      'src',
      'https://example.com/staff/calum.jpeg',
    );
    expect(rendered.getByText('ExampleGroup')).toHaveAttribute(
      'href',
      '/catalog/default/group/ExampleGroup',
    );
  });
});
