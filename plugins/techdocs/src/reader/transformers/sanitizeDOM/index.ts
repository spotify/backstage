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

import sanitizeHtml from 'sanitize-html';
import type { Transformer } from '..';
import { TECHDOCS_ALLOWED_TAGS } from './tags';
import { TECHDOCS_ALLOWED_ATTRIBUTES } from './attributes';

export const sanitizeDOM = (): Transformer => {
  return dom => {
    const sanitizedHtml = sanitizeHtml(dom.innerHTML, {
      allowedTags: TECHDOCS_ALLOWED_TAGS,
      allowedAttributes: TECHDOCS_ALLOWED_ATTRIBUTES,
      allowedSchemes: ['http', 'https', 'ftp', 'mailto', 'data', 'blob'],
      allowVulnerableTags: true,
    });

    return new DOMParser().parseFromString(sanitizedHtml, 'text/html')
      .documentElement;
  };
};
