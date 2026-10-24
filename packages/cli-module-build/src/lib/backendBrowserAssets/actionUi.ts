/*
 * Copyright 2026 The Backstage Authors
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
import { dirname, join, resolve } from 'node:path';
import { globSync } from 'glob';
import { Node, Project, SyntaxKind } from 'ts-morph';
import type { BackendBrowserAsset } from './types';

const sourcePattern = 'src/**/*.{js,jsx,ts,tsx}';
const actionNamePattern = /^[a-z0-9][a-z0-9._-]*$/;
const scriptExtensions = ['.js', '.jsx', '.ts', '.tsx'];
const loaderPattern =
  /import\(\s*['"]([^'"]+)['"]\s*\)\.then\(\s*([A-Za-z_$][\w$]*)\s*=>\s*(?:\2\.([A-Za-z_$][\w$]*)|<\2\.([A-Za-z_$][\w$]*)\s*\/>),?\s*\)/;

async function resolveEntry(sourceFilePath: string, request: string) {
  const base = resolve(dirname(sourceFilePath), request);
  const candidates = [
    base,
    ...scriptExtensions.map(extension => `${base}${extension}`),
    ...scriptExtensions.map(extension => join(base, `index${extension}`)),
  ];
  for (const candidate of candidates) {
    if (await fs.pathExists(candidate)) {
      return candidate;
    }
  }
  throw new Error(
    `Unable to resolve action UI module '${request}' from ${sourceFilePath}`,
  );
}

function readStringProperty(object: Node, name: string): string | undefined {
  if (!Node.isObjectLiteralExpression(object)) {
    return undefined;
  }
  const property = object.getProperty(name);
  if (!property || !Node.isPropertyAssignment(property)) {
    return undefined;
  }
  const value = property.getInitializer();
  return value && Node.isStringLiteral(value)
    ? value.getLiteralValue()
    : undefined;
}

function findActionName(uiProperty: Node): string | undefined {
  for (const ancestor of uiProperty.getAncestors()) {
    const name = readStringProperty(ancestor, 'name');
    if (name) {
      return name;
    }
  }
  return undefined;
}

function isActionDeclaration(uiProperty: Node): boolean {
  return uiProperty
    .getAncestors()
    .some(
      ancestor =>
        Node.isObjectLiteralExpression(ancestor) &&
        Boolean(ancestor.getProperty('name')) &&
        Boolean(ancestor.getProperty('action')),
    );
}

export async function discoverActionUiBrowserAssets(
  targetDir: string,
): Promise<BackendBrowserAsset[]> {
  const assets: BackendBrowserAsset[] = [];
  const packageJson = await fs.readJson(resolve(targetDir, 'package.json'));
  if (
    packageJson.backstage?.role !== 'backend-plugin' &&
    packageJson.backstage?.role !== 'backend-plugin-module'
  ) {
    return assets;
  }
  const paths = globSync(sourcePattern, {
    cwd: targetDir,
    absolute: true,
    nodir: true,
    ignore: [
      'src/**/*.test.*',
      'src/**/*.spec.*',
      'src/**/__tests__/**',
      'src/**/fixtures/**',
    ],
  });
  const project = new Project({ skipAddingFilesFromTsConfig: true });
  for (const path of paths) {
    const source = await fs.readFile(path, 'utf8');
    if (source.includes('ui')) {
      project.createSourceFile(path, source, { overwrite: true });
    }
  }

  const actionNames = new Map<string, string>();
  for (const sourceFile of project.getSourceFiles()) {
    for (const property of sourceFile.getDescendantsOfKind(
      SyntaxKind.PropertyAssignment,
    )) {
      if (property.getName() !== 'ui' || !isActionDeclaration(property)) {
        continue;
      }
      const ui = property.getInitializer();
      if (!ui || !Node.isObjectLiteralExpression(ui)) {
        throw new Error(
          `${sourceFile.getFilePath()}:${property.getStartLineNumber()} action UI must be declared as an inline object literal`,
        );
      }
      const component = ui.getProperty('component');
      if (!component) {
        continue;
      }
      if (!Node.isPropertyAssignment(component)) {
        throw new Error(
          `${sourceFile.getFilePath()}:${ui.getStartLineNumber()} action UI must declare component as a property assignment`,
        );
      }
      const actionName = findActionName(property);
      if (!actionName) {
        throw new Error(
          `${sourceFile.getFilePath()}:${property.getStartLineNumber()} action UI must be declared inside an action with a literal name`,
        );
      }
      if (!actionNamePattern.test(actionName)) {
        throw new Error(
          `${sourceFile.getFilePath()}:${property.getStartLineNumber()} action name '${actionName}' must match ${actionNamePattern}`,
        );
      }
      const match = component.getInitializer()?.getText().match(loaderPattern);
      if (!match) {
        throw new Error(
          `${sourceFile.getFilePath()}:${component.getStartLineNumber()} action UI component must use () => import('./module').then(module => module.Component)`,
        );
      }
      const previous = actionNames.get(actionName);
      if (previous) {
        throw new Error(
          `Duplicate action UI for '${actionName}' in ${previous} and ${sourceFile.getFilePath()}`,
        );
      }
      actionNames.set(actionName, sourceFile.getFilePath());
      assets.push({
        id: actionName,
        entry: await resolveEntry(sourceFile.getFilePath(), match[1]),
        exportName: match[3] ?? match[4],
      });
    }
  }
  return assets;
}
