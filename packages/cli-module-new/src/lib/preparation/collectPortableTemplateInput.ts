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

import inquirer, { DistinctQuestion } from 'inquirer';
import { getCodeownersFilePath, parseOwnerIds } from '../codeowners';
import { targetPaths } from '@backstage/cli-common';
import {
  knownBackendPluginPackageNameByPluginId,
  knownFrontendPluginPackageNameByPluginId,
} from '@internal/cli';

import {
  PortableTemplateConfig,
  PortableTemplateInput,
  PortableTemplateInputRoleParams,
  PortableTemplateParams,
  PortableTemplateRole,
} from '../types';
import { PortableTemplate } from '../types';
import { resolvePackageParams } from './resolvePackageParams';

type CollectTemplateParamsOptions = {
  config: PortableTemplateConfig;
  template: PortableTemplate;
  prefilledParams: PortableTemplateParams;
};

export async function collectPortableTemplateInput(
  options: CollectTemplateParamsOptions,
): Promise<PortableTemplateInput> {
  const { config, template, prefilledParams } = options;

  const codeOwnersFilePath = await getCodeownersFilePath(
    targetPaths.workspaceRootDir,
  );

  const prompts = getPromptsForRole(template.role);

  if (codeOwnersFilePath) {
    prompts.push(ownerPrompt());
  }

  const deprecatedParams: PortableTemplateParams = {};
  if (config.isUsingDefaultTemplates && prefilledParams.id) {
    console.warn(
      `DEPRECATION WARNING: The 'id' parameter is deprecated, use 'pluginId' instead`,
    );
    deprecatedParams.pluginId = prefilledParams.id;
  }

  const parameters: PortableTemplateParams = {
    ...template.values,
    ...prefilledParams,
    ...deprecatedParams,
  };

  // Pre-populate pluginPackage for known plugins so the prompt is skipped.
  // Also clear out empty/invalid values so they don't bypass the prompt.
  if (
    template.role === 'backend-plugin-module' ||
    template.role === 'frontend-plugin-module'
  ) {
    const pluginPkg = (parameters.pluginPackage as string | undefined)?.trim();
    if (!pluginPkg || !isValidNpmPackageName(pluginPkg)) {
      delete parameters.pluginPackage;
    } else {
      parameters.pluginPackage = pluginPkg;
    }

    if (parameters.pluginId && !parameters.pluginPackage) {
      const knownPackages =
        template.role === 'backend-plugin-module'
          ? knownBackendPluginPackageNameByPluginId
          : knownFrontendPluginPackageNameByPluginId;
      const knownPackage = knownPackages[parameters.pluginId as string];
      if (knownPackage) {
        parameters.pluginPackage = knownPackage;
      }
    }
  }

  const needsAnswer = [];
  const prefilledAnswers = {} as PortableTemplateParams;
  for (const prompt of prompts) {
    if (prompt.name && parameters[prompt.name] !== undefined) {
      prefilledAnswers[prompt.name] = parameters[prompt.name];
    } else {
      needsAnswer.push(prompt);
    }
  }

  const promptAnswers = await inquirer.prompt<PortableTemplateParams>(
    needsAnswer,
  );

  const answers = {
    ...parameters,
    ...prefilledAnswers,
    ...promptAnswers,
  };

  let pluginPackage: string | undefined;
  if (
    template.role === 'backend-plugin-module' ||
    template.role === 'frontend-plugin-module'
  ) {
    const knownPackages =
      template.role === 'backend-plugin-module'
        ? knownBackendPluginPackageNameByPluginId
        : knownFrontendPluginPackageNameByPluginId;

    pluginPackage =
      (answers.pluginPackage as string) ??
      knownPackages[answers.pluginId as string];
  }

  const roleParams = {
    role: template.role,
    name: answers.name,
    pluginId: answers.pluginId,
    moduleId: answers.moduleId,
    pluginPackage,
  } as PortableTemplateInputRoleParams;

  const packageParams = resolvePackageParams({
    roleParams,
    packagePrefix: config.packageNamePrefix,
    pluginInfix: config.packageNamePluginInfix,
  });

  return {
    roleParams,
    owner: answers.owner as string | undefined,
    license: config.license,
    version: config.version,
    private: config.private,
    publishRegistry: config.publishRegistry,
    packageName: packageParams.packageName,
    packagePath: packageParams.packagePath,
  };
}

