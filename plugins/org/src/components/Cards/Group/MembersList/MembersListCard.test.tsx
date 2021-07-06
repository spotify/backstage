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

import { Entity, GroupEntity } from '@backstage/catalog-model';
import {
  CatalogApi,
  catalogApiRef,
  EntityProvider,
} from '@backstage/plugin-catalog-react';
import { renderWithEffects, wrapInTestApp } from '@backstage/test-utils';
import React from 'react';
import { MembersListCard } from './MembersListCard';
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';

describe('MemberTab Test', () => {
  const groupEntity: GroupEntity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Group',
    metadata: {
      name: 'team-d',
      description: 'The evil-corp organization',
      namespace: 'default',
    },
    spec: {
      type: 'team',
      parent: 'boxoffice',
      children: [],
    },
  };

  const catalogApi: Partial<CatalogApi> = {
    getEntities: () =>
      Promise.resolve({
        items: [
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'User',
            metadata: {
              name: 'tara.macgovern',
              namespace: 'foo-bar',
              uid: 'a5gerth56',
            },
            relations: [
              {
                type: 'memberOf',
                target: {
                  kind: 'group',
                  name: 'team-d',
                  namespace: 'default',
                },
              },
            ],
            spec: {
              profile: {
                displayName: 'Tara MacGovern',
                email: 'tara-macgovern@example.com',
                picture: 'https://example.com/staff/tara.jpeg',
              },
              memberOf: ['team-d'],
            },
          },
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'User',
            metadata: {
              name: 'sara.macgovern',
              namespace: 'default',
              uid: 'a5gerth57',
            },
            relations: [
              {
                type: 'memberOf',
                target: {
                  kind: 'group',
                  name: 'team-d',
                  namespace: 'foo-bar',
                },
              },
            ],
            spec: {
              profile: {
                displayName: 'Sara MacGovern',
                email: 'sara-macgovern@example.com',
                picture: 'https://example.com/staff/sara.jpeg',
              },
              memberOf: ['foo-bar/team-d'],
            },
          },
        ] as Entity[],
      }),
  };

  const apis = ApiRegistry.from([[catalogApiRef, catalogApi]]);

  it('Display Profile Card', async () => {
    const rendered = await renderWithEffects(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <EntityProvider entity={groupEntity}>
            <MembersListCard />
          </EntityProvider>
          ,
        </ApiProvider>,
      ),
    );

    expect(rendered.getByAltText('Tara MacGovern')).toHaveAttribute(
      'src',
      'https://example.com/staff/tara.jpeg',
    );
    expect(
      rendered.getByText('tara-macgovern@example.com'),
    ).toBeInTheDocument();
    expect(rendered.getByText('Tara MacGovern')).toHaveAttribute(
      'href',
      '/catalog/foo-bar/user/tara.macgovern',
    );

    expect(rendered.getByText('Members (1)')).toBeInTheDocument();
  });
});
