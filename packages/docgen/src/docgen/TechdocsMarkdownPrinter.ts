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

import sortSelector from './sortSelector';
import { Highlighter, MarkdownPrinter, TypeLink } from './types';
import { execSync } from 'child_process';

// TODO(Rugvip): provide through options?
const GH_BASE_URL = 'https://github.com/backstage/backstage';

const COMMIT_SHA =
  process.env.COMMIT_SHA || execSync('git rev-parse HEAD').toString('utf8');

/**
 * The TechdocsMarkdownPrinter is a MarkdownPrinter for building TechDocs markdown documents.
 */
export default class TechdocsMarkdownPrinter implements MarkdownPrinter {
  private str: string = '';
  private readonly highlighter: Highlighter;

  constructor(highlighter: Highlighter) {
    this.highlighter = highlighter;

    // Remove line numbers from codeblocks
    this.style('.linenodiv{ display: none }');
  }

  private line(line: string = '') {
    this.str += `${line}\n`;
  }

  text(text: string) {
    this.line(text);
    this.line();
  }

  style(style: string) {
    this.line('<style>');
    this.line(style);
    this.line('</style>');
  }

  header(level: number, text: string, id?: string) {
    this.line(`${'#'.repeat(level)} ${text}${id ? ` {#${id}}` : ''}`);
    this.line();
  }

  headerLink(heading: string, id?: string): string {
    return `#${id ?? heading}`;
  }

  indexLink() {
    return '../';
  }

  pageLink(name: string) {
    return `./${name}/`;
  }

  srcLink(
    { file, lineInFile }: { file: string; lineInFile: number },
    text?: string,
  ): string {
    const linkText = text ?? `${file}:${lineInFile}`;
    const href = `${GH_BASE_URL}/blob/${COMMIT_SHA}/${file}#L${lineInFile}`;
    return `[${linkText}](${href})`;
  }

  paragraph(...text: string[]) {
    this.line(
      text
        .join('\n')
        .trim()
        .split('\n')
        .map(line => line.trim())
        .join('\n'),
    );
    this.line();
  }

  code({ text, links = [] }: { text: string; links?: TypeLink[] }) {
    this.line('<div class="code">');
    this.line(
      '<div class="codehilite" style="background: #f0f0f0; padding: 0.225rem 0.6rem">',
    );
    this.line('<pre style="line-height: 125%">');
    this.line(this.formatWithLinks({ text, links }));
    this.line('</pre>');
    this.line('</div>');
    this.line('</div>');
  }

  private escapeText: (text: string) => string = (() => {
    const escapes: { [char in string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
    };

    return (text: string) => text.replace(/[&<>]/g, char => escapes[char]);
  })();

  private formatWithLinks({
    text,
    links = [],
  }: {
    text: string;
    links?: TypeLink[];
  }): string {
    const sortedLinks = links.slice().sort(sortSelector(x => x.location[0]));

    sortedLinks.reduce((lastEnd, link) => {
      if (link.location[0] <= lastEnd) {
        throw new Error(
          `overlapping link detected for ${link.path}, ${link.location}`,
        );
      }
      return link.location[1];
    }, -1);

    const parts: Array<{ text: string; path?: string }> = [];

    const endLocation = sortedLinks.reduce((prev, link) => {
      const [start, end] = link.location;
      parts.push(
        { text: text.slice(prev, start) },
        { text: text.slice(start, end), path: link.path },
      );
      return end;
    }, 0);

    parts.push({ text: text.slice(endLocation) });

    return parts
      .map(part => {
        if (part.path) {
          const link = this.headerLink(part.text, part.path);
          return `<a href="${link}">${this.escapeText(part.text)}</a>`;
        }
        return this.highlighter.highlight(this.escapeText(part.text));
      })
      .join('');
  }

  toBuffer(): Buffer {
    return Buffer.from(this.str, 'utf8');
  }
}
