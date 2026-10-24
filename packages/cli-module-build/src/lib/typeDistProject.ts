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
import {
  BackstagePackageFeatureType,
  packageFeatureType,
  PackageRole,
} from '@backstage/cli-node';
import { resolve as resolvePath } from 'node:path';
import { Project, SourceFile, SyntaxKind, ts, Type } from 'ts-morph';
import { targetPaths } from '@backstage/cli-common';

export const createTypeDistProject = async (
  packages: Array<{ dir: string; role?: PackageRole }> = [],
) => {
  const project = new Project({
    tsConfigFilePath: targetPaths.resolveInstallationRoot('tsconfig.json'),
    skipAddingFilesFromTsConfig: true,
  });
  // Adding source files invalidates the TypeScript program, so load all entry
  // point declarations before any package starts querying their types.
  project.addSourceFilesAtPaths(
    packages.flatMap(({ dir, role }) =>
      isTargetPackageRole(role) ? resolvePath(dir, 'dist', '*.d.ts') : [],
    ),
  );
  return project;
};

// A list of the package roles we want to extract features for
const targetPackageRoles: PackageRole[] = [
  'backend-plugin',
  'backend-plugin-module',
  'frontend-plugin',
  'frontend-plugin-module',
  'web-library',
  'node-library',
];

export const getEntryPointDefaultFeatureType = (
  role: PackageRole,
  packageDir: string,
  project: Project,
  entryPoint: string,
): BackstagePackageFeatureType | null => {
  if (isTargetPackageRole(role)) {
    const distPath = resolvePath(packageDir, entryPoint);

    try {
      const defaultFeatureType = getSourceFileDefaultFeatureType(
        project.addSourceFileAtPath(distPath),
      );

      if (defaultFeatureType) {
        return defaultFeatureType;
      }
    } catch (error) {
      console.error(
        `Failed to extract default feature type from ${distPath}, ${error}. ` +
          'Your package will publish fine but it may be missing metadata about its default feature.',
      );
    }
  }

  return null;
};

// Returns all exports (default and named) from an entry point
// that are valid Backstage package features
function getSourceFileDefaultFeatureType(
  sourceFile: SourceFile,
): BackstagePackageFeatureType | null {
  for (const exportSymbol of sourceFile.getExportSymbols()) {
    const declaration = exportSymbol.getDeclarations()[0];
    const exportName = declaration.getSymbol()?.getName();

    if (exportName !== 'default') {
      continue;
    }

    let exportType: Type<ts.Type> | undefined;

    if (declaration) {
      if (declaration.isKind(SyntaxKind.ExportAssignment)) {
        exportType = declaration.getExpression().getType();
      } else if (declaration.isKind(SyntaxKind.ExportSpecifier)) {
        if (!declaration.isTypeOnly()) {
          exportType = declaration.getType();
        }
      } else if (declaration.isKind(SyntaxKind.VariableDeclaration)) {
        exportType = declaration.getType();
      }
    }

    if (exportName && exportType) {
      const $$type = getBackstagePackageFeature$$TypeFromType(exportType);

      if ($$type) {
        return $$type;
      }
    }
  }

  return null;
}

// Given a TS type, returns the Backstage package feature $$type value
function getBackstagePackageFeature$$TypeFromType(
  type: Type,
): BackstagePackageFeatureType | null {
  // Returns the concrete type of a generic type
  const exportType = type.getTargetType() ?? type;

  for (const property of exportType.getProperties()) {
    if (property.getName() === '$$type') {
      const $$type = property
        .getValueDeclaration()
        ?.getText()
        .match(/(\$\$type: '(?<type>.+)')/)?.groups?.type;

      if ($$type && isTargetFeatureType($$type)) {
        return $$type;
      }
    }
  }

  return null;
}

// Condition for a package role matches a target package role
function isTargetPackageRole(role?: PackageRole): boolean {
  return !!role && targetPackageRoles.includes(role);
}

// Returns whether an export is a valid Backstage package feature type
function isTargetFeatureType(
  type: string | BackstagePackageFeatureType,
): type is BackstagePackageFeatureType {
  return (
    !!type && packageFeatureType.includes(type as BackstagePackageFeatureType)
  );
}
