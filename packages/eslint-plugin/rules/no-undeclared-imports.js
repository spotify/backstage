/*
 * Copyright 2023 The Backstage Authors
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

// @ts-check

const fs = require('node:fs');
const path = require('node:path');
const getPackageMap = require('../lib/getPackages');
const visitImports = require('../lib/visitImports');
const minimatch = require('minimatch');
const { execFileSync } = require('node:child_process');

const depFields = /** @type {const} */ ({
  dep: 'dependencies',
  dev: 'devDependencies',
  peer: 'peerDependencies',
});

const devModulePatterns = [
  new minimatch.Minimatch('!src/**'),
  new minimatch.Minimatch('src/**/*.test.*'),
  new minimatch.Minimatch('src/**/*.stories.*'),
  new minimatch.Minimatch('src/**/__testUtils__/**'),
  new minimatch.Minimatch('src/**/__mocks__/**'),
  new minimatch.Minimatch('src/setupTests.*'),
];

function getExpectedDepType(
  /** @type {any} */ localPkg,
  /** @type {string} */ impPath,
  /** @type {string} */ modulePath,
) {
  const role = localPkg?.backstage?.role;
  // Some package roles have known dependency types
  switch (role) {
    case 'common-library':
    case 'web-library':
    case 'frontend-plugin':
    case 'frontend-plugin-module':
    case 'node-library':
    case 'backend-plugin':
    case 'backend-plugin-module':
      switch (impPath) {
        case 'react':
        case 'react-dom':
        case 'react-router':
        case 'react-router-dom':
          return 'peer';
      }
      break;
    case 'cli':
    case 'frontend':
    case 'backend':
    default:
      break;
  }

  for (const pattern of devModulePatterns) {
    if (pattern.match(modulePath)) {
      return 'dev';
    }
  }
  return 'dep';
}

/**
 *
 * @param {import('@manypkg/get-packages').Package['packageJson']} pkg
 * @param {string} name
 * @param {ReturnType<typeof getExpectedDepType>} expectedType
 * @returns {{oldDepsField?: string, depsField: string} | undefined}
 */
function findConflict(pkg, name, expectedType) {
  const isDep = pkg.dependencies?.[name];
  const isDevDep = pkg.devDependencies?.[name];
  const isPeerDep = pkg.peerDependencies?.[name];
  const depsField = depFields[expectedType];

  if (expectedType === 'dep' && !isDep && !isPeerDep) {
    const oldDepsField = isDevDep ? depFields.dev : undefined;
    return { oldDepsField, depsField };
  } else if (expectedType === 'dev' && !isDevDep && !isDep && !isPeerDep) {
    return { oldDepsField: undefined, depsField };
  } else if (expectedType === 'peer' && !isPeerDep) {
    const oldDepsField = isDep
      ? depFields.dep
      : isDevDep
      ? depFields.dev
      : undefined;

    return { oldDepsField, depsField };
  }
  return undefined;
}

/**
 * @typedef {'yarn' | 'pnpm'} PackageManagerName
 */

/**
 * Detects the package manager of the project, following the same order as
 * the Backstage CLI as far as needed here: the packageManager field of the
 * root package.json, or else its devEngines.packageManager field, when it
 * names a supported package manager, then the presence of a pnpm lockfile in
 * the project root, and otherwise Yarn.
 * @param {import('../lib/getPackages').ExtendedPackage} root
 * @returns {PackageManagerName}
 */
