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
import { Entity, EntityName } from '@backstage/catalog-model';
import React from 'react';
import { EntityRefLink } from './EntityRefLink';
import { LinkProps } from '@backstage/core-components';

export type EntityRefLinksProps = {
  entityRefs: (Entity | EntityName)[];
  defaultKind?: string;
} & Omit<LinkProps, 'to'>;

export const EntityRefLinks = ({
  entityRefs,
  defaultKind,
  ...linkProps
}: EntityRefLinksProps) => (
  <>
    {entityRefs.map((r, i) => (
      <React.Fragment key={i}>
        {i > 0 && ', '}
        <EntityRefLink {...linkProps} entityRef={r} defaultKind={defaultKind} />
      </React.Fragment>
    ))}
  </>
);
