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
const { execSync, spawnSync } = require('child_process');
// eslint-disable-next-line import/no-extraneous-dependencies
const commandExists = require('command-exists');

const inheritStdIo = {
  stdio: 'inherit',
};

const LINT_SKIPPED_MESSAGE =
  'Skipping documentation quality check (vale not found). Install vale linter (https://docs.errata.ai/vale/install) to enable.\n';
const LINT_ERROR_MESSAGE = `Language linter (vale) generated errors. Please check the errors and review any markdown files that you changed.
  Possibly update .github/styles/vocab.txt to add new valid words.\n`;
const VALE_NOT_FOUND_MESSAGE = `Language linter (vale) was not found. Please install vale linter (https://docs.errata.ai/vale/install).\n`;

// Note: Make sure the script is run as `node check-docs-quality.js [FILES]` instead of `./check-docs-quality.js [FILES]`
// If the script receives arguments (file paths), the script is run exclusively on them. (e.g. when run via pre-commit hook)
const getFilesToLint = () => {
  // Files have been provided as arguments
  if (process.argv.length > 2) {
    return process.argv.slice(2);
  }

  let command = `git ls-files | ./node_modules/.bin/shx grep ".md"`;
  if (process.platform === 'win32') {
    command = `git ls-files | .\\node_modules\\.bin\\shx grep ".md"`;
  }

  // Note this ignore list only applies locally, CI runs `.github/workflows/docs-quality-checker.yml`
  const ignored = ['', 'ADOPTERS.md', 'OWNERS.md'];

  return execSync(command, {
    stdio: ['ignore', 'pipe', 'inherit'],
  })
    .toString()
    .split('\n')
    .filter(el => !ignored.includes(el));
};

// Proceed with the script only if Vale linter is installed. Limit the friction and surprises caused by the script.
// On CI, we want to ensure vale linter is run.
commandExists('vale')
  .catch(() => {
    if (process.env.CI) {
      console.log(VALE_NOT_FOUND_MESSAGE);
      process.exit(1);
    }
    console.log(LINT_SKIPPED_MESSAGE);
    process.exit(0);
  })
  .then(() => {
    const filesToLint = getFilesToLint();

    if (process.platform === 'win32') {
      // Windows
      try {
        const output = spawnSync('vale', filesToLint, inheritStdIo);

        // If the command does not succeed
        if (output.status !== 0) {
          // If it contains system level error. In this case vale does not exist.
          if (output.error) {
            console.log(LINT_ERROR_MESSAGE);
          }
          process.exit(1);
        }
      } catch (e) {
        console.log(e.message);
        process.exit(1);
      }
    } else {
      // Unix
      const output = spawnSync('vale', filesToLint, inheritStdIo);
      if (output.status !== 0) {
        console.log(LINT_ERROR_MESSAGE);
        process.exit(1);
      }
    }
  });
