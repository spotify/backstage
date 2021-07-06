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
import {
  Children,
  Fragment,
  isValidElement,
  ReactNode,
  ReactElement,
  useMemo,
} from 'react';
import { getComponentData } from './componentData';
import { useApi, FeatureFlagsApi, featureFlagsApiRef } from '../apis';

function selectChildren(
  rootNode: ReactNode,
  featureFlagsApi: FeatureFlagsApi,
  selector?: (element: ReactElement<unknown>) => boolean,
  strictError?: string,
): Array<ReactElement<unknown>> {
  return Children.toArray(rootNode).flatMap(node => {
    if (!isValidElement(node)) {
      return [];
    }

    if (node.type === Fragment) {
      return selectChildren(
        node.props.children,
        featureFlagsApi,
        selector,
        strictError,
      );
    }

    if (getComponentData(node, 'core.featureFlagged')) {
      const props = node.props as { with: string } | { without: string };
      const isEnabled =
        'with' in props
          ? featureFlagsApi.isActive(props.with)
          : !featureFlagsApi.isActive(props.without);
      if (isEnabled) {
        return selectChildren(
          node.props.children,
          featureFlagsApi,
          selector,
          strictError,
        );
      }
      return [];
    }

    if (selector === undefined || selector(node)) {
      return [node];
    }

    if (strictError) {
      throw new Error(strictError);
    }

    return selectChildren(
      node.props.children,
      featureFlagsApi,
      selector,
      strictError,
    );
  });
}

/**
 * A querying interface tailored to traversing a set of selected React elements
 * and extracting data.
 *
 * Methods prefixed with `selectBy` are used to narrow the set of selected elements.
 *
 * Methods prefixed with `find` return concrete data using a deep traversal of the set.
 *
 * Methods prefixed with `get` return concrete data using a shallow traversal of the set.
 */
export interface ElementCollection {
  /**
   * Narrows the set of selected components by doing a deep traversal and
   * only including those that have defined component data for the given `key`.
   *
   * Whether an element in the tree has component data set for the given key
   * is determined by whether `getComponentData` returns undefined.
   *
   * The traversal does not continue deeper past elements that match the criteria,
   * and it also includes the root children in the selection, meaning that if the,
   * of all the currently selected elements contain data for the given key, this
   * method is a no-op.
   *
   * If `withStrictError` is set, the resulting selection must be a full match, meaning
   * there may be no elements that were excluded in the selection. If the selection
   * is not a clean match, an error will be throw with `withStrictError` as the message.
   */
  selectByComponentData(query: {
    key: string;
    withStrictError?: string;
  }): ElementCollection;

  /**
   * Finds all elements using the same criteria as `selectByComponentData`, but
   * returns the actual component data of each of those elements instead.
   */
  findComponentData<T>(query: { key: string }): T[];

  /**
   * Returns all of the elements currently selected by this collection.
   */
  getElements<Props extends { [name: string]: unknown }>(): Array<
    ReactElement<Props>
  >;
}

class Collection implements ElementCollection {
  constructor(
    private readonly node: ReactNode,
    private readonly featureFlagsApi: FeatureFlagsApi,
  ) {}

  selectByComponentData(query: { key: string; withStrictError?: string }) {
    const selection = selectChildren(
      this.node,
      this.featureFlagsApi,
      node => getComponentData(node, query.key) !== undefined,
      query.withStrictError,
    );
    return new Collection(selection, this.featureFlagsApi);
  }

  findComponentData<T>(query: { key: string }): T[] {
    const selection = selectChildren(
      this.node,
      this.featureFlagsApi,
      node => getComponentData(node, query.key) !== undefined,
    );
    return selection
      .map(node => getComponentData<T>(node, query.key))
      .filter((data: T | undefined): data is T => data !== undefined);
  }

  getElements<Props extends { [name: string]: unknown }>(): Array<
    ReactElement<Props>
  > {
    return selectChildren(this.node, this.featureFlagsApi) as Array<
      ReactElement<Props>
    >;
  }
}

/**
 * useElementFilter is a utility that helps you narrow down and retrieve data
 * from a React element tree, typically operating on the `children` property
 * passed in to a component. A common use-case is to construct declarative APIs
 * where a React component defines its behavior based on its children, such as
 * the relationship between `Routes` and `Route` in `react-router`.
 *
 * The purpose of this hook is similar to `React.Children.map`, and it expands upon
 * it to also handle traversal of fragments and Backstage specific things like the
 * `FeatureFlagged` component.
 *
 * The return value of the hook is computed by the provided filter function, but
 * with added memoization based on the input `node`. If further memoization
 * dependencies are used in the filter function, they should be added to the
 * third `dependencies` argument, just like `useMemo`, `useEffect`, etc.
 */
export function useElementFilter<T>(
  node: ReactNode,
  filterFn: (arg: ElementCollection) => T,
  dependencies: any[] = [],
) {
  const featureFlagsApi = useApi(featureFlagsApiRef);
  const elements = new Collection(node, featureFlagsApi);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => filterFn(elements), [node, ...dependencies]);
}
