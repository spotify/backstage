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

import { extname } from 'path';
import { parse } from 'leasot';
import { TodoParser } from './types';

export type TodoParserOptions = {
  /** Custom tags to support in addition to TODO and FIXME */
  additionalTags?: string[];
};

export function createTodoParser(options: TodoParserOptions = {}): TodoParser {
  return ({ content, path }) => {
    try {
      const comments = parse(content, {
        customTags: options.additionalTags,
        extension: extname(path),
      });

      return comments.map(comment => ({
        text: comment.text,
        tag: comment.tag,
        author: comment.ref || undefined,
        lineNumber: comment.line,
      }));
    } catch /* ignore unsupported extensions */ {
      return [];
    }
  };
}
