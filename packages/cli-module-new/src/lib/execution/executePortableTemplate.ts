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

import { toError } from '@backstage/errors';
import { addCodeownersEntry } from '../codeowners';
import { Task } from '../tasks';
import {
  PortableTemplate,
  PortableTemplateConfig,
  PortableTemplateInput,
} from '../types';
import { installNewPackage } from './installNewPackage';
import { writeTemplateContents } from './writeTemplateContents';
import { detectPackageManager } from '@backstage/cli-node/alpha';

type ExecuteNewTemplateOptions = {
  config: PortableTemplateConfig;
  template: PortableTemplate;
  input: PortableTemplateInput;
  skipInstall?: boolean;
};

export async function executePortableTemplate(
  options: ExecuteNewTemplateOptions,
) {
  const { template, input } = options;

  let modified = false;
  try {
    const { targetDir } = await Task.forItem(
      'templating',
      input.packagePath,
      () => writeTemplateContents(template, input),
    );

    modified = true;

    await installNewPackage(input);

    if (input.owner) {
      await addCodeownersEntry(targetDir, input.owner);
    }

    if (!options.skipInstall) {
      const packageManager = await detectPackageManager();
      const ignoreOutput = () => {};
      for (const { args, execute } of [
        {
          args: ['install'],
          execute: () =>
            packageManager.install({
              onStdout: ignoreOutput,
              onStderr: ignoreOutput,
            }),
        },
        {
          args: ['lint', '--fix'],
          execute: () =>
            packageManager.runScript('lint', ['--fix'], {
              cwd: targetDir,
              stdio: 'ignore',
            }),
        },
      ]) {
        const commandStr = packageManager.getCommandHint(args);
        try {
          await Task.forItem('executing', commandStr, execute);
        } catch (error) {
          const err = toError(error);
          Task.error(
            `Warning: Failed to execute command '${commandStr}', ${err}`,
          );
        }
      }
    }

    Task.log();
    Task.log(`🎉  Successfully created ${template.name}`);
    Task.log();
  } catch (error) {
    const err = toError(error);
    Task.error(err.message);

    if (modified) {
      Task.log('It seems that something went wrong in the creation process 🤔');
      Task.log();
      Task.log(
        'We have left the changes that were made intact in case you want to',
      );
      Task.log(
        'continue manually, but you can also revert the changes and try again.',
      );

      Task.error(`🔥  Failed to create ${template.name}!`);
    }
  }
}
