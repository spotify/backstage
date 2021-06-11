/*
 * Copyright 2021 Spotify AB
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
import { BranchHit, FileEntry } from '../types';
import { CoberturaXML, InnerClass, LineHit } from './types';
import { Logger } from 'winston';
import { Converter } from './Converter';

export class Cobertura implements Converter {
  constructor(readonly logger: Logger) {
    this.logger = logger;
  }

  /**
   * convert cobertura into shared json coverage format
   *
   * @param xml cobertura xml object
   * @param scmFiles list of files that are commited to SCM
   */
  convert(xml: CoberturaXML, scmFiles: string[]): FileEntry[] {
    const ppc = xml.coverage.packages
      ?.flatMap(p => p.package)
      .filter(Boolean)
      .flatMap(p => p.classes);
    const pc = xml.coverage.package?.filter(Boolean).flatMap(p => p.classes);

    const classes = [ppc, pc]
      .flat()
      .filter(Boolean)
      .flatMap(c => c.class)
      .filter(Boolean);
    const jscov: Array<FileEntry> = [];

    classes.forEach(c => {
      const packageAndFilename = c.$.filename;
      const lines = this.extractLines(c);
      const lineHits: Record<number, number> = {};
      const branchHits: Record<number, BranchHit> = {};

      lines.forEach(l => {
        if (!lineHits[l.number]) {
          lineHits[l.number] = 0;
        }
        lineHits[l.number] += l.hits;
        if (l.branch && l['condition-coverage']) {
          const bh = this.parseBranch(l['condition-coverage']);
          if (bh) {
            branchHits[l.number] = bh;
          }
        }
      });

      const currentFile = scmFiles
        .map(f => f.trimEnd())
        .find(f => f.endsWith(packageAndFilename));
      this.logger.debug(`matched ${packageAndFilename} to ${currentFile}`);
      if (
        scmFiles.length === 0 ||
        (Object.keys(lineHits).length > 0 && currentFile)
      ) {
        jscov.push({
          filename: currentFile || packageAndFilename,
          branchHits: branchHits,
          lineHits: lineHits,
        });
      }
    });

    return jscov;
  }

  /**
   * Parses branch coverage information from condition-coverage
   *
   * @param condition condition-coverage value from line coverage
   */
  private parseBranch(condition: string): BranchHit | null {
    const pattern = /[0-9\.]+\%\s\(([0-9]+)\/([0-9]+)\)/;
    const match = condition.match(pattern);
    if (!match) {
      return null;
    }
    const covered = parseInt(match[1], 10);
    const available = parseInt(match[2], 10);
    return {
      covered: covered,
      missed: available - covered,
      available: available,
    };
  }

  /**
   * Extract line hits from a class coverage entry
   *
   * @param clz class coverage information
   */
  private extractLines(clz: InnerClass): Array<LineHit> {
    const classLines = clz.lines.flatMap(l => l.line);
    const methodLines = clz.methods
      ?.flatMap(m => m.method)
      .filter(Boolean)
      .flatMap(m => m.lines)
      .filter(Boolean)
      .flatMap(l => l.line);
    const lines = [classLines, methodLines].flat().filter(Boolean);
    const lineHits = lines.map(l => {
      return {
        number: parseInt((l.$.number as unknown) as string, 10),
        hits: parseInt((l.$.hits as unknown) as string, 10),
        'condition-coverage': l.$['condition-coverage'],
        branch: l.$.branch,
      };
    });
    return lineHits;
  }
}
