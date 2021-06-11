/*
 * Copyright 2020 Spotify AB
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

import { isValidElement, ReactNode, ReactElement, Children } from 'react';

export type Discoverer = (element: ReactElement) => ReactNode;

export type Collector<Result, Context> = () => {
  accumulator: Result;
  visit(
    accumulator: Result,
    element: ReactElement,
    parent: ReactElement | undefined,
    context: Context,
  ): Context;
};

/**
 * A function that allows you to traverse a tree of React elements using
 * varying methods to discover child nodes and collect data along the way.
 */
export function traverseElementTree<Results>(options: {
  root: ReactNode;
  discoverers: Discoverer[];
  collectors: { [name in keyof Results]: Collector<Results[name], any> };
}): Results {
  const collectors: {
    [name in string]: ReturnType<Collector<any, any>>;
  } = {};

  // Bootstrap all collectors, initializing the accumulators and providing the visitor function
  for (const name in options.collectors) {
    if (options.collectors.hasOwnProperty(name)) {
      collectors[name] = options.collectors[name]();
    }
  }

  // Internal representation of an element in the tree that we're iterating over
  type QueueItem = {
    node: ReactNode;
    parent: ReactElement | undefined;
    contexts: { [name in string]: unknown };
  };

  const queue = [
    {
      node: Children.toArray(options.root),
      parent: undefined,
      contexts: {},
    } as QueueItem,
  ];

  while (queue.length !== 0) {
    const { node, parent, contexts } = queue.shift()!;

    // While the parent and the element we pass on to collectors and discoverers
    // have been validated and are known to be React elements, the child nodes
    // emitted by the discoverers are not.
    Children.forEach(node, element => {
      if (!isValidElement(element)) {
        return;
      }

      const nextContexts: QueueItem['contexts'] = {};

      // Collectors populate their result data using the current node, and compute
      // context for the next iteration
      for (const name in collectors) {
        if (collectors.hasOwnProperty(name)) {
          const collector = collectors[name];

          nextContexts[name] = collector.visit(
            collector.accumulator,
            element,
            parent,
            contexts[name],
          );
        }
      }

      // Discoverers provide ways to continue the traversal from the current element
      for (const discoverer of options.discoverers) {
        const children = discoverer(element);
        if (children) {
          queue.push({
            node: children,
            parent: element,
            contexts: nextContexts,
          });
        }
      }
    });
  }

  return Object.fromEntries(
    Object.entries(collectors).map(([name, c]) => [name, c.accumulator]),
  ) as Results;
}

export function createCollector<Result, Context>(
  accumulatorFactory: () => Result,
  visit: ReturnType<Collector<Result, Context>>['visit'],
): Collector<Result, Context> {
  return () => ({ accumulator: accumulatorFactory(), visit });
}

export function childDiscoverer(element: ReactElement): ReactNode {
  return element.props?.children;
}

export function routeElementDiscoverer(element: ReactElement): ReactNode {
  if (element.props?.path && element.props?.element) {
    return element.props?.element;
  }
  return undefined;
}
