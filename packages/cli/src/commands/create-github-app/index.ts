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
import { paths } from '../../lib/paths';
import { GithubCreateAppServer } from './GithubCreateAppServer';

// This is an experimental command that at this point does not support GitHub Enterprise
// due to lacking support for creating apps from manifests.
// https://docs.github.com/en/free-pro-team@latest/developers/apps/creating-a-github-app-from-a-manifest
export default async (org: string) => {
  const { slug, name, ...config } = await GithubCreateAppServer.run({ org });

  const fileName = `github-app-${slug}-credentials.yaml`;
  const content = `# Name: ${name}\n${stringifyYaml(config)}`;
  await fs.writeFile(paths.resolveTargetRoot(fileName), content);
  console.log(`GitHub App configuration written to ${chalk.cyan(fileName)}`);
  console.log(
    chalk.yellow(
      'This file contains sensitive credentials, it should not be committed to version control and handled with care!',
    ),
  );
  // TODO: log instructions on how to use the newly created app configuration.
};
