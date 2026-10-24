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
import {
  resolve as resolvePath,
  relative as relativePath,
  sep,
} from 'node:path';
import { readTargetPackage } from '../lib/discoverPackages';
import {
  DEFAULT_LANGUAGE,
  createMessagePathParser,
  formatMessagePath,
} from '../lib/messageFilePath';
import type { CliCommandContext } from '@backstage/cli-node';

interface ManifestRefEntry {
  package: string;
  exportPath: string;
  exportName: string;
}

interface Manifest {
  pattern?: string;
  refs: Record<string, ManifestRefEntry>;
}

export default async ({ args, info }: CliCommandContext) => {
  const {
    flags: { input, output },
  } = cli(
    {
      name: info.usage,
      booleanFlagNegation: true,
      flags: {
        input: {
          type: String,
          default: 'translations',
          description:
            'Input directory containing the manifest and translated message files',
        },
        output: {
          type: String,
          default: 'src/translations/resources.ts',
          description: 'Output path for the generated wiring module',
        },
      },
    },
    undefined,
    args,
  );

  const options = { input, output };
  await readTargetPackage(targetPaths.dir, targetPaths.installationRootDir);

  const inputDir = resolvePath(targetPaths.dir, options.input);
  const manifestPath = resolvePath(inputDir, 'manifest.json');
  const outputPath = resolvePath(targetPaths.dir, options.output);

  if (!(await fs.pathExists(manifestPath))) {
    throw new Error(
      `No manifest.json found at ${manifestPath}. ` +
        'Run "backstage-cli translations export" first.',
    );
  }

  const manifest: Manifest = await fs.readJson(manifestPath);

  if (!manifest.pattern) {
    throw new Error(
      'No pattern found in manifest.json. Re-run "backstage-cli translations export" to regenerate it.',
    );
  }
  const pattern = manifest.pattern;

  const parsePath = createMessagePathParser(pattern);

  // Discover all JSON files under the translations directory
  const allFiles = (await collectJsonFiles(inputDir)).filter(
    f => f !== 'manifest.json',
  );

  // Parse each file to extract id + lang, filtering out default language files
  const translationsByRef = new Map<
    string,
    Array<{ lang: string; relPath: string }>
  >();
  let skipped = 0;

  for (const relPath of allFiles) {
    const parsed = parsePath(relPath);
    if (!parsed) {
      skipped++;
      continue;
    }

    if (parsed.lang === DEFAULT_LANGUAGE) {
      continue;
    }

    if (!manifest.refs[parsed.id]) {
      console.warn(
        `  Warning: skipping ${relPath} - ref '${parsed.id}' not found in manifest`,
      );
      continue;
    }

    const existing = translationsByRef.get(parsed.id) ?? [];
    existing.push({ lang: parsed.lang, relPath });
    translationsByRef.set(parsed.id, existing);
  }

  if (skipped > 0) {
    console.warn(
      `  Warning: ${skipped} file(s) did not match the pattern '${pattern}'`,
    );
  }

  if (translationsByRef.size === 0) {
    console.log('No translated message files found.');
    const example = formatMessagePath(pattern, '<ref-id>', 'sv');
    console.log(
      `Add translated files as ${example} in the translations directory.`,
    );
    return;
  }

  // Generate the wiring module
  const importLines: string[] = [];
  const resourceLines: string[] = [];

  importLines.push(
    "import { createTranslationResource } from '@backstage/frontend-plugin-api';",
  );

  for (const [refId, entries] of [...translationsByRef.entries()].sort(
    ([a], [b]) => a.localeCompare(b),
  )) {
    const refEntry = manifest.refs[refId];
    const importPath =
      refEntry.exportPath === '.'
        ? refEntry.package
        : `${refEntry.package}/${refEntry.exportPath.replace(/^\.\//, '')}`;

    importLines.push(`import { ${refEntry.exportName} } from '${importPath}';`);

    const translationEntries = entries
      .sort((a, b) => a.lang.localeCompare(b.lang))
      .map(({ lang, relPath }) => {
        const jsonRelPath = relativePath(
          resolvePath(outputPath, '..'),
          resolvePath(inputDir, relPath),
        )
          .split(sep)
          .join('/');
        return `    ${JSON.stringify(lang)}: () => import('./${jsonRelPath}'),`;
      })
      .join('\n');

    resourceLines.push(
      [
        `  createTranslationResource({`,
        `    ref: ${refEntry.exportName},`,
        `    translations: {`,
        translationEntries,
        `    },`,
        `  }),`,
      ].join('\n'),
    );
  }

  const fileContent = [
    '// This file is auto-generated by backstage-cli translations import',
    '// Do not edit manually.',
    '',
    ...importLines,
    '',
    'export default [',
    ...resourceLines,
    '];',
    '',
  ].join('\n');

  await fs.ensureDir(resolvePath(outputPath, '..'));
  await fs.writeFile(outputPath, fileContent, 'utf8');

  const totalFiles = [...translationsByRef.values()].reduce(
    (sum, e) => sum + e.length,
    0,
  );
  console.log(`Generated translation resources at ${options.output}`);
  console.log(
    `  ${translationsByRef.size} ref(s), ${totalFiles} translation file(s)`,
  );
  console.log(
    '\nImport this file in your app and pass the resources to your translation API setup.',
  );
};

/**
 * Recursively collects all .json files under a directory, returning paths
 * relative to that directory using forward slashes.
 */
async function collectJsonFiles(dir: string, prefix = ''): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const results: string[] = [];

  for (const entry of entries) {
    const relPath = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      results.push(
        ...(await collectJsonFiles(resolvePath(dir, entry.name), relPath)),
      );
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      results.push(relPath);
    }
  }

  return results;
}
