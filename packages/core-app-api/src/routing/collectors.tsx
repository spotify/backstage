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

import { isValidElement, ReactElement, ReactNode } from 'react';
import { RouteRef } from '@backstage/core-plugin-api';
import { BackstageRouteObject } from './types';
import { getComponentData } from '../extensions';
import { createCollector } from '../extensions/traversal';
import { FeatureFlagged, FeatureFlaggedProps } from './FeatureFlagged';

function getMountPoint(node: ReactElement): RouteRef | undefined {
  const element: ReactNode = node.props?.element;

  let routeRef = getComponentData<RouteRef>(node, 'core.mountPoint');
  if (!routeRef && isValidElement(element)) {
    routeRef = getComponentData<RouteRef>(element, 'core.mountPoint');
  }

  return routeRef;
}

export const routePathCollector = createCollector(
  () => new Map<RouteRef, string>(),
  (acc, node, parent, ctxPath: string | undefined) => {
    // The context path is used during mount point gathering to assign the same path
    // to all discovered mount points
    let currentCtxPath = ctxPath;

    if (parent?.props.element === node) {
      return currentCtxPath;
    }

    // Start gathering mount points when we encounter a mount point gathering flag
    if (getComponentData<boolean>(node, 'core.gatherMountPoints')) {
      const path: string | undefined = node.props?.path;
      if (!path) {
        throw new Error('Mount point gatherer must have a path');
      }
      currentCtxPath = path;
    }

    const routeRef = getMountPoint(node);
    if (routeRef) {
      let path: string | undefined = node.props?.path;
      // If we're gathering mount points we use the context path as out path, unless
      // the element has its own path, in which case we use that instead and stop gathering
      if (currentCtxPath) {
        if (path) {
          currentCtxPath = undefined;
        } else {
          path = currentCtxPath;
        }
      }
      if (!path) {
        throw new Error('Mounted routable extension must have a path');
      }
      acc.set(routeRef, path);
    }
    return currentCtxPath;
  },
);

export const routeParentCollector = createCollector(
  () => new Map<RouteRef, RouteRef | undefined>(),
  (acc, node, parent, parentRouteRef?: RouteRef | { sticky: RouteRef }) => {
    if (parent?.props.element === node) {
      return parentRouteRef;
    }

    let nextParent = parentRouteRef;

    const routeRef = getMountPoint(node);
    if (routeRef) {
      // "sticky" route ref is when we've encountered a mount point gatherer, and we want a
      // mount points beneath it to have the same parent, regardless of internal structure
      if (parentRouteRef && 'sticky' in parentRouteRef) {
        acc.set(routeRef, parentRouteRef.sticky);

        // When we encounter a mount point with an explicit path, we stop gathering
        // mount points withing the children and remove the sticky state
        if (node.props?.path) {
          nextParent = routeRef;
        } else {
          nextParent = parentRouteRef;
        }
      } else {
        acc.set(routeRef, parentRouteRef);
        nextParent = routeRef;
      }
    }

    // Mount point gatherers are marked as "sticky"
    if (getComponentData<boolean>(node, 'core.gatherMountPoints')) {
      return { sticky: nextParent };
    }

    return nextParent;
  },
);

// We always add a child that matches all subroutes but without any route refs. This makes
// sure that we're always able to match each route no matter how deep the navigation goes.
// The route resolver then takes care of selecting the most specific match in order to find
// mount points that are as deep in the routing tree as possible.
export const MATCH_ALL_ROUTE: BackstageRouteObject = {
  caseSensitive: false,
  path: '/*',
  element: 'match-all', // These elements aren't used, so we add in a bit of debug information
  routeRefs: new Set(),
};

export const routeObjectCollector = createCollector(
  () => Array<BackstageRouteObject>(),
  (acc, node, parent, parentObj: BackstageRouteObject | undefined) => {
    const parentChildren = parentObj?.children ?? acc;
    if (parent?.props.element === node) {
      return parentObj;
    }

    const path: string | undefined = node.props?.path;
    const caseSensitive: boolean = Boolean(node.props?.caseSensitive);

    const routeRef = getMountPoint(node);
    if (routeRef) {
      if (path) {
        const newObject: BackstageRouteObject = {
          caseSensitive,
          path,
          element: 'mounted',
          routeRefs: new Set([routeRef]),
          children: [MATCH_ALL_ROUTE],
        };
        parentChildren.push(newObject);
        return newObject;
      }

      parentObj?.routeRefs.add(routeRef);
    }

    const isGatherer = getComponentData<boolean>(
      node,
      'core.gatherMountPoints',
    );
    if (isGatherer) {
      if (!path) {
        throw new Error('Mount point gatherer must have a path');
      }
      const newObject: BackstageRouteObject = {
        caseSensitive,
        path,
        element: 'gathered',
        routeRefs: new Set(),
        children: [MATCH_ALL_ROUTE],
      };
      parentChildren.push(newObject);
      return newObject;
    }

    return parentObj;
  },
);

export const featureFlagCollector = createCollector(
  () => new Set<string>(),
  (acc, node) => {
    if (node.type === FeatureFlagged) {
      const props = node.props as FeatureFlaggedProps;
      acc.add('with' in props ? props.with : props.without);
    }
  },
);
