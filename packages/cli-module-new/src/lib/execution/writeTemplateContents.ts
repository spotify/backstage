/*
 * Copyright 2021 The Backstage Authors
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
import { dirname, resolve as resolvePath } from 'node:path';

import { PortableTemplate, PortableTemplateInput } from '../types';
import { ForwardedError, InputError } from '@backstage/errors';
import { isMonoRepo as getIsMonoRepo } from '@backstage/cli-node';
import { PortableTemplater } from './PortableTemplater';
import { isChildPath, targetPaths } from '@backstage/cli-common';

export async function writeTemplateContents(
  template: PortableTemplate,
  input: PortableTemplateInput,
): Promise<{ targetDir: string }> {
  const targetDir = targetPaths.resolveInstallationRoot(input.packagePath);

  if (await fs.pathExists(targetDir)) {
    throw new InputError(`Package '${input.packagePath}' already exists`);
  }

  try {
    const isMonoRepo = await getIsMonoRepo();

    const { role, ...roleValues } = input.roleParams;

    const templater = await PortableTemplater.create({
      values: {
        ...roleValues,
        packageName: input.packageName,
      },
      templatedValues: template.values,
    });

    if (!isMonoRepo) {
      await fs.writeJson(
        resolvePath(targetDir, 'tsconfig.json'),
        {
          extends: '@backstage/cli/config/tsconfig.json',
          include: ['src', 'dev', 'migrations'],
          exclude: ['node_modules'],
          compilerOptions: {
            outDir: 'dist-types',
            rootDir: '.',
          },
        },
        { spaces: 2 },
      );
    }

    for (const file of template.files) {
      const destPath = resolvePath(targetDir, templater.template(file.path));
      if (!isChildPath(targetDir, destPath)) {
        throw new Error(
          `Path ${destPath} is outside of target directory ${targetDir}`,
        );
      }
      await fs.ensureDir(dirname(destPath));

      let content =
        file.syntax === 'handlebars'
          ? templater.template(file.content)
          : file.content;

      // Automatically inject input values into package.json
      if (file.path === 'package.json') {
        try {
          content = injectPackageJsonInput(input, content, pluginPackage =>
            templater.getPackageVersion(pluginPackage),
          );
        } catch (error) {
          throw new ForwardedError(
            'Failed to transform templated package.json',
            error,
          );
        }
      }

      await fs.writeFile(destPath, content).catch(error => {
        throw new ForwardedError(`Failed to copy file to ${destPath}`, error);
      });
    }

    return { targetDir };
  } catch (error) {
    await fs.rm(targetDir, { recursive: true, force: true, maxRetries: 10 });
    throw error;
  }
}

export function injectPackageJsonInput(
  input: PortableTemplateInput,
  content: string,
  resolvePluginPackageVersion: (pluginPackage: string) => string | undefined,
) {
  const pkgJson = JSON.parse(content);

  const toAdd = new Array<[name: string, value: unknown]>();

  if (pkgJson.version) {
    pkgJson.version = input.version;
  } else {
    toAdd.push(['version', input.version]);
  }
  if (pkgJson.license) {
    pkgJson.license = input.license;
  } else {
    toAdd.push(['license', input.license]);
  }
  if (input.private) {
    if (pkgJson.private === false) {
      pkgJson.private = true;
    } else if (!pkgJson.private) {
      toAdd.push(['private', true]);
    }
  } else {
    delete pkgJson.private;
  }

  if (input.roleParams.role === 'backend-plugin-module') {
    const pluginPackage = input.roleParams.pluginPackage;
    const hasPluginPackageDependency = [
      pkgJson.dependencies,
      pkgJson.devDependencies,
      pkgJson.optionalDependencies,
      pkgJson.peerDependencies,
    ].some(dependencies => dependencies?.[pluginPackage] !== undefined);

    if (!hasPluginPackageDependency) {
      const pluginPackageVersion = resolvePluginPackageVersion(pluginPackage);
      if (pluginPackageVersion) {
        pkgJson.devDependencies = {
          ...pkgJson.devDependencies,
          [pluginPackage]: pluginPackageVersion,
        };
      }
    }
  }

  if (input.publishRegistry) {
    if (pkgJson.publishConfig) {
      pkgJson.publishConfig = {
        ...pkgJson.publishConfig,
        registry: input.publishRegistry,
      };
    } else {
      toAdd.push(['publishConfig', { registry: input.publishRegistry }]);
    }
  }

  const entries = Object.entries(pkgJson);

  const nameIndex = entries.findIndex(([name]) => name === 'name');
  if (nameIndex === -1) {
    throw new Error('templated package.json does not contain a name field');
  }

  entries.splice(nameIndex + 1, 0, ...toAdd);

  return JSON.stringify(Object.fromEntries(entries), null, 2);
}
