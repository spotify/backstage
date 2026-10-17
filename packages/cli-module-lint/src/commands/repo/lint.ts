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

import chalk from 'chalk';
import fs from 'fs-extra';
import { cli } from 'cleye';
import { createHash } from 'node:crypto';
import { relative as relativePath } from 'node:path';
import {
  PackageGraph,
  BackstagePackageJson,
  runWorkerQueueThreads,
  SuccessCache,
} from '@backstage/cli-node';
import { detectPackageManager, Lockfile } from '@backstage/cli-node/alpha';
import { targetPaths } from '@backstage/cli-common';

import { createScriptOptionsParser } from '../../lib/optionsParser';
import type { CliCommandContext } from '@backstage/cli-node';

function depCount(pkg: BackstagePackageJson) {
  const deps = pkg.dependencies ? Object.keys(pkg.dependencies).length : 0;
  const devDeps = pkg.devDependencies
    ? Object.keys(pkg.devDependencies).length
    : 0;
  return deps + devDeps;
}

export default async ({ args, info }: CliCommandContext) => {
  for (const flag of [
    'outputFile',
    'successCache',
    'successCacheDir',
    'maxWarnings',
  ]) {
    if (args.some(a => a === `--${flag}` || a.startsWith(`--${flag}=`))) {
      process.stderr.write(
        `DEPRECATION WARNING: --${flag} is deprecated, use the kebab-case form instead\n`,
      );
    }
  }

  const {
    flags: {
      fix,
      format,
      outputFile,
      successCache: useSuccessCache,
      successCacheDir,
      since,
      maxWarnings,
    },
  } = cli(
    {
      name: info.usage,
      booleanFlagNegation: true,
      flags: {
        fix: {
          type: Boolean,
          description: 'Attempt to automatically fix violations',
        },
        format: {
          type: String,
          description: 'Lint report output format',
          default: 'eslint-formatter-friendly',
        },
        outputFile: {
          type: String,
          description: 'Write the lint report to a file instead of stdout',
        },
        successCache: {
          type: Boolean,
          description:
            'Enable success caching, which skips running tests for unchanged packages that were successful in the previous run',
        },
        successCacheDir: {
          type: String,
          description:
            'Set the success cache location, (default: node_modules/.cache/backstage-cli)',
        },
        since: {
          type: String,
          description:
            'Only lint packages that changed since the specified ref',
        },
        maxWarnings: {
          type: String,
          description:
            'Fail if more than this number of warnings. -1 allows warnings. (default: -1)',
        },
      },
    },
    undefined,
    args,
  );

  let packages = await PackageGraph.listTargetPackages();

  const cache = SuccessCache.create({
    name: 'lint',
    basePath: successCacheDir,
  });
  let cacheContext: { entries: Set<string>; lockfile: Lockfile } | undefined;
  if (useSuccessCache) {
    // The cache keys depend on the lockfile, so without one there is no cache
    const packageManager = await detectPackageManager();
    try {
      const lockfile = await packageManager.loadLockfile();
      cacheContext = { entries: await cache.read(), lockfile };
    } catch (error) {
      console.warn(
        `Failed to read ${packageManager.lockfileName()}, linting without the success cache, ${error}`,
      );
    }
  }

  if (since) {
    const graph = PackageGraph.fromPackages(packages);
    packages = await graph.listChangedPackages({
      ref: since,
      analyzeLockfile: true,
    });
  }

  // Packages are ordered from most to least number of dependencies, as a
  // very cheap way of guessing which packages are more likely to be larger.
  packages.sort((a, b) => depCount(b.packageJson) - depCount(a.packageJson));

  // This formatter uses the cwd to format file paths, so let's have that happen from the root instead
  if (format === 'eslint-formatter-friendly') {
    process.chdir(targetPaths.installationRootDir);
  }

  // Make sure lint output is colored unless the user explicitly disabled it
  if (!process.env.FORCE_COLOR) {
    process.env.FORCE_COLOR = '1';
  }

  const parseLintScript = createScriptOptionsParser(['package', 'lint'], {
    fix: { type: 'boolean' },
    format: { type: 'string' },
    'output-file': { type: 'string' },
    'max-warnings': { type: 'string' },
  });

  const items = await Promise.all(
    packages.map(async pkg => {
      const lintOptions = parseLintScript(pkg.packageJson.scripts?.lint);
      const base = {
        fullDir: pkg.dir,
        relativeDir: relativePath(targetPaths.installationRootDir, pkg.dir),
        lintOptions,
        parentHash: undefined,
      };

      if (!cacheContext) {
        return base;
      }

      const hash = createHash('sha1');

      hash.update(
        cacheContext.lockfile.getDependencyTreeHash(pkg.packageJson.name),
      );
      hash.update('\0');
      hash.update(JSON.stringify(lintOptions ?? {}));
      hash.update('\0');
      hash.update(process.version); // Node.js version
      hash.update('\0');
      hash.update('v1'); // The version of this implementation

      return {
        ...base,
        parentHash: hash.digest('hex'),
      };
    }),
  );

  const { results: resultsList } = await runWorkerQueueThreads({
    items: items.filter(item => item.lintOptions), // Filter out packages without lint script
    context: {
      fix: Boolean(fix),
      format: format as string | undefined,
      shouldCache: Boolean(cacheContext),
      maxWarnings: maxWarnings ?? '-1',
      successCache: cacheContext?.entries,
      rootDir: targetPaths.installationRootDir,
    },
    workerFactory: async ({
      fix: workerFix,
      format: workerFormat,
      shouldCache,
      successCache,
      rootDir,
      maxWarnings: workerMaxWarnings,
    }) => {
      const { ESLint } = require('eslint') as typeof import('eslint');
      const crypto = require('node:crypto') as typeof import('crypto');
      const globby = require('globby') as typeof import('globby');
      const { readFile } =
        require('node:fs/promises') as typeof import('fs/promises');
      const workerPath = require('node:path') as typeof import('path');

      return async ({
        fullDir,
        relativeDir,
        parentHash,
      }): Promise<{
        relativeDir: string;
        sha?: string;
        resultText?: string;
        failed: boolean;
      }> => {
        // Bit of a hack to make file resolutions happen from the correct directory
        // since some lint rules don't respect the cwd of ESLint
        process.cwd = () => fullDir;

        const start = Date.now();
        const eslint = new ESLint({
          cwd: fullDir,
          fix: workerFix,
          extensions: ['js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs'],
        });

        let sha: string | undefined = undefined;
        if (shouldCache) {
          const result = await globby(relativeDir, {
            gitignore: true,
            onlyFiles: true,
            cwd: rootDir,
          });

          const hash = crypto.createHash('sha1');
          hash.update(parentHash!);
          hash.update('\0');

          for (const path of result.sort()) {
            const absPath = workerPath.resolve(rootDir, path);
            const pathInPackage = workerPath.relative(fullDir, absPath);

            if (await eslint.isPathIgnored(pathInPackage)) {
              continue;
            }
            hash.update(pathInPackage);
            hash.update('\0');
            hash.update(await readFile(absPath));
            hash.update('\0');
            hash.update(
              JSON.stringify(
                await eslint.calculateConfigForFile(pathInPackage),
              ).replaceAll(rootDir, ''),
            );
            hash.update('\0');
          }
          sha = await hash.digest('hex');
          if (successCache?.has(sha)) {
            console.log(`Skipped ${relativeDir} due to cache hit`);
            return { relativeDir, sha, failed: false };
          }
        }

        const formatter = await eslint.loadFormatter(workerFormat);

        const results = await eslint.lintFiles(['.']);

        const count = String(results.length).padStart(3);
        const time = ((Date.now() - start) / 1000).toFixed(2);
        console.log(`Checked ${count} files in ${relativeDir} ${time}s`);

        if (workerFix) {
          await ESLint.outputFixes(results);
        }

        const ignoreWarnings = +workerMaxWarnings === -1;

        const resultText = formatter.format(results) as string;
        const failed =
          results.some(r => r.errorCount > 0) ||
          (!ignoreWarnings &&
            results.reduce((current, next) => current + next.warningCount, 0) >
              +workerMaxWarnings);

        return {
          relativeDir,
          resultText,
          failed,
          sha,
        };
      };
    },
  });

  const outputSuccessCache = [];
  const jsonResults = [];

  let errorOutput = '';

  let failed = false;
  for (const {
    relativeDir,
    resultText,
    failed: runFailed,
    sha,
  } of resultsList) {
    if (runFailed) {
      console.log(chalk.red(`Lint failed in ${relativeDir}`));
      failed = true;

      // When doing repo lint, only list the results if the lint failed to avoid a log
      // dump of all warnings that might be irrelevant
      if (resultText) {
        if (outputFile) {
          if (format === 'json') {
            jsonResults.push(resultText);
          } else {
            errorOutput += `${resultText}\n`;
          }
        } else {
          console.log();
          console.log(resultText.trimStart());
        }
      }
    } else if (sha) {
      outputSuccessCache.push(sha);
    }
  }

  if (format === 'json') {
    let mergedJsonResults: any[] = [];
    for (const jsonResult of jsonResults) {
      mergedJsonResults = mergedJsonResults.concat(JSON.parse(jsonResult));
    }
    errorOutput = JSON.stringify(mergedJsonResults, null, 2);
  }

  if (outputFile && errorOutput) {
    await fs.writeFile(
      targetPaths.resolveInstallationRoot(outputFile),
      errorOutput,
    );
  }

  if (cacheContext) {
    await cache.write(outputSuccessCache);
  }

  if (failed) {
    process.exit(1);
  }
};
