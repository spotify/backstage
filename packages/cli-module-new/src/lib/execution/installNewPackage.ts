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
import fs from 'fs-extra';
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';
import { targetPaths } from '@backstage/cli-common';

import { Task } from '../tasks';
import { PortableTemplateInput } from '../types';

export async function installNewPackage(input: PortableTemplateInput) {
  switch (input.roleParams.role) {
    case 'web-library':
    case 'node-library':
    case 'common-library':
    case 'plugin-web-library':
    case 'plugin-node-library':
    case 'plugin-common-library':
      return; // No installation action needed for library packages
    case 'frontend-plugin':
      await addDependency(input, 'packages/app/package.json');
      await tryAddFrontendLegacy(input);
      return;
    case 'frontend-plugin-module':
      await addDependency(input, 'packages/app/package.json');
      return;
    case 'backend-plugin':
      await addDependency(input, 'packages/backend/package.json');
      await tryAddBackend(input);
      return;
    case 'backend-plugin-module':
      await addDependency(input, 'packages/backend/package.json');
      await tryAddBackend(input);
      return;
    default:
      throw new Error(
        `Unsupported role ${(input.roleParams as { role: string }).role}`,
      );
  }
}

async function addDependency(input: PortableTemplateInput, path: string) {
  const pkgJsonPath = targetPaths.resolveInstallationRoot(path);

  const pkgJson = await fs.readJson(pkgJsonPath).catch(error => {
    if (error.code === 'ENOENT') {
      return undefined;
    }
    throw error;
  });
  if (!pkgJson) {
    return;
  }

  try {
    pkgJson.dependencies = {
      ...pkgJson.dependencies,
      [input.packageName]: `workspace:^`,
    };

    await fs.writeJson(path, pkgJson, { spaces: 2 });
  } catch (error) {
    throw new Error(`Failed to add package dependencies, ${error}`);
  }
}

async function tryAddFrontendLegacy(input: PortableTemplateInput) {
  const { roleParams } = input;
  if (roleParams.role !== 'frontend-plugin') {
    throw new Error(
      'add-frontend-legacy can only be used for frontend plugins',
    );
  }

  const appDefinitionPath = targetPaths.resolveInstallationRoot(
    'packages/app/src/App.tsx',
  );
  if (!(await fs.pathExists(appDefinitionPath))) {
    return;
  }

  await Task.forItem('app', 'adding import', async () => {
    const content = await fs.readFile(appDefinitionPath, 'utf8');
    const revLines = content.split('\n').reverse();

    const lastImportIndex = revLines.findIndex(line =>
      line.match(/ from ("|').*("|')/),
    );
    const lastRouteIndex = revLines.findIndex(line =>
      line.match(/<\/FlatRoutes/),
    );

    if (lastImportIndex !== -1 && lastRouteIndex !== -1) {
      const extensionName = upperFirst(`${camelCase(roleParams.pluginId)}Page`);
      const importLine = `import { ${extensionName} } from '${input.packageName}';`;
      if (!content.includes(importLine)) {
        revLines.splice(lastImportIndex, 0, importLine);
      }

      const componentLine = `<Route path="/${roleParams.pluginId}" element={<${extensionName} />} />`;
      if (!content.includes(componentLine)) {
        const [indentation] = revLines[lastRouteIndex + 1].match(/^\s*/) ?? [];
        revLines.splice(lastRouteIndex + 1, 0, indentation + componentLine);
      }

      const newContent = revLines.reverse().join('\n');
      await fs.writeFile(appDefinitionPath, newContent, 'utf8');
    }
  });
}

async function tryAddBackend(input: PortableTemplateInput) {
  const backendIndexPath = targetPaths.resolveInstallationRoot(
    'packages/backend/src/index.ts',
  );
  if (!(await fs.pathExists(backendIndexPath))) {
    return;
  }

  await Task.forItem('backend', `adding ${input.packageName}`, async () => {
    const content = await fs.readFile(backendIndexPath, 'utf8');
    const lines = content.split('\n');
    const backendAddLine = `backend.add(import('${input.packageName}'));`;

    const backendStartIndex = lines.findIndex(line =>
      line.match(/backend.start/),
    );

    if (backendStartIndex !== -1) {
      const [indentation] = lines[backendStartIndex].match(/^\s*/)!;
      lines.splice(backendStartIndex, 0, `${indentation}${backendAddLine}`);

      const newContent = lines.join('\n');
      await fs.writeFile(backendIndexPath, newContent, 'utf8');
    }
  });
}
