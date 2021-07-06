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
import { BranchHit, FileEntry } from '../types';
import { JacocoSourceFile, JacocoXML } from './types';
import { Logger } from 'winston';
import { Converter } from './Converter';

type ParsedLine = {
  number: number;
  missed_instructions: number;
  covered_instructions: number;
  missed_branches: number;
  covered_branches: number;
};

export class Jacoco implements Converter {
  constructor(readonly logger: Logger) {
    this.logger = logger;
  }

  /**
   * Converts jacoco into shared json coverage format
   *
   * @param xml jacoco xml object
   * @param scmFiles list of files that are committed to SCM
   */
  convert(xml: JacocoXML, scmFiles: Array<string>): Array<FileEntry> {
    const jscov: Array<FileEntry> = [];

    xml.report.package.forEach(r => {
      const packageName = r.$.name;
      r.sourcefile.forEach(sf => {
        const fileName = sf.$.name;
        const lines = this.extractLines(sf);
        const lineHits: Record<number, number> = {};
        const branchHits: Record<number, BranchHit> = {};
        lines.forEach(l => {
          if (!lineHits[l.number]) {
            lineHits[l.number] = 0;
          }
          lineHits[l.number] += l.covered_instructions;
          const ab = l.covered_branches + l.missed_branches;
          if (ab > 0) {
            branchHits[l.number] = {
              covered: l.covered_branches,
              missed: l.missed_branches,
              available: ab,
            };
          }
        });

        const packageAndFilename = `${packageName}/${fileName}`;
        const currentFile = scmFiles
          .map(f => f.trimEnd())
          .find(f => f.endsWith(packageAndFilename));
        this.logger.debug(`matched ${packageAndFilename} to ${currentFile}`);
        if (Object.keys(lineHits).length > 0 && currentFile) {
          jscov.push({
            filename: currentFile,
            branchHits: branchHits,
            lineHits: lineHits,
          });
        }
      });
    });

    return jscov;
  }

  private extractLines(sourcefile: JacocoSourceFile): ParsedLine[] {
    const parsed: ParsedLine[] = [];

    sourcefile.line.forEach(l => {
      parsed.push({
        number: parseInt(l.$.nr, 10),
        missed_instructions: parseInt(l.$.mi, 10),
        covered_instructions: parseInt(l.$.ci, 10),
        missed_branches: parseInt(l.$.mb, 10),
        covered_branches: parseInt(l.$.cb, 10),
      });
    });

    return parsed;
  }
}
