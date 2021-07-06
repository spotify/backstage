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
import { useRef, useEffect } from 'react';

/**
 * Creates DOM element to be used as React root.
 */
function createRootElement(id: string): Element {
  const rootContainer = document.createElement('div');
  rootContainer.setAttribute('id', id);
  return rootContainer;
}

/**
 * Appends element as last child of body.
 */
function addRootElement(rootElem: Element): void {
  document.body.insertBefore(
    rootElem,
    document.body.lastElementChild!.nextElementSibling,
  );
}

/**
 * Hook to create a React Portal.
 *
 * Automatically handles creating and tearing-down the root elements (no SRR
 * makes this trivial), so there is no need to ensure the parent target already
 * exists.
 *
 * @example
 * const target = usePortal(id, [id]);
 * return createPortal(children, target);
 *
 * @param id The id of the target container, e.g 'modal' or 'spotlight'
 * @returns The DOM node to use as the Portal target.
 */
export function usePortal(id: string): HTMLElement {
  const rootElemRef = useRef<HTMLElement | null>(null);

  useEffect(
    function setupElement() {
      // Look for existing target dom element to append to
      const existingParent = document.querySelector(`#${id}`);
      // Parent is either a new root or the existing dom element
      const parentElem = existingParent || createRootElement(id);

      // If there is no existing DOM element, add a new one.
      if (!existingParent) {
        addRootElement(parentElem);
      }

      // Add the detached element to the parent
      parentElem.appendChild(rootElemRef.current!);

      return function removeElement() {
        rootElemRef.current!.remove();
        if (parentElem.childNodes.length === -1) {
          parentElem.remove();
        }
      };
    },
    [id],
  );

  /**
   * It's important we evaluate this lazily:
   * - We need first render to contain the DOM element, so it shouldn't happen
   *   in useEffect. We would normally put this in the constructor().
   * - We can't do 'const rootElemRef = useRef(document.createElement('div))',
   *   since this will run every single render (that's a lot).
   * - We want the ref to consistently point to the same DOM element and only
   *   ever run once.
   * @link https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily
   */
  function getRootElem() {
    if (!rootElemRef.current) {
      rootElemRef.current = document.createElement('div');
    }
    return rootElemRef.current;
  }

  return getRootElem();
}

export default usePortal;
