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

import GithubSlugger from 'github-slugger';
import sortSelector from './sortSelector';
import { MarkdownPrinter, TypeLink } from './types';
import { execSync } from 'child_process';

// TODO(Rugvip): provide through options?
const GH_BASE_URL = 'https://github.com/backstage/backstage';

const COMMIT_SHA =
  process.env.COMMIT_SHA ||
  execSync('git rev-parse HEAD').toString('utf8').trim();

/**
 * The GithubMarkdownPrinter is a MarkdownPrinter for printing GitHub Flavored Markdown documents.
 */
export default class GithubMarkdownPrinter implements MarkdownPrinter {
  private str: string = '';

  private line(line: string = '') {
    this.str += `${line}\n`;
  }

  text(text: string) {
    this.line(text);
    this.line();
  }

  header(level: number, text: string) {
    this.line(`${'#'.repeat(level)} ${text}`);
    this.line();
  }

  headerLink(heading: string): string {
    const slug = GithubSlugger.slug(heading);
    return `#${slug}`;
  }

  indexLink() {
    return './README.md';
  }

  pageLink(name: string) {
    return `./${name}.md`;
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
    this.line('<pre>');
    this.line(this.formatWithLinks({ text, links }));
    this.line('</pre>');
    this.line();
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

    const parts: Array<{ text: string; link?: boolean }> = [];

    const endLocation = sortedLinks.reduce((prev, link) => {
      const [start, end] = link.location;
      parts.push(
        { text: text.slice(prev, start) },
        { text: text.slice(start, end), link: true },
      );
      return end;
    }, 0);

    parts.push({ text: text.slice(endLocation) });

    return parts
      .map(part => {
        if (part.link) {
          const link = this.headerLink(part.text);
          return `<a href="${link}">${this.escapeText(part.text)}</a>`;
        }
        return this.escapeText(part.text);
      })
      .join('');
  }

  toBuffer(): Buffer {
    return Buffer.from(this.str, 'utf8');
  }
}
