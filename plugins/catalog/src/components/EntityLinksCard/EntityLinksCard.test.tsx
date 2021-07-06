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

import { Entity, EntityLink } from '@backstage/catalog-model';
import { EntityContext } from '@backstage/plugin-catalog-react';
import { renderWithEffects, wrapInTestApp } from '@backstage/test-utils';
import React from 'react';
import { EntityLinksCard } from './EntityLinksCard';

describe('EntityLinksCard', () => {
  const createEntity = (links: EntityLink[] = []): Entity =>
    ({
      metadata: {
        links,
      },
    } as Entity);

  const createLink = ({
    url = 'https://dashboard.dashexample.com',
    title = 'admin dashboard',
    icon = undefined,
  }: Partial<EntityLink> = {}): EntityLink => ({
    url,
    title,
    icon,
  });

  it('should render a link', async () => {
    const links: EntityLink[] = [createLink()];
    const entityContextValue = {
      entity: createEntity(links),
      loading: false,
      error: undefined,
    };

    const { queryByText } = await renderWithEffects(
      wrapInTestApp(
        <EntityContext.Provider value={entityContextValue}>
          <EntityLinksCard />
        </EntityContext.Provider>,
      ),
    );

    expect(queryByText('admin dashboard')).toBeInTheDocument();
    expect(queryByText('derp')).not.toBeInTheDocument();
  });

  it('should show empty state', async () => {
    const entityContextValue = {
      entity: createEntity([]),
      loading: false,
      error: undefined,
    };

    const { queryByText } = await renderWithEffects(
      wrapInTestApp(
        <EntityContext.Provider value={entityContextValue}>
          <EntityLinksCard />
        </EntityContext.Provider>,
      ),
    );

    expect(
      queryByText(/.*No links defined for this entity.*/),
    ).toBeInTheDocument();
    expect(queryByText('admin dashboard')).not.toBeInTheDocument();
  });
});
