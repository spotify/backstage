/*
 * Copyright 2025 The Backstage Authors
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
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { targetPaths } from '@backstage/cli-common';
import { resolvePackagePaths } from '../../lib/paths';
import { createTemporaryTsConfig } from './utils';
import { readFile, rm, writeFile } from 'node:fs/promises';
import pLimit from 'p-limit';
import { mkdirp } from 'fs-extra';
import { PackageDocsCache } from './Cache';
import { Lockfile } from '@backstage/cli-node';
import { glob } from 'glob';
import { existsSync } from 'node:fs';

const limit = pLimit(8);

const execAsync = promisify(exec);

const EXCLUDE = [
  'packages/app',
  'packages/app-legacy',
  'packages/app-example-plugin',
  'packages/cli',
  'packages/cli-common',
  'packages/cli-node',
  'packages/e2e-test',
  'packages/e2e-test-utils',
  'packages/opaque-internal',
  'packages/techdocs-cli',
  'packages/techdocs-cli-embedded-app',
  'packages/yarn-plugin',
  'packages/backend',
  'packages/backend-legacy',
];

const HIGHLIGHT_LANGUAGES = [
  'ts',
  'tsx',
  'yaml',
  'bash',
  'sh',
  'shell',
  'yml',
  'jsx',
  'diff',
  'js',
  'json',
  'docker',
];

function getExports(packageJson: any) {
  if (packageJson.exports) {
    return Object.values(packageJson.exports).filter(
      (e: any) => !(e as string).endsWith('package.json'),
    );
  }
  return [packageJson.main];
}

async function generateDocJson(pkg: string) {
  const temporaryTsConfigPath: string = await createTemporaryTsConfig(pkg);

  const packageJson = JSON.parse(
    await readFile(
      targetPaths.resolveWorkspaceRoot(pkg, 'package.json'),
      'utf-8',
    ),
  );

  const exports = getExports(packageJson);
  if (
    !exports.length ||
    !exports.some(e => e.startsWith('src') || e.startsWith('./src'))
  ) {
    return false;
  }

  await mkdirp(targetPaths.resolveWorkspaceRoot(`dist-types`, pkg));

  const { stdout, stderr } = await execAsync(
    [
      targetPaths.resolveWorkspaceRoot('node_modules/.bin/typedoc'),
      '--json',
      targetPaths.resolveWorkspaceRoot(`dist-types`, pkg, 'docs.json'),
      '--tsconfig',
      temporaryTsConfigPath,
      '--basePath',
      targetPaths.workspaceRootDir,
      '--skipErrorChecking',
      ...(getExports(packageJson).flatMap(e => [
        '--entryPoints',
        e,
      ]) as string[]),
    ].join(' '),
    {
      cwd: pkg,
      env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=12288' },
    },
  );
  console.log(`### Processed ${pkg}`);
  console.log(stdout);
  console.error(stderr);
  return true;
}

export default async function packageDocs(paths: string[] = [], opts: any) {
  console.warn('!!! This is an experimental command !!!');

  const existingDocsJsonPaths = glob.sync(
    targetPaths.resolveWorkspaceRoot('dist-types/**/docs.json'),
    { windowsPathsNoEscape: true },
  );
  if (existingDocsJsonPaths.length > 0) {
    console.warn(
      `!!! Deleting all ${existingDocsJsonPaths.length} existing docs.json files !!!`,
    );

    for (const path of existingDocsJsonPaths) {
      await rm(path, { force: true });
    }
  }
  console.warn('!!! Deleting existing docs output !!!');
  await rm(targetPaths.resolveWorkspaceRoot('type-docs'), {
    recursive: true,
    force: true,
  });
  const selectedPackageDirs = await resolvePackagePaths({
    paths,
    include: opts.include,
    exclude: opts.exclude,
  });

  const cache = await PackageDocsCache.loadAsync(
    targetPaths.workspaceRootDir,
    await Lockfile.load(targetPaths.resolveWorkspaceRoot('yarn.lock')),
  );

  console.log(`### Generating docs.`);
  await Promise.all(
    selectedPackageDirs.map(pkg =>
      limit(async () => {
        const pkgJson = JSON.parse(
          await readFile(
            targetPaths.resolveWorkspaceRoot(pkg, 'package.json'),
            'utf-8',
          ),
        );
        if (EXCLUDE.includes(pkg) || pkgJson.name.startsWith('@internal/')) {
          return;
        }
        if (await cache.has(pkg)) {
          console.log(`### Skipping ${pkg} due to cache hit`);
          try {
            await cache.restore(pkg);
            return;
          } catch (e) {
            console.error('Failed to restore cache for', pkg);
            console.error(e);
          }
        }
        try {
          console.log(`### Processing ${pkg}`);
          const success = await generateDocJson(pkg);
          if (success) {
            await cache.write(
              pkg,
              targetPaths.resolveWorkspaceRoot(`dist-types`, pkg),
            );
          }
        } catch (e) {
          console.error('Failed to generate docs for', pkg);
          console.error(e);
        }
      }),
    ),
  );

  const generatedPackageDirs = [];
  for (const pkg of selectedPackageDirs) {
    try {
      const docsJsonPath = targetPaths.resolveWorkspaceRoot(
        `dist-types/${pkg}/docs.json`,
      );
      const docsJson = JSON.parse(await readFile(docsJsonPath, 'utf-8'));
      const index = docsJson.children?.find((child: any) =>
        child.sources.some((e: any) => e.fileName.endsWith('src/index.ts')),
      );

      if (index) {
        index.name = 'index';
      }
      await writeFile(docsJsonPath, JSON.stringify(docsJson, null, 2));
      generatedPackageDirs.push(pkg);
    } catch (e) {
      if (e.code === 'ENOENT') {
        console.log('No docs.json found for', pkg);
      } else {
        throw e;
      }
    }
  }

  const { stdout, stderr } = await execAsync(
    [
      targetPaths.resolveWorkspaceRoot('node_modules/.bin/typedoc'),
      '--entryPointStrategy',
      'merge',
      ...generatedPackageDirs.flatMap(pkg => [
        '--entryPoints',
        `dist-types/${pkg}/docs.json`,
      ]),
      ...HIGHLIGHT_LANGUAGES.flatMap(e => ['--highlightLanguages', e]),
      '--out',
      targetPaths.resolveWorkspaceRoot('type-docs'),
      ...(existsSync(targetPaths.resolveWorkspaceRoot('typedoc.json'))
        ? ['--options', targetPaths.resolveWorkspaceRoot('typedoc.json')]
        : []),
    ].join(' '),
    {
      cwd: targetPaths.workspaceRootDir,
    },
  );

  console.log(stdout);
  console.error(stderr);
}
