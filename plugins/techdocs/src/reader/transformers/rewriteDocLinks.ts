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

import type { Transformer } from './transformer';

export const rewriteDocLinks = (): Transformer => {
  return dom => {
    const updateDom = <T extends Element>(
      list: Array<T>,
      attributeName: string,
    ): void => {
      Array.from(list)
        .filter(elem => elem.hasAttribute(attributeName))
        .forEach((elem: T) => {
          const elemAttribute = elem.getAttribute(attributeName);
          if (elemAttribute) {
            // if link is external, add target to open in a new window or tab
            if (elemAttribute.match(/^https?:\/\//i)) {
              elem.setAttribute('target', '_blank');
            }

            try {
              const normalizedWindowLocation = normalizeUrl(
                window.location.href,
              );
              elem.setAttribute(
                attributeName,
                new URL(elemAttribute, normalizedWindowLocation).toString(),
              );
            } catch (_e) {
              // Non-parseable links should be re-written as plain text.
              elem.replaceWith(elem.textContent || elemAttribute);
            }
          }
        });
    };

    updateDom(Array.from(dom.getElementsByTagName('a')), 'href');

    return dom;
  };
};

/** Make sure that the input url always ends with a '/' */
export function normalizeUrl(input: string): string {
  const url = new URL(input);

  if (!url.pathname.endsWith('/') && !url.pathname.endsWith('.html')) {
    url.pathname += '/';
  }

  return url.toString();
}
