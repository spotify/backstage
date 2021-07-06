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

import ts from 'typescript';

export function createMemProgram(
  indexSource: string,
  otherSourceFiles: { [fileName in string]: string } = {},
): ts.Program {
  const rootDir = '/mem';

  const options = { noEmit: true };
  const baseHost = ts.createCompilerHost(options);
  const files: { [fileName in string]: string } = {
    [`${rootDir}/index.ts`]: indexSource,
    ...otherSourceFiles,
  };

  // Custom compiler hosts that reads from a map of in-memory files, but
  // falls back to reading from disc for ts libs etc.
  const compilerHost: ts.CompilerHost = {
    ...baseHost,
    readFile(fileName): string | undefined {
      if (fileName in files) {
        return files[fileName];
      }
      return baseHost.readFile(fileName);
    },
    getCurrentDirectory(): string {
      return rootDir;
    },
    directoryExists(dir) {
      if (dir === rootDir) {
        return true;
      }
      if (baseHost.directoryExists) {
        return baseHost.directoryExists(dir);
      }
      return false;
    },
    fileExists(fileName: string): boolean {
      return !!files[fileName] || baseHost.fileExists(fileName);
    },
    getSourceFile(fileName, ...rest): ts.SourceFile | undefined {
      const file = files[fileName];
      if (file) {
        return ts.createSourceFile(fileName, file, ts.ScriptTarget.ES2017);
      }
      return baseHost.getSourceFile(fileName, ...rest);
    },
  };

  return ts.createProgram(['/mem/index.ts'], options, compilerHost);
}
