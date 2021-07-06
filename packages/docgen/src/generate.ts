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

import * as ts from 'typescript';
import fs from 'fs-extra';
import { resolve as resolvePath, join as joinPath } from 'path';
import ApiDocGenerator from './docgen/ApiDocGenerator';
import sortSelector from './docgen/sortSelector';
import TypeLocator from './docgen/TypeLocator';
import ApiDocPrinter from './docgen/ApiDocsPrinter';
import TypescriptHighlighter from './docgen/TypescriptHighlighter';
import GitHubMarkdownPrinter from './docgen/GitHubMarkdownPrinter';
import TechdocsMarkdownPrinter from './docgen/TechdocsMarkdownPrinter';

const FORMATS = ['github', 'techdocs'] as const;

export async function generate(
  targetPath: string,
  format: typeof FORMATS[number],
) {
  if (!FORMATS.includes(format)) {
    throw new TypeError(
      `Invalid format, '${format}', must be one of ${FORMATS.join(', ')}`,
    );
  }

  /* eslint-disable-next-line no-restricted-syntax */
  const rootDir = resolvePath(__dirname, '../../..');
  const srcDir = resolvePath(rootDir, 'packages', 'core-api', 'src');
  const targetDir = resolvePath(targetPath);

  const options = await fs.readJson(resolvePath('../cli/config/tsconfig.json'));

  delete options.moduleResolution;
  options.noEmit = true;

  const program = ts.createProgram([resolvePath(srcDir, 'index.ts')], options);

  const typeLocator = TypeLocator.fromProgram(program, srcDir);

  const { apis } = typeLocator.findExportedInstances({
    apis: typeLocator.getExportedType(
      resolvePath(srcDir, 'index.ts'),
      'createApiRef',
    ),
  });

  const apiDocGenerator = ApiDocGenerator.fromProgram(program, rootDir);
  const apiDocs = apis
    .map(api => {
      try {
        return apiDocGenerator.toDoc(api);
      } catch (error) {
        throw new Error(
          `Doc generation failed for API in ${api.source.fileName}, ${error.stack}`,
        );
      }
    })
    .sort(sortSelector(x => x.name));

  const apiTypes = Object.values(
    Object.fromEntries(
      apiDocs.flatMap(d => d.interfaceInfos).map(i => [i.name, i]),
    ),
  ).sort(sortSelector(i => i.name));

  if (format === 'techdocs') {
    const docsDir = resolvePath(targetDir, 'docs');
    await fs.ensureDir(docsDir);

    const apiDocPrinter = new ApiDocPrinter(
      () => new TechdocsMarkdownPrinter(new TypescriptHighlighter()),
    );

    await fs.writeFile(
      joinPath(docsDir, 'README.md'),
      apiDocPrinter.printApiIndex(apiDocs),
    );

    for (const apiType of Object.values(apiTypes)) {
      const data = apiDocPrinter.printInterface(apiType, apiDocs);

      await fs.writeFile(joinPath(docsDir, `${apiType.name}.md`), data);
    }

    await fs.writeFile(
      resolvePath(targetDir, 'mkdocs.yml'),
      [
        'site_name: Backstage Core Utility API References',
        'nav:',
        `  - API Index: 'README.md'`,
        ...apiTypes.map(({ name }) => `  - ${name}: '${name}.md'`),
        'plugins:',
        '  - techdocs-core',
      ].join('\n'),
      'utf8',
    );
  } else {
    await fs.ensureDir(targetDir);

    const apiDocPrinter = new ApiDocPrinter(() => new GitHubMarkdownPrinter());

    await fs.writeFile(
      joinPath(targetDir, 'README.md'),
      apiDocPrinter.printApiIndex(apiDocs),
    );

    for (const apiType of Object.values(apiTypes)) {
      const data = apiDocPrinter.printInterface(apiType, apiDocs);

      await fs.writeFile(joinPath(targetDir, `${apiType.name}.md`), data);
    }
  }
}
