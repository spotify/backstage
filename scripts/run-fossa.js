#!/usr/bin/env node
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

// This script generates an appropriate fossa config, and wraps the running
// of `fossa analyze` in a retry loop as it frequently fails with a 502 error

const { resolve: resolvePath, join: joinPath, basename } = require('path');
const { promises: fs } = require('fs');
const { execFile: execFileCb } = require('child_process');
const { promisify } = require('util');

const execFile = promisify(execFileCb);

const FOSSA_YAML_HEAD = `
version: 2
cli:
  server: https://app.fossa.com
  fetcher: custom
  project: backstage
analyze:
  modules:`;

const IGNORED_DIRS = ['node_modules', 'dist', 'bin', '.git'];

// Finds all directories containing package.json files that we're interested in analyzing
async function findPackageJsonDirs(dir, depth = 0) {
  if (depth > 2) {
    return []; // Skipping packages that are deeper than 2 dirs in
  }
  const files = await fs.readdir(dir);
  const paths = await Promise.all(
    files
      .filter(file => !IGNORED_DIRS.includes(file))
      .map(async file => {
        const path = joinPath(dir, file);

        if ((await fs.stat(path)).isDirectory()) {
          return findPackageJsonDirs(path, depth + 1);
        } else if (file === 'package.json') {
          return dir;
        }
        return [];
      }),
  );
  return paths.flat();
}

// A replacement for `fossa init`, as that generates a bad config for this repo
async function generateConfig(paths) {
  let content = FOSSA_YAML_HEAD;

  for (const path of paths) {
    content += `
  - name: ${basename(path)}
    type: npm
    path: ${path}
    target: ${path}
    options:
      strategy: yarn-list
`;
  }

  return content;
}

// Runs `fossa analyze`, with 502 errors being retried up to 3 times
async function runAnalyze(githubRef) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    console.error(`Running fossa analyze, attempt ${attempt}`);
    try {
      const { stdout, stderr } = await execFile(
        'fossa',
        ['analyze', '--branch', githubRef],
        { shell: true },
      );
      console.error(stderr);
      console.log(stdout);

      return; // Analyze was successful, we're done
    } catch (error) {
      if (!error.code) {
        throw error;
      }
      if (error.stderr) {
        process.stderr.write(error.stderr);
      }
      if (error.stdout) {
        process.stdout.write(error.stdout);
      }
      if (error.stderr && error.stderr.includes('502 Bad Gateway')) {
        console.error('Encountered 502 during fossa analysis upload, retrying');
        continue;
      }
      throw new Error(`Fossa analyze failed with code ${error.code}`);
    }
  }

  console.error('Maximum number of retries reached, skipping fossa analysis');
}

async function main() {
  const githubRef = process.env.GITHUB_REF;
  if (!githubRef) {
    throw new Error('GITHUB_REF is not set');
  }
  // This is picked up by the fossa CLI and should be set
  if (!process.env.FOSSA_API_KEY) {
    throw new Error('FOSSA_API_KEY is not set');
  }

  process.cwd(resolvePath(__dirname, '..'));

  const packageJsonPaths = await findPackageJsonDirs('.');

  const configContents = await generateConfig(packageJsonPaths);

  await fs.writeFile('.fossa.yml', configContents, 'utf8');

  console.error(`Generated fossa config:\n${configContents}`);

  await runAnalyze(githubRef);
}

main().catch(error => {
  console.error(error.stack);
  process.exit(1);
});
