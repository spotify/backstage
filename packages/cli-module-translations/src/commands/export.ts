/*
 * Copyright 2026 The Backstage Authors
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

import { cli } from 'cleye';
import { targetPaths } from '@backstage/cli-common';
import fs from 'fs-extra';
import { dirname, resolve as resolvePath } from 'node:path';
import {
  discoverFrontendPackages,
  readTargetPackage,
} from '../lib/discoverPackages';
import {
  createTranslationProject,
  extractTranslationRefsFromSourceFile,
  TranslationRefInfo,
} from '../lib/extractTranslations';
import {
  DEFAULT_LANGUAGE,
  DEFAULT_MESSAGE_PATTERN,
  formatMessagePath,
  validatePattern,
} from '../lib/messageFilePath';
import type { CliCommandContext } from '@backstage/cli-node';

export default async ({ args, info }: CliCommandContext) => {
  const {
    flags: { output, pattern },
  } = cli(
    {
      name: info.usage,
      booleanFlagNegation: true,
      flags: {
        output: {
          type: String,
          default: 'translations',
          description: 'Output directory for exported messages and manifest',
        },
        pattern: {
          type: String,
          default: DEFAULT_MESSAGE_PATTERN,
          description:
            'File path pattern for message files, with {id} and {lang} placeholders',
        },
      },
    },
    undefined,
    args,
  );

  const options = { output, pattern };

  validatePattern(options.pattern);

  const targetPackageJson = await readTargetPackage(
    targetPaths.dir,
    targetPaths.installationRootDir,
  );

  const outputDir = resolvePath(targetPaths.dir, options.output);
  const manifestPath = resolvePath(outputDir, 'manifest.json');

  const tsconfigPath = targetPaths.resolveInstallationRoot('tsconfig.json');
  if (!(await fs.pathExists(tsconfigPath))) {
    throw new Error(
      `No tsconfig.json found at ${tsconfigPath}. ` +
        'The translations export command requires a tsconfig.json in the repo root.',
    );
  }

  console.log(
    `Discovering frontend dependencies of ${targetPackageJson.name}...`,
  );
  const packages = await discoverFrontendPackages(
    targetPackageJson,
    targetPaths.dir,
  );
  console.log(`Found ${packages.length} frontend packages to scan`);

  console.log('Creating TypeScript project...');
  const project = createTranslationProject(tsconfigPath);

  const allRefs: TranslationRefInfo[] = [];

  for (const pkg of packages) {
    for (const [exportPath, filePath] of pkg.entryPoints) {
      try {
        const sourceFile = project.addSourceFileAtPath(filePath);
        const refs = extractTranslationRefsFromSourceFile(
          sourceFile,
          pkg.name,
          exportPath,
        );
        allRefs.push(...refs);
      } catch (error) {
        console.warn(
          `  Warning: failed to process ${pkg.name} (${exportPath}): ${error}`,
        );
      }
    }
  }

  if (allRefs.length === 0) {
    console.log('No translation refs found.');
    return;
  }

  console.log(`Found ${allRefs.length} translation ref(s):`);
  for (const ref of allRefs) {
    const messageCount = Object.keys(ref.messages).length;
    console.log(`  ${ref.id} (${ref.packageName}, ${messageCount} messages)`);
  }

  // Write message files using the configured pattern
  for (const ref of allRefs) {
    const relPath = formatMessagePath(
      options.pattern,
      ref.id,
      DEFAULT_LANGUAGE,
    );
    const filePath = resolvePath(outputDir, relPath);
    await fs.ensureDir(dirname(filePath));
    await fs.writeJson(filePath, ref.messages, { spaces: 2 });
  }

  // Write manifest
  const manifest: Record<string, object> = {};
  for (const ref of allRefs) {
    manifest[ref.id] = {
      package: ref.packageName,
      exportPath: ref.exportPath,
      exportName: ref.exportName,
    };
  }
  await fs.writeJson(
    manifestPath,
    { pattern: options.pattern, refs: manifest },
    { spaces: 2 },
  );

  const examplePath = formatMessagePath(
    options.pattern,
    '<ref-id>',
    DEFAULT_LANGUAGE,
  );
  console.log(
    `\nExported ${allRefs.length} translation ref(s) to ${options.output}/`,
  );
  console.log(`  Messages: ${options.output}/${examplePath}`);
  console.log(`  Manifest: ${options.output}/manifest.json`);
};
