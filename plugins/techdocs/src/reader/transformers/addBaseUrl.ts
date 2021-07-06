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
import { EntityName } from '@backstage/catalog-model';
import type { Transformer } from './transformer';
import { TechDocsStorageApi } from '../../api';

type AddBaseUrlOptions = {
  techdocsStorageApi: TechDocsStorageApi;
  entityId: EntityName;
  path: string;
};

/**
 * TechDocs backend serves SVGs with text/plain content-type for security. This
 * helper determines if an SVG is being loaded from the backend, and thus needs
 * inlining to be displayed properly.
 */
const isSvgNeedingInlining = (
  attrName: string,
  attrVal: string,
  apiOrigin: string,
) => {
  const isSrcToSvg = attrName === 'src' && attrVal.endsWith('.svg');
  const isRelativeUrl = !attrVal.match(/^([a-z]*:)?\/\//i);
  const pointsToOurBackend = attrVal.startsWith(apiOrigin);
  return isSrcToSvg && (isRelativeUrl || pointsToOurBackend);
};

export const addBaseUrl = ({
  techdocsStorageApi,
  entityId,
  path,
}: AddBaseUrlOptions): Transformer => {
  return dom => {
    const updateDom = <T extends Element>(
      list: HTMLCollectionOf<T> | NodeListOf<T>,
      attributeName: string,
    ): void => {
      Array.from(list)
        .filter(elem => !!elem.getAttribute(attributeName))
        .forEach(async (elem: T) => {
          const elemAttribute = elem.getAttribute(attributeName);
          if (!elemAttribute) return;

          // Special handling for SVG images.
          const newValue = await techdocsStorageApi.getBaseUrl(
            elemAttribute,
            entityId,
            path,
          );
          const apiOrigin = await techdocsStorageApi.getApiOrigin();
          if (isSvgNeedingInlining(attributeName, elemAttribute, apiOrigin)) {
            try {
              const svg = await fetch(newValue, { credentials: 'include' });
              const svgContent = await svg.text();
              elem.setAttribute(
                attributeName,
                `data:image/svg+xml;base64,${btoa(svgContent)}`,
              );
            } catch (e) {
              elem.setAttribute('alt', `Error: ${elemAttribute}`);
            }
          } else {
            elem.setAttribute(attributeName, newValue);
          }
        });
    };

    updateDom<HTMLImageElement>(dom.querySelectorAll('img'), 'src');
    updateDom<HTMLScriptElement>(dom.querySelectorAll('script'), 'src');
    updateDom<HTMLLinkElement>(dom.querySelectorAll('link'), 'href');
    updateDom<HTMLAnchorElement>(dom.querySelectorAll('a[download]'), 'href');

    return dom;
  };
};
