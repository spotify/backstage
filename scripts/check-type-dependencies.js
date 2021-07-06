#!/usr/bin/env node
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

const fs = require('fs');
const { resolve: resolvePath } = require('path');
// Cba polluting root package.json, we'll have this
// eslint-disable-next-line import/no-extraneous-dependencies
const chalk = require('chalk');

async function main() {
  // This is from lerna, and cba polluting root package.json
  // eslint-disable-next-line import/no-extraneous-dependencies
  const { Project } = require('@lerna/project');
  const project = new Project(resolvePath('.'));
  const packages = await project.getPackages();

  let hadErrors = false;

  for (const pkg of packages) {
    if (!shouldCheckTypes(pkg)) {
      continue;
    }
    const { errors } = await checkTypes(pkg);
    if (errors.length) {
      hadErrors = true;
      console.error(
        `Incorrect type dependencies in ${chalk.yellow(pkg.name)}:`,
      );
      for (const error of errors) {
        if (error.name === 'WrongDepError') {
          console.error(
            `  Move from ${chalk.red(error.from)} to ${chalk.green(
              error.to,
            )}: ${chalk.cyan(error.dep)}`,
          );
        } else if (error.name === 'MissingDepError') {
          console.error(
            `  Missing a type dependency: ${chalk.cyan(error.dep)}`,
          );
        } else {
          console.error(`  Unknown error, ${chalk.red(error)}`);
        }
      }
    }
  }

  if (hadErrors) {
    console.error();
    console.error(
      chalk.red('At least one package had incorrect type dependencies'),
    );

    process.exit(2);
  }
}

function shouldCheckTypes(pkg) {
  return (
    !pkg.private &&
    pkg.get('types') &&
    fs.existsSync(resolvePath(pkg.location, 'dist/index.d.ts'))
  );
}

/**
 * Scan index.d.ts for imports and return errors for any dependency that's
 * missing or incorrect in package.json
 */
function checkTypes(pkg) {
  const typeDecl = fs.readFileSync(
    resolvePath(pkg.location, 'dist/index.d.ts'),
    'utf8',
  );
  const allDeps = (typeDecl.match(/from '.*'/g) || [])
    .map(match => match.replace(/from '(.*)'/, '$1'))
    .filter(n => !n.startsWith('.'));
  const deps = Array.from(new Set(allDeps));

  const errors = [];
  const typeDeps = [];
  for (const dep of deps) {
    try {
      const typeDep = findTypesPackage(dep, pkg);
      if (typeDep) {
        typeDeps.push(typeDep);
      }
    } catch (error) {
      errors.push(error);
    }
  }

  errors.push(...findTypeDepErrors(typeDeps, pkg));

  return { errors };
}

/**
 * Find the package used for types. This assumes that types are working is a package
 * can be resolved, it doesn't do any checking of presence of types inside the dep.
 */
function findTypesPackage(dep, pkg) {
  try {
    require.resolve(`@types/${dep}/package.json`, { paths: [pkg.location] });
    return `@types/${dep}`;
  } catch {
    try {
      require.resolve(dep, { paths: [pkg.location] });
      return undefined;
    } catch {
      try {
        // Some type-only modules don't have a working main field, so try resolving package.json too
        require.resolve(`${dep}/package.json`, { paths: [pkg.location] });
        return undefined;
      } catch {
        try {
          // Finally check if it's just a .d.ts file
          require.resolve(`${dep}.d.ts`, { paths: [pkg.location] });
          return undefined;
        } catch {
          throw mkErr('MissingDepError', `No types for ${dep}`, { dep });
        }
      }
    }
  }
}

/**
 * Figures out what type dependencies are missing, or should be moved between dep types
 */
function findTypeDepErrors(typeDeps, pkg) {
  const devDeps = mkTypeDepSet(pkg.get('devDependencies'));
  const deps = mkTypeDepSet(pkg.get('dependencies'));

  const errors = [];
  for (const typeDep of typeDeps) {
    if (!deps.has(typeDep)) {
      if (devDeps.has(typeDep)) {
        errors.push(
          mkErr('WrongDepError', `Should be dep ${typeDep}`, {
            dep: typeDep,
            from: 'devDependencies',
            to: 'dependencies',
          }),
        );
      } else {
        errors.push(
          mkErr('MissingDepError', `No types for ${typeDep}`, {
            dep: typeDep,
          }),
        );
      }
    } else {
      deps.delete(typeDep);
    }
  }

  for (const dep of deps) {
    errors.push(
      mkErr('WrongDepError', `Should be dev dep ${dep}`, {
        dep,
        from: 'dependencies',
        to: 'devDependencies',
      }),
    );
  }

  return errors;
}

function mkTypeDepSet(deps) {
  const typeDeps = Object.keys(deps || {}).filter(n => n.startsWith('@types/'));
  return new Set(typeDeps);
}

function mkErr(name, msg, extra) {
  const error = new Error(msg);
  error.name = name;
  Object.assign(error, extra);
  return error;
}

main().catch(error => {
  console.error(error.stack || error);
  process.exit(1);
});
