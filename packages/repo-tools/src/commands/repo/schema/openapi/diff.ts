/*
 * Copyright 2024 The Backstage Authors
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
import { PackageGraph } from '@backstage/cli-node';
import { resolvePackagePath } from '@backstage/backend-plugin-api';
import { OptionValues } from 'commander';
import { exec } from '../../../../lib/exec';
import { targetPaths } from '@backstage/cli-common';
import {
  DEFAULT_BASE_REF,
  YAML_SCHEMA_PATH,
} from '../../../../lib/openapi/constants';
import { ensureOasdiffInstalled } from '../../../util';
import chalk from 'chalk';
import { relative as relativePath, join, sep, posix } from 'node:path';
import { pathExists } from 'fs-extra';

export async function command(opts: OptionValues) {
  await ensureOasdiffInstalled();

  let packages = await PackageGraph.listTargetPackages();

  let since = '';
  if (opts.since) {
    const { stdout: sinceRaw } = await exec('git', ['rev-parse', opts.since]);
    since = sinceRaw.toString().trim();
    const { stdout: changedFilesRaw } = await exec('git', [
      'diff',
      '--name-only',
      since,
    ]);
    const changedFiles = changedFilesRaw.toString().trim();

    const changedOpenApiSpecs = changedFiles
      .split('\n')
      .filter(e => e.endsWith(YAML_SCHEMA_PATH))
      .map(e => targetPaths.resolve(e));

    packages = packages.filter(pkg =>
      changedOpenApiSpecs.some(e => e.startsWith(`${pkg.dir}/`)),
    );
  }

  const packagesWithSpecs = [];
  for (const pkg of packages) {
    const specPath = join(pkg.dir, YAML_SCHEMA_PATH);
    if (await pathExists(specPath)) {
      packagesWithSpecs.push(pkg);
    }
  }

  if (packagesWithSpecs.length === 0) {
    console.log('No OpenAPI spec changes detected.');
    return;
  }

  const { stdout: currentSha } = await exec('git', ['rev-parse', 'HEAD']);
  const sha = currentSha.toString().trim();

  console.log(`### Summary for commit (${sha})\n`);

  const templatePath = resolvePackagePath(
    '@backstage/repo-tools',
    'templates/oasdiff-changelog.tmpl',
  );

  let hasFailures = false;

  for (const pkg of packagesWithSpecs) {
    const specPath = join(pkg.dir, YAML_SCHEMA_PATH);
    const relativeSpecPath = relativePath(
      targetPaths.workspaceRootDir,
      specPath,
    )
      .split(sep)
      .join(posix.sep);
    const pkgName = relativePath(targetPaths.workspaceRootDir, pkg.dir)
      .split(sep)
      .join(posix.sep);
    const baseRef = since || DEFAULT_BASE_REF;
    const baseSpec = `${baseRef}:${relativeSpecPath}`;

    try {
      const { stdout } = await exec(
        'oasdiff',
        [
          'changelog',
          baseSpec,
          relativeSpecPath,
          '--format',
          'markdown',
          '--template',
          templatePath,
        ],
        { cwd: targetPaths.workspaceRootDir },
      );
      const output = stdout.toString().trim();
      if (output) {
        console.log(`## ${pkgName}\n`);
        console.log(output);
        console.log();
      }
    } catch (err) {
      hasFailures = true;
      console.log(`## ${pkgName}\n`);
      console.error(
        chalk.red(
          `Failed to diff OpenAPI spec: ${
            err instanceof Error ? err.message : 'Unknown error'
          }\n`,
        ),
      );
    }
  }

  if (hasFailures) {
    process.exit(1);
  }
}