export function namePrompt(): DistinctQuestion {
  return {
    type: 'input',
    name: 'name',
    message: 'Enter the name of the package, without scope [required]',
    validate: (value: string) => {
      if (!value) {
        return 'Please enter the name of the package';
      } else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) {
        return 'Package names must be lowercase and contain only letters, digits, and dashes.';
      }
      return true;
    },
  };
}

export function pluginIdPrompt(): DistinctQuestion {
  return {
    type: 'input',
    name: 'pluginId',
    message: 'Enter the ID of the plugin [required]',
    validate: (value: string) => {
      if (!value) {
        return 'Please enter the ID of the plugin';
      } else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) {
        return 'Plugin IDs must be lowercase and contain only letters, digits, and dashes.';
      }
      return true;
    },
  };
}

export function moduleIdIdPrompt(): DistinctQuestion {
  return {
    type: 'input',
    name: 'moduleId',
    message: 'Enter the ID of the module [required]',
    validate: (value: string) => {
      if (!value) {
        return 'Please enter the ID of the module';
      } else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) {
        return 'Module IDs must be lowercase and contain only letters, digits, and dashes.';
      }
      return true;
    },
  };
}

export function pluginPackagePrompt(
  role: 'backend-plugin-module' | 'frontend-plugin-module',
): DistinctQuestion {
  const knownPackages =
    role === 'backend-plugin-module'
      ? knownBackendPluginPackageNameByPluginId
      : knownFrontendPluginPackageNameByPluginId;

  const examplePackage =
    role === 'backend-plugin-module'
      ? '@backstage/plugin-catalog-backend'
      : '@backstage/plugin-catalog';

  return {
    type: 'input',
    name: 'pluginPackage',
    filter: (value: string) => value.trim(),
    message: `Enter the package name of the plugin this module extends (e.g. ${examplePackage}) [required]`,
    validate: (value: string) => {
      if (!value) {
        return 'Please enter the package name of the plugin';
      }
      if (!isValidNpmPackageName(value)) {
        return `Please enter a valid npm package name (e.g. ${examplePackage} or my-plugin)`;
      }
      return true;
    },
    when: (answers: PortableTemplateParams) =>
      !knownPackages[answers.pluginId as string],
  };
}

export function getPromptsForRole(
  role: PortableTemplateRole,
): Array<DistinctQuestion> {
  switch (role) {
    case 'web-library':
    case 'node-library':
    case 'common-library':
    case 'cli-module':
      return [namePrompt()];
    case 'plugin-web-library':
    case 'plugin-node-library':
    case 'plugin-common-library':
    case 'frontend-plugin':
    case 'backend-plugin':
      return [pluginIdPrompt()];
    case 'frontend-plugin-module':
    case 'backend-plugin-module':
      return [pluginIdPrompt(), moduleIdIdPrompt(), pluginPackagePrompt(role)];
    default:
      return [];
  }
}

export function ownerPrompt(): DistinctQuestion {
  return {
    type: 'input',
    name: 'owner',
    message: 'Enter an owner to add to CODEOWNERS [optional]',
    validate: (value: string) => {
      if (!value) {
        return true;
      }

      const ownerIds = parseOwnerIds(value);
      if (!ownerIds) {
        return 'The owner must be a space separated list of team names (e.g. @org/team-name), usernames (e.g. @username), or the email addresses (e.g. user@example.com).';
      }

      return true;
    },
  };
}

// Based on the same pattern as namePrompt/pluginIdPrompt, but extended to support npm scopes
// and additional allowed characters ('.' and '_'). Matches examples like: package-name, my.package_name, @scope/package-name, @scope/package.
const packageNamePattern = /^[a-z0-9][a-z0-9._-]*$/;
const scopedPackageNamePattern =
  /^@[a-z0-9][a-z0-9._-]*\/[a-z0-9][a-z0-9._-]*$/;

function isValidNpmPackageName(name: string) {
  return packageNamePattern.test(name) || scopedPackageNamePattern.test(name);
}