function detectPackageManager(root) {
  const declared = root.packageJson.packageManager;
  const devEngines = /** @type {any} */ (root.packageJson).devEngines
    ?.packageManager;
  /** @type {unknown[]} */
  const devEngineNames = [devEngines].flat().map(entry => entry?.name);
  const declaredName =
    typeof declared === 'string'
      ? declared.split('@')[0]
      : devEngineNames.find(name => name === 'yarn' || name === 'pnpm');
  if (declaredName === 'yarn' || declaredName === 'pnpm') {
    return declaredName;
  }
  if (fs.existsSync(path.join(root.dir, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }
  return 'yarn';
}

/**
 * Returns the flag that makes the package manager's `add` command target a
 * directory other than the current one.
 * @param {PackageManagerName} packageManager
 */
function getDirFlag(packageManager) {
  return packageManager === 'pnpm' ? '--dir' : '--cwd';
}

/**
 * @param {string} depsField
 * @param {PackageManagerName} packageManager
 */
function getAddFlagForDepsField(depsField, packageManager) {
  switch (depsField) {
    case depFields.dep:
      return '';
    case depFields.dev:
      return packageManager === 'pnpm' ? ' --save-dev' : ' --dev';
    case depFields.peer:
      return packageManager === 'pnpm' ? ' --save-peer' : ' --peer';
    default:
      return '';
  }
}

/**
 * Looks up the most common version range for a dependency if it already exists in the repo.
 *
 * @param {string} name
 * @param {string} depsField
 * @param {getPackageMap.PackageMap} packages
 * @param {PackageManagerName} packageManager
 * @returns {string}
 */
function addVersionQuery(name, depsField, packages, packageManager) {
  const rangeCounts = new Map();

  const field =
    Object.values(depFields).find(f => f === depsField) ?? depFields.dep;
  for (const pkg of packages.list) {
    const range = pkg.packageJson[field]?.[name];
    if (range) {
      rangeCounts.set(range, (rangeCounts.get(range) ?? 0) + 1);
    }
  }

  const mostCommonRange = [...rangeCounts.entries()].sort(
    (a, b) => b[1] - a[1],
  )[0]?.[0];
  if (!mostCommonRange) {
    // pnpm only links workspace packages that use the workspace protocol
    if (packageManager === 'pnpm' && packages.map.has(name)) {
      return `${name}@workspace:^`;
    }
    return name;
  }
  return `${name}@${mostCommonRange}`;
}

/**
 * Add missing package imports
 * @param {Array<{name: string, depsField: string, node: import('estree').Node}>} toAdd
 * @param {import('../lib/getPackages').PackageMap} packages
 * @param {import('../lib/getPackages').ExtendedPackage} localPkg
 * @param {PackageManagerName} packageManager
 */
function addMissingImports(toAdd, packages, localPkg, packageManager) {
  /** @type Record<string, Set<string>> */
  const byField = {};

  for (const { name, depsField } of toAdd) {
    byField[depsField] = byField[depsField] ?? new Set();
    byField[depsField].add(name);
  }

  for (const name of byField[depFields.dep] ?? []) {
    byField[depFields.dev]?.delete(name);
  }
  for (const name of byField[depFields.peer] ?? []) {
    byField[depFields.dep]?.delete(name);
    byField[depFields.dev]?.delete(name);
  }

  for (const [depsField, names] of Object.entries(byField)) {
    const flag = getAddFlagForDepsField(depsField, packageManager).trim();

    // Look up existing version queries in the repo for the same dependency
    const namesWithQuery = [...names].map(name =>
      addVersionQuery(name, depsField, packages, packageManager),
    );

    // The security implication of this is a bit interesting, as crafted add-import
    // directives could be used to install malicious packages. However, the same is true
    // for adding malicious packages to package.json, so there's no significant difference.
    execFileSync(
      packageManager,
      ['add', ...(flag ? [flag] : []), ...namesWithQuery],
      {
        cwd: localPkg.dir,
        stdio: 'inherit',
      },
    );
  }
}

/**
 * Removes dependency entries pointing to inlined workspace packages.
 * @param {Array<{pkg: import('../lib/getPackages').ExtendedPackage, node: import('estree').Node}>} toInline
 * @param {import('../lib/getPackages').ExtendedPackage} localPkg
 * @param {PackageManagerName} packageManager
 */
function removeInlineImports(toInline, localPkg, packageManager) {
  /** @type Set<string> */
  const toRemove = new Set();

  for (const { pkg } of toInline) {
    const name = pkg.packageJson.name;
    for (const depType of Object.values(depFields)) {
      if (localPkg.packageJson[depType]?.[name]) {
        toRemove.add(name);
      }
    }
  }
  if (toRemove.size > 0) {
    execFileSync(packageManager, ['remove', ...toRemove], {
      cwd: localPkg.dir,
      stdio: 'inherit',
    });
  }
}

/**
 * Adds dependencies that are not properly forwarded from inline dependencies.
 * @param {Array<{pkg: import('../lib/getPackages').ExtendedPackage, node: import('estree').Node}>} toInline
 * @param {import('../lib/getPackages').ExtendedPackage} localPkg
 * @param {PackageManagerName} packageManager
 */
function addForwardedInlineImports(toInline, localPkg, packageManager) {
  const declaredProdDeps = new Set([
    ...Object.keys(localPkg.packageJson.dependencies ?? {}),
    ...Object.keys(localPkg.packageJson.peerDependencies ?? {}),
    localPkg.packageJson.name, // include self
  ]);

  /** @type Map<string, Map<string, string>> */
  const byFlagByName = new Map();

  for (const { pkg } of toInline) {
    for (const depType of /** @type {const} */ ([
      'dependencies',
      'peerDependencies',
    ])) {
      for (const [depName, depQuery] of Object.entries(
        pkg.packageJson[depType] ?? {},
      )) {
        if (!declaredProdDeps.has(depName)) {
          const flag = getAddFlagForDepsField(depType, packageManager).trim();
          const byName = byFlagByName.get(flag);
          if (byName) {
            const query = byName.get(depName);
            if (query && query !== depQuery) {
              throw new Error(
                `Conflicting dependency queries for inlined package dep ${depName}, got ${query} and ${depQuery}`,
              );
            } else {
              byName.set(depName, depQuery);
            }
          } else {
            byFlagByName.set(flag, new Map([[depName, depQuery]]));
          }
        }
      }
    }
  }

  for (const [flag, byName] of byFlagByName) {
    const namesWithQuery = [...byName.entries()].map(
      ([name, query]) => `${name}@${query}`,
    );
    execFileSync(
      packageManager,
      ['add', ...(flag ? [flag] : []), ...namesWithQuery],
      {
        cwd: localPkg.dir,
        stdio: 'inherit',
      },
    );
  }
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    fixable: 'code',
    messages: {
      undeclared:
        "{{ packageName }} must be declared in {{ depsField }} of {{ packageJsonPath }}, run '{{ packageManager }} {{ dirFlag }} {{ packagePath }} add{{ addFlag }} {{ packageName }}' from the project root.",
      switch:
        '{{ packageName }} is declared in {{ oldDepsField }}, but should be moved to {{ depsField }} in {{ packageJsonPath }}.',
      switchBack: 'Switch back to import declaration',
      inlineDirect: `The dependency on the inline package {{ packageName }} must not be declared in package dependencies.`,
      inlineMissing: `Each production dependency from the inline package {{ packageName }} must be re-declared by this package, the following dependencies are missing: {{ missingDeps }}`,
    },
    docs: {
      description:
        'Forbid imports of external packages that have not been declared in the appropriate dependencies field in `package.json`.',
      url: 'https://github.com/backstage/backstage/blob/master/packages/eslint-plugin/docs/rules/no-undeclared-imports.md',
    },
  },
  create(context) {
    const packages = getPackageMap(context.getCwd());
    if (!packages) {
      return {};
    }
    const filePath = context.getPhysicalFilename
      ? context.getPhysicalFilename()
      : context.getFilename();

    const localPkg = packages.byPath(filePath);
    if (!localPkg) {
      return {};
    }

    const packageManager = detectPackageManager(packages.root);

    /** @type Array<{name: string, depsField: string, node: import('estree').Node}> */
    const importsToAdd = [];

    /** @type Array<{pkg: import('../lib/getPackages').ExtendedPackage, node: import('estree').Node}> */
    const importsToInline = [];

    return {
      // All missing imports that we detect are collected as we traverse, and then we use
      // the program exit to execute all install directives that have been found.
      ['Program:exit']() {
        if (importsToAdd.length > 0) {
          addMissingImports(importsToAdd, packages, localPkg, packageManager);

          packages.clearCache();
          // This switches all import directives back to the original import.
          for (const added of importsToAdd) {
            context.report({
              node: added.node,
              messageId: 'switchBack',
              fix(fixer) {
                return fixer.replaceText(added.node, `'${added.name}'`);
              },
            });
          }
          importsToAdd.length = 0;
        }

        if (importsToInline.length > 0) {
          removeInlineImports(importsToInline, localPkg, packageManager);
          addForwardedInlineImports(importsToInline, localPkg, packageManager);

          packages.clearCache();
          for (const inlined of importsToInline) {
            context.report({
              node: inlined.node,
              messageId: 'switchBack',
              fix(fixer) {
                return fixer.replaceText(
                  inlined.node,
                  `'${inlined.pkg.packageJson.name}'`,
                );
              },
            });
          }
          importsToInline.length = 0;
        }
      },
      ...visitImports(context, (node, imp) => {
        // We leave checking of type imports to the repo-tools check,
        // and we skip builtins and local imports
        if (
          imp.kind === 'type' ||
          imp.type === 'builtin' ||
          imp.type === 'local'
        ) {
          return;
        }

        // Any import directive that is found is collected for processing later
        if (imp.type === 'directive') {
          const [, directive, ...args] = imp.path.split(':');

          if (directive === 'add-import') {
            const [type, name] = args;
            if (!name.match(/^(@[-\w\.~]+\/)?[-\w\.~]*$/i)) {
              throw new Error(
                `Invalid package name to add as dependency: '${name}'`,
              );
            }

            importsToAdd.push({
              depsField: type,
              name,
              node: imp.node,
            });
          }

          if (directive === 'inline-imports') {
            const [name] = args;
            const pkg = packages.map.get(name);
            if (!pkg) {
              throw new Error(`Unexpectedly missing inline package: ${name}`);
            }

            importsToInline.push({
              pkg: pkg,
              node: imp.node,
            });
          }

          return;
        }

        // Importing an internal inlined package, whose imports are inlined too
        if (
          imp.type === 'internal' &&
          imp.package.packageJson.backstage?.inline
        ) {
          for (const depType of Object.values(depFields)) {
            if (localPkg.packageJson[depType]?.[imp.packageName]) {
              context.report({
                node,
                messageId: 'inlineDirect',
                data: {
                  packageName: imp.packageName,
                },
                fix: fixer => {
                  return fixer.replaceText(
                    imp.node,
                    `'directive:inline-imports:${imp.packageName}'`,
                  );
                },
              });
              return;
            }
          }

          const missingDeps = [];
          const declaredProdDeps = new Set([
            ...Object.keys(localPkg.packageJson.dependencies ?? {}),
            ...Object.keys(localPkg.packageJson.peerDependencies ?? {}),
            localPkg.packageJson.name, // include self
          ]);
          for (const depType of /** @type {const} */ ([
            'dependencies',
            'peerDependencies',
          ])) {
            for (const depName of Object.keys(
              imp.package.packageJson[depType] ?? {},
            )) {
              if (!declaredProdDeps.has(depName)) {
                missingDeps.push(depName);
              }
            }
          }

          if (missingDeps.length > 0) {
            context.report({
              node,
              messageId: 'inlineMissing',
              data: {
                packageName: imp.packageName,
                missingDeps: missingDeps.join(', '),
              },
              fix: fixer => {
                return fixer.replaceText(
                  imp.node,
                  `'directive:inline-imports:${imp.packageName}'`,
                );
              },
            });
          }

          return;
        }

        // We skip imports for the package itself
        if (imp.packageName === localPkg.packageJson.name) {
          return;
        }

        const modulePath = path.relative(localPkg.dir, filePath);
        const expectedType = getExpectedDepType(
          localPkg.packageJson,
          imp.packageName,
          modulePath,
        );

        const conflict = findConflict(
          localPkg.packageJson,
          imp.packageName,
          expectedType,
        );

        if (conflict) {
          try {
            const fullImport = imp.path
              ? `${imp.packageName}/${imp.path}`
              : imp.packageName;
            require.resolve(fullImport, {
              paths: [localPkg.dir],
            });
          } catch {
            // If the dependency doesn't resolve then it's likely a type import, ignore
            return;
          }

          const packagePath = path.relative(packages.root.dir, localPkg.dir);
          const packageJsonPath = path.join(packagePath, 'package.json');

          context.report({
            node,
            messageId: conflict.oldDepsField ? 'switch' : 'undeclared',
            data: {
              ...conflict,
              packagePath,
              packageManager,
              dirFlag: getDirFlag(packageManager),
              addFlag: getAddFlagForDepsField(
                conflict.depsField,
                packageManager,
              ),
              packageName: imp.packageName,
              packageJsonPath: packageJsonPath,
            },
            // This fix callback is always executed, regardless of whether linting is run with
            // fixes enabled or not. There is no way to determine if fixes are being applied, so
            // instead our fix will replace the import with a directive that will be picked up
            // on the next run. When ESLint applies fixes all rules are re-run to make sure the fixes
            // applied correctly, which means that these directives will be picked up, executed,
            // and switched back to the original import immediately.
            // This is not true for all editor integrations. For example, VSCode translates there fixes
            // to native editor commands, and does not re-run ESLint. This means that the import directive
            // will end up in source code, and the import directive fix needs to be applied manually too.
            // There is to my knowledge no way around this that doesn't get very hacky, so it will do for now.
            fix: conflict.oldDepsField
              ? undefined
              : fixer => {
                  return fixer.replaceText(
                    imp.node,
                    `'directive:add-import:${conflict.depsField}:${imp.packageName}'`,
                  );
                },
          });
        }
      }),
    };
  },
};
