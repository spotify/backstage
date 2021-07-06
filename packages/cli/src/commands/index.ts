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

import { CommanderStatic } from 'commander';
import { exitWithError } from '../lib/errors';

export function registerCommands(program: CommanderStatic) {
  const configOption = [
    '--config <path>',
    'Config files to load instead of app-config.yaml',
    (opt: string, opts: string[]) => [...opts, opt],
    Array<string>(),
  ] as const;

  program
    .command('app:build')
    .description('Build an app for a production release')
    .option('--stats', 'Write bundle stats to output directory')
    .option('--lax', 'Do not require environment variables to be set')
    .option(...configOption)
    .action(lazy(() => import('./app/build').then(m => m.default)));

  program
    .command('app:serve')
    .description('Serve an app for local development')
    .option('--check', 'Enable type checking and linting')
    .option(...configOption)
    .action(lazy(() => import('./app/serve').then(m => m.default)));

  program
    .command('backend:build')
    .description('Build a backend plugin')
    .action(lazy(() => import('./backend/build').then(m => m.default)));

  program
    .command('backend:bundle')
    .description('Bundle the backend into a deployment archive')
    .option(
      '--build-dependencies',
      'Build all local package dependencies before bundling the backend',
    )
    .action(lazy(() => import('./backend/bundle').then(m => m.default)));

  program
    .command('backend:build-image')
    .allowUnknownOption(true)
    .helpOption(', --backstage-cli-help') // Let docker handle --help
    .option('--build', 'Build packages before packing them into the image')
    .description(
      'Bundles the package into a docker image. This command is deprecated and will be removed.',
    )
    .action(lazy(() => import('./backend/buildImage').then(m => m.default)));

  program
    .command('backend:dev')
    .description('Start local development server with HMR for the backend')
    .option('--check', 'Enable type checking and linting')
    .option('--inspect', 'Enable debugger')
    // We don't actually use the config in the CLI, just pass them on to the NodeJS process
    .option(...configOption)
    .action(lazy(() => import('./backend/dev').then(m => m.default)));

  program
    .command('create-plugin')
    .option(
      '--backend',
      'Create plugin with the backend dependencies as default',
    )
    .description('Creates a new plugin in the current repository')
    .option('--scope <scope>', 'npm scope')
    .option('--npm-registry <URL>', 'npm registry URL')
    .option('--no-private', 'Public npm package')
    .action(
      lazy(() => import('./create-plugin/createPlugin').then(m => m.default)),
    );

  program
    .command('remove-plugin')
    .description('Removes plugin in the current repository')
    .action(
      lazy(() => import('./remove-plugin/removePlugin').then(m => m.default)),
    );

  program
    .command('plugin:build')
    .description('Build a plugin')
    .action(lazy(() => import('./plugin/build').then(m => m.default)));

  program
    .command('plugin:serve')
    .description('Serves the dev/ folder of a plugin')
    .option('--check', 'Enable type checking and linting')
    .option(...configOption)
    .action(lazy(() => import('./plugin/serve').then(m => m.default)));

  program
    .command('plugin:diff')
    .option('--check', 'Fail if changes are required')
    .option('--yes', 'Apply all changes')
    .description('Diff an existing plugin with the creation template')
    .action(lazy(() => import('./plugin/diff').then(m => m.default)));

  program
    .command('build')
    .description('Build a package for publishing')
    .option('--outputs <formats>', 'List of formats to output [types,cjs,esm]')
    .action(lazy(() => import('./build').then(m => m.default)));

  program
    .command('lint')
    .option(
      '--format <format>',
      'Lint report output format',
      'eslint-formatter-friendly',
    )
    .option('--fix', 'Attempt to automatically fix violations')
    .description('Lint a package')
    .action(lazy(() => import('./lint').then(m => m.default)));

  program
    .command('test')
    .allowUnknownOption(true) // Allows the command to run, but we still need to parse raw args
    .helpOption(', --backstage-cli-help') // Let Jest handle help
    .description('Run tests, forwarding args to Jest, defaulting to watch mode')
    .action(lazy(() => import('./testCommand').then(m => m.default)));

  program
    .command('config:docs')
    .option(
      '--package <name>',
      'Only include the schema that applies to the given package',
    )
    .description('Browse the configuration reference documentation')
    .action(lazy(() => import('./config/docs').then(m => m.default)));

  program
    .command('config:print')
    .option(
      '--package <name>',
      'Only load config schema that applies to the given package',
    )
    .option('--lax', 'Do not require environment variables to be set')
    .option('--frontend', 'Print only the frontend configuration')
    .option('--with-secrets', 'Include secrets in the printed configuration')
    .option(
      '--format <format>',
      'Format to print the configuration in, either json or yaml [yaml]',
    )
    .option(...configOption)
    .description('Print the app configuration for the current package')
    .action(lazy(() => import('./config/print').then(m => m.default)));

  program
    .command('config:check')
    .option(
      '--package <name>',
      'Only load config schema that applies to the given package',
    )
    .option('--lax', 'Do not require environment variables to be set')
    .option(...configOption)
    .description(
      'Validate that the given configuration loads and matches schema',
    )
    .action(lazy(() => import('./config/validate').then(m => m.default)));

  program
    .command('config:schema')
    .option(
      '--package <name>',
      'Only output config schema that applies to the given package',
    )
    .option(
      '--format <format>',
      'Format to print the schema in, either json or yaml [yaml]',
    )
    .description('Print configuration schema')
    .action(lazy(() => import('./config/schema').then(m => m.default)));

  program
    .command('versions:bump')
    .description('Bump Backstage packages to the latest versions')
    .action(lazy(() => import('./versions/bump').then(m => m.default)));

  program
    .command('versions:check')
    .option('--fix', 'Fix any auto-fixable versioning problems')
    .description('Check Backstage package versioning')
    .action(lazy(() => import('./versions/lint').then(m => m.default)));

  program
    .command('prepack')
    .description('Prepares a package for packaging before publishing')
    .action(lazy(() => import('./pack').then(m => m.pre)));

  program
    .command('postpack')
    .description('Restores the changes made by the prepack command')
    .action(lazy(() => import('./pack').then(m => m.post)));

  program
    .command('clean')
    .description('Delete cache directories')
    .action(lazy(() => import('./clean/clean').then(m => m.default)));

  program
    .command('build-workspace <workspace-dir> ...<packages>')
    .description('Builds a temporary dist workspace from the provided packages')
    .action(lazy(() => import('./buildWorkspace').then(m => m.default)));

  program
    .command('create-github-app <github-org>')
    .description('Create new GitHub App in your organization.')
    .action(lazy(() => import('./create-github-app').then(m => m.default)));
}

// Wraps an action function so that it always exits and handles errors
function lazy(
  getActionFunc: () => Promise<(...args: any[]) => Promise<void>>,
): (...args: any[]) => Promise<never> {
  return async (...args: any[]) => {
    try {
      const actionFunc = await getActionFunc();
      await actionFunc(...args);

      process.exit(0);
    } catch (error) {
      exitWithError(error);
    }
  };
}
