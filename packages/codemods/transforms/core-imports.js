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

const addImports = require('jscodeshift-add-imports');
const { resolve: resolvePath } = require('path');
const fs = require('fs');

function findExports(packageName) {
  const packagePath = require.resolve(`${packageName}/package.json`);
  const typesPath = resolvePath(packagePath, '../dist/index.d.ts');
  const content = fs.readFileSync(typesPath, 'utf8');

  // For each export statement in the type declarations we grab the exported symbol names
  return content
    .split(/export \{ (.*) \}/)
    .filter((_, i) => i % 2)
    .flatMap(symbolsStr =>
      symbolsStr
        .split(', ')
        .map(exported => exported.match(/.* as (.*)/)?.[1] || exported),
    );
}

const symbolTable = {
  '@backstage/core-app-api': findExports('@backstage/core-app-api'),
  '@backstage/core-components': findExports('@backstage/core-components'),
  '@backstage/core-plugin-api': findExports('@backstage/core-plugin-api'),
};

const reverseSymbolTable = Object.entries(symbolTable).reduce(
  (table, [pkg, symbols]) => {
    for (const symbol of symbols) {
      table[symbol] = pkg;
    }
    return table;
  },
  {},
);

module.exports = (file, /** @type {import('jscodeshift').API} */ api) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  // Grab the file comment from the first node in case the import gets removed
  const firstNodeComment = root.find(j.Program).get('body', 0).node.comments;

  // Find all import statements of @backstage/core
  const imports = root.find(j.ImportDeclaration, {
    source: {
      value: '@backstage/core',
    },
  });

  if (imports.size === 0) {
    return undefined;
  }

  // Check what style we're using for the imports, ' or "
  const useSingleQuote =
    root.find(j.ImportDeclaration).nodes()[0]?.source.extra.raw[0] === "'";

  // Then loop through all the import statement and collects each imported symbol
  const importedSymbols = imports.nodes().flatMap(node =>
    (node.specifiers || []).flatMap(specifier => ({
      name: specifier.imported.name, // The symbol we're importing
      local: specifier.local.name, // The local name, usually this is the same
    })),
  );

  // Now that we gathered all the imports we want to add, we get rid of the old one
  imports.remove();

  // The convert the imports into actual import statements
  const newImportStatements = importedSymbols.map(({ name, local }) => {
    const targetPackage = reverseSymbolTable[name];
    if (!targetPackage) {
      throw new Error(`No target package found for import of ${name}`);
    }

    return j.importDeclaration(
      [j.importSpecifier(j.identifier(name), j.identifier(local))],
      j.literal(targetPackage),
    );
  });

  // And add the new imports. `addImports` will take care of resolving duplicates
  addImports(root, newImportStatements);

  // Restore the initial file comment in case it got removed
  root.find(j.Program).get('body', 0).node.comments = firstNodeComment;

  return root.toSource({
    quote: useSingleQuote ? 'single' : 'double',
  });
};
