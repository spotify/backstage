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
import {
  dirname,
  resolve as resolvePath,
  relative as relativePath,
} from 'path';
import { createFilter } from 'rollup-pluginutils';
import { Plugin, InputOptions, OutputChunk } from 'rollup';

type ForwardFileImportsOptions = {
  include: Array<string | RegExp> | string | RegExp | null;
  exclude?: Array<string | RegExp> | string | RegExp | null;
};

/**
 * This rollup plugin leaves all encountered asset imports as-is, but
 * copies the imported files into the output directory.
 *
 * For example `import ImageUrl from './my-image.png'` inside `src/MyComponent` will
 * cause `src/MyComponent/my-image.png` to be copied to the output directory at the
 * path `dist/MyComponent/my-image.png`. The import itself will stay, but be resolved,
 * resulting in something like `import ImageUrl from './MyComponent/my-image.png'`
 */
export function forwardFileImports(options: ForwardFileImportsOptions): Plugin {
  const filter = createFilter(options.include, options.exclude);

  // We collect the absolute paths to all files we want to bundle into the
  // output dir here. Resolving to relative paths in the output dir happens later.
  const exportedFiles = new Set<string>();

  // We keep track of output directories that we've already copied files
  // into, so that we don't duplicate that work
  const generatedFor = new Set<string>();

  return {
    name: 'forward-file-imports',
    async generateBundle(outputOptions, bundle, isWrite) {
      if (!isWrite) {
        return;
      }

      const dir = outputOptions.dir || dirname(outputOptions.file!);
      if (generatedFor.has(dir)) {
        return;
      }

      for (const output of Object.values(bundle)) {
        if (output.type !== 'chunk') {
          continue;
        }
        const chunk = output as OutputChunk;

        // This'll be an absolute path pointing to the initial index file of the
        // build, and we use it to find the location of the `src` dir
        if (!chunk.facadeModuleId) {
          continue;
        }
        generatedFor.add(dir);

        // We're assuming that the index file is at the root of the source dir, and
        // that all assets exist within that dir.
        const srcRoot = dirname(chunk.facadeModuleId);

        // Copy all the files we found into the dist dir
        await Promise.all(
          Array.from(exportedFiles).map(async exportedFile => {
            const outputPath = relativePath(srcRoot, exportedFile);
            const targetFile = resolvePath(dir, outputPath);

            await fs.ensureDir(dirname(targetFile));
            await fs.copyFile(exportedFile, targetFile);
          }),
        );
        return;
      }
    },
    options(inputOptions) {
      const origExternal = inputOptions.external;

      // We decorate any existing `external` option with our own way of determining
      // if a module should be external. The can't use `resolveId`, since asset files
      // aren't passed there, might be some better way to do this though.
      const external: InputOptions['external'] = (id, importer, isResolved) => {
        // Call to inner external option
        if (
          typeof origExternal === 'function' &&
          origExternal(id, importer, isResolved)
        ) {
          return true;
        }

        if (Array.isArray(origExternal) && origExternal.includes(id)) {
          return true;
        }

        // The piece that we're adding
        if (!filter(id)) {
          return false;
        }

        // Sanity check, dunno if this can happen
        if (!importer) {
          throw new Error(`Unknown importer of file module ${id}`);
        }

        // Resolve relative imports to the full file URL, for deduping and copying later
        const fullId = isResolved ? id : resolvePath(dirname(importer), id);
        exportedFiles.add(fullId);

        // Treating this module as external from here, meaning rollup won't try to
        // put it in the output bundle, but still keep track of the relative imports
        // as needed in the output code.
        return true;
      };

      return { ...inputOptions, external };
    },
  };
}
