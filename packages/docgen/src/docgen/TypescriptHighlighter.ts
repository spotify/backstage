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

import { Highlighter } from './types';

// Simple syntax highlighter that mimics hilite
export default class TypescriptHighlighter implements Highlighter {
  private static readonly basicTypes = [
    'boolean',
    'number',
    'string',
    'Array',
    'object',
    'Record',
    'Set',
    'Map',
    'true',
    'false',
    'null',
    'undefined',
    'void',
    'Promise',
    'any',
    '[0-9\\.]+',
  ];

  // List of highlightings to apply, each with a match regex and the style that should be applied
  private static readonly highlighters = [
    [/(\/\*\*?(?:.|\n)+?\*\/)/g, 'color: #60a0b0; font-style: italic'], // block comment
    [/(\/\/.*)/gm, 'color: #60a0b0; font-style: italic'], // line comment
    [/('[^']*?'|"[^"]*?")/g, 'color: #4070a0'], // string literals
    [
      new RegExp(
        `\\b(${TypescriptHighlighter.basicTypes.join('|')})\\b(?!:|,)`,
        'g',
      ),
      'color: #902000',
    ], // basic types
    [
      /^((?:export\s)?(?:type\s)?(?:interface\s)?)/g,
      'color: #007020; font-weight: bold',
    ], // keywords
  ] as readonly [RegExp, string][];

  highlight(fullText: string): string {
    // Each part is either plain text that can be highlighted or text that is already highlighted
    type HighlightPart = { text: string; highlighted?: boolean };

    const painter = (regex: RegExp, style: string) => (part: HighlightPart) => {
      if (part.highlighted) {
        return [part];
      }
      // Apply highlighting to all matches of the regex by splitting into parts
      return part.text.split(regex).map((text, index) => {
        // Odd parts are the ones that matched the regex and should be highlighted.
        if (index % 2 === 1) {
          return {
            text: `<span style="${style}">${text}</span>`,
            highlighted: true,
          };
        }
        return { text };
      });
    };

    // Order here is important, e.g. comments must be first to avoid string literals inside comments being highlighted
    return TypescriptHighlighter.highlighters
      .reduce((parts, highlighter) => parts.flatMap(painter(...highlighter)), [
        { text: fullText },
      ])
      .map(({ text }) => text)
      .join('');
  }
}
