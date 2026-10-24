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
import { targetPaths } from '@backstage/cli-common';
import pLimit from 'p-limit';
import os from 'node:os';
import { relative as relativePath, resolve as resolvePath } from 'node:path';
import fs from 'fs-extra';
import type { KnipConfig } from 'knip';
import { createBinRunner } from '../util';
import { logReportDiff } from '../api-reports/common';

interface KnipExtractionOptions {
  packageDirs: string[];
  isLocalBuild: boolean;
}

interface KnipConfigOptions {
  knipConfigPath: string;
}

interface KnipPackageOptions {
  packageDir: string;
  knipDir: string;
  isLocalBuild: boolean;
}

function logKnipReportInstructions() {
  console.log('');
  console.log(
    '*************************************************************************************',
  );
  console.log(
    '* You have uncommitted changes to the knip reports of a package.                    *',
  );
  console.log(
    '* To solve this, run `yarn build:knip-reports` and commit all md file changes.      *',
  );
  console.log(
    '*************************************************************************************',
  );
  console.log('');
}

async function generateKnipConfig({ knipConfigPath }: KnipConfigOptions) {
  const knipConfig: KnipConfig = {
    workspaces: {
      '.': {},
      '{packages,plugins}/*': {
        entry: ['dev/**/*.{ts,tsx}', 'src/index.{ts,tsx}'],
        ignore: [
          '.eslintrc.js',
          'config.d.ts',
          'knexfile.js',
          'node_modules/**',
          'dist/**',
          '{fixtures,migrations,templates}/**',
          'src/tests/transforms/__fixtures__/**', // cli packaging tests
        ],
      },
    },
    jest: {
      entry: ['src/setupTests.ts', 'src/**/*.test.{ts,tsx}'],
    },
    storybook: { entry: 'src/components/**/*.stories.tsx' },
    ignoreDependencies: [
      // these is reported as a referenced optional peerDependencies
      // TBD: investigate what triggers these
      '@types/react',
      '@types/jest',
      '@internal/.*', // internal packages are not published and inlined
      '@backstage/cli', // everything depends on this for its package.json commands
      '@backstage/theme', // this uses `declare module` in .d.ts so is implicitly used whenever extensions are needed
    ],
  };
  await fs.writeFile(knipConfigPath, JSON.stringify(knipConfig, null, 2));
}

function cleanKnipConfig({ knipConfigPath }: KnipConfigOptions) {
  if (fs.existsSync(knipConfigPath)) {
    fs.rmSync(knipConfigPath);
  }
}

async function handlePackage({
  packageDir,
  knipDir,
  isLocalBuild,
}: KnipPackageOptions) {
  console.log(`## Processing ${packageDir}`);

  const fullDir = targetPaths.resolveWorkspaceRoot(packageDir);
  const reportPath = resolvePath(fullDir, 'knip-report.md');
  const run = createBinRunner(targetPaths.workspaceRootDir, '');

  let report = await run(
    `${knipDir}/knip.js`,
    '-W', // Run the desired workspace
    packageDir,
    '--config',
    'knip.json',
    '--no-exit-code', // Removing this will end the process in case there are findings by knip
    '--no-progress', // Remove unnecessary debugging from output
    // TODO: Add more checks when dependencies start to look ok, see https://knip.dev/reference/cli#--include
    '--include',
    'dependencies,unlisted',
    '--reporter',
    'markdown',
  );

  // Adjust report paths to be relative to workspace
  report = report.replaceAll(`| ${packageDir}/`, '| ');
  // Adjust table separators
  report = report.replaceAll(
    new RegExp(`(\\| :-+ \\| :)-{${packageDir.length + 1}}`, 'g'),
    (_, p1) => p1,
  );
  report = report.replaceAll(
    new RegExp(` \\| Location {1,${packageDir.length + 2}}`, 'g'),
    ' | Location ',
  );

  const existingReport = await fs.readFile(reportPath, 'utf8').catch(error => {
    if (error.code === 'ENOENT') {
      return undefined;
    }
    throw error;
  });

  if (existingReport !== report) {
    if (isLocalBuild) {
      console.warn(`Knip report changed for ${packageDir}`);
      await fs.writeFile(reportPath, report);
    } else {
      logKnipReportInstructions();

      logReportDiff(
        relativePath(targetPaths.workspaceRootDir, reportPath),
        existingReport,
        report,
      );

      logKnipReportInstructions();
      throw new Error(`Knip report changed for ${packageDir}, `);
    }
  }
}

export async function runKnipReports({
  packageDirs,
  isLocalBuild,
}: KnipExtractionOptions) {
  const knipDir = targetPaths.resolveWorkspaceRoot('./node_modules/knip/bin/');
  const knipConfigPath = targetPaths.resolveWorkspaceRoot('./knip.json');
  const limiter = pLimit(os.cpus().length);

  await generateKnipConfig({ knipConfigPath });
  try {
    await Promise.all(
      packageDirs.map(packageDir =>
        limiter(async () =>
          handlePackage({ packageDir, knipDir, isLocalBuild }),
        ),
      ),
    );
    await cleanKnipConfig({ knipConfigPath });
  } catch (e) {
    console.log(`Error occurred during knip reporting: ${e}`);
    throw e;
  }
}
