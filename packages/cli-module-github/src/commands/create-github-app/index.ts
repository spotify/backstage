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

import fs from 'fs-extra';
import chalk from 'chalk';
import { stringify as stringifyYaml } from 'yaml';
import inquirer, { Question, Answers } from 'inquirer';
import { targetPaths } from '@backstage/cli-common';
import { cli } from 'cleye';

import { GithubCreateAppServer } from './GithubCreateAppServer';
import openBrowser from 'react-dev-utils/openBrowser';
import type { CliCommandContext } from '@backstage/cli-node';

// This is an experimental command that at this point does not support GitHub Enterprise
// due to lacking support for creating apps from manifests.
// https://docs.github.com/en/free-pro-team@latest/developers/apps/creating-a-github-app-from-a-manifest
export default async ({ args, info }: CliCommandContext) => {
  const { _: positionals } = cli(
    {
      name: info.usage,
      booleanFlagNegation: true,
      parameters: ['<github-org>'],
    },
    undefined,
    args,
  );

  const org = positionals[0];

  const answers: Answers = await inquirer.prompt({
    name: 'appType',
    type: 'checkbox',
    message:
      'Select permissions [required] (these can be changed later but then require approvals in all installations)',
    choices: [
      {
        name: 'Read access to content (required by Software Catalog to ingest data from repositories)',
        value: 'read',
        checked: true,
      },
      {
        name: 'Read access to members (required by Software Catalog to ingest GitHub teams)',
        value: 'members',
        checked: true,
      },
      {
        name: 'Read and Write to content and actions (required by Software Templates to create new repositories)',
        value: 'write',
      },
    ],
  });

  if (answers.appType.length === 0) {
    console.log(chalk.red('You must select at least one permission'));
    process.exit(1);
  }

  await verifyGithubOrg(org);
  const { slug, name, ...config } = await GithubCreateAppServer.run({
    org,
    permissions: answers.appType,
  });

  const fileName = `github-app-${slug}-credentials.yaml`;
  const content = `# Name: ${name}\n${stringifyYaml(config)}`;
  await fs.writeFile(targetPaths.resolveInstallationRoot(fileName), content);
  console.log(`GitHub App configuration written to ${chalk.cyan(fileName)}`);
  console.log(
    chalk.yellow(
      'This file contains sensitive credentials, it should not be committed to version control and handled with care!',
    ),
  );
  console.log(
    "Here's an example on how to update the integrations section in app-config.yaml",
  );
  console.log(
    chalk.green(`
integrations:
  github:
    - host: github.com
      apps:
        - $include: ${fileName}`),
  );
};

async function verifyGithubOrg(org: string): Promise<void> {
  let response;

  try {
    response = await fetch(
      `https://api.github.com/orgs/${encodeURIComponent(org)}`,
    );
  } catch (e) {
    console.log(
      chalk.yellow(
        'Warning: Unable to verify existence of GitHub organization. ',
        e,
      ),
    );
  }

  if (response?.status === 404) {
    const questions: Question[] = [
      {
        type: 'confirm',
        name: 'shouldCreateOrg',
        message: `GitHub organization ${chalk.cyan(
          org,
        )} does not exist. Would you like to create a new Organization instead?`,
      },
    ];

    const answers = await inquirer.prompt(questions);

    if (!answers.shouldCreateOrg) {
      console.log(
        chalk.yellow('GitHub organization must exist to create GitHub app'),
      );
      process.exit(1);
    }

    openBrowser('https://github.com/account/organizations/new');

    console.log(
      chalk.yellow(
        'Please re-run this command when you have created your new organization',
      ),
    );

    process.exit(0);
  }
}
