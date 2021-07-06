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
import {
  Entity,
  EntityName,
  ENTITY_DEFAULT_NAMESPACE,
} from '@backstage/catalog-model';
import React, { forwardRef } from 'react';
import { generatePath } from 'react-router';
import { entityRoute } from '../../routes';
import { formatEntityRefTitle } from './format';
import { Link, LinkProps } from '@backstage/core-components';

export type EntityRefLinkProps = {
  entityRef: Entity | EntityName;
  defaultKind?: string;
  children?: React.ReactNode;
} & Omit<LinkProps, 'to'>;

export const EntityRefLink = forwardRef<any, EntityRefLinkProps>(
  (props, ref) => {
    const { entityRef, defaultKind, children, ...linkProps } = props;

    let kind;
    let namespace;
    let name;

    if ('metadata' in entityRef) {
      kind = entityRef.kind;
      namespace = entityRef.metadata.namespace;
      name = entityRef.metadata.name;
    } else {
      kind = entityRef.kind;
      namespace = entityRef.namespace;
      name = entityRef.name;
    }

    kind = kind.toLocaleLowerCase('en-US');

    const routeParams = {
      kind,
      namespace:
        namespace?.toLocaleLowerCase('en-US') ?? ENTITY_DEFAULT_NAMESPACE,
      name,
    };

    // TODO: Use useRouteRef here to generate the path
    return (
      <Link
        {...linkProps}
        ref={ref}
        to={generatePath(`/catalog/${entityRoute.path}`, routeParams)}
      >
        {children}
        {!children && formatEntityRefTitle(entityRef, { defaultKind })}
      </Link>
    );
  },
);
