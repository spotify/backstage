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

// Find all active hot module APIs of all ancestors of a module, including the module itself
function findAllAncestors(_module: NodeModule): NodeModule[] {
  const ancestors = new Array<NodeModule>();
  const parentIds = new Set<string | number>();

  function add(id: string | number, m: NodeModule) {
    if (parentIds.has(id)) {
      return;
    }
    parentIds.add(id);
    ancestors.push(m);

    for (const parentId of (m as any).parents) {
      const parent = require.cache[parentId];
      if (parent) {
        add(parentId, parent);
      }
    }
  }

  add(_module.id, _module);

  return ancestors;
}

/**
 * useHotCleanup allows cleanup of ongoing effects when a module is
 * hot-reloaded during development. The cleanup function will be called
 * whenever the module itself or any of its parent modules is hot-reloaded.
 *
 * Useful for cleaning intervals, timers, requests etc
 *
 * @example
 * ```ts
 * const intervalId = setInterval(doStuff, 1000);
 * useHotCleanup(module, () => clearInterval(intervalId));
 * ```
 * @param _module Reference to the current module where you invoke the fn
 * @param cancelEffect Fn that cleans up the ongoing effects
 */
export function useHotCleanup(_module: NodeModule, cancelEffect: () => void) {
  if (_module.hot) {
    const ancestors = findAllAncestors(_module);
    let cancelled = false;

    const handler = () => {
      if (!cancelled) {
        cancelled = true;
        cancelEffect();
      }
    };

    for (const m of ancestors) {
      m.hot?.addDisposeHandler(handler);
    }
  }
}

const CURRENT_HOT_MEMOIZE_INDEX_KEY = 'backstage.io/hmr-memoize-key';

/**
 * Memoizes a generated value across hot-module reloads. This is useful for
 * stateful parts of the backend, e.g. to retain a database.
 *
 * @example
 * ```ts
 * const db = useHotMemoize(module, () => createDB(dbParams));
 * ```
 *
 * @warning Don't use inside conditionals or loops,
 * same rules as for hooks apply (https://reactjs.org/docs/hooks-rules.html)
 *
 * @param _module Reference to the current module where you invoke the fn
 * @param valueFactory Fn that returns the value you want to memoize
 */
export function useHotMemoize<T>(
  _module: NodeModule,
  valueFactory: () => T,
): T {
  if (!_module.hot) {
    return valueFactory();
  }

  // When starting blank, reset the counter
  if (!_module.hot.data?.[CURRENT_HOT_MEMOIZE_INDEX_KEY]) {
    for (const ancestor of findAllAncestors(_module)) {
      ancestor.hot?.addDisposeHandler(data => {
        data[CURRENT_HOT_MEMOIZE_INDEX_KEY] = 1;
      });
    }

    _module.hot.data = {
      ..._module.hot.data,
      [CURRENT_HOT_MEMOIZE_INDEX_KEY]: 1,
    };
  }

  // Store data per module, based on the order of the code invocation
  const index = _module.hot.data[CURRENT_HOT_MEMOIZE_INDEX_KEY]++;
  const value = _module.hot.data[index] ?? valueFactory();

  // Always add a handler that, upon a HMR event, reinstates the value.
  _module.hot.addDisposeHandler(data => {
    data[index] = value;
  });

  return value;
}
