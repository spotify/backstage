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
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { join, resolve, sep } from 'node:path';
import { rollup } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss';
import esbuild from 'rollup-plugin-esbuild';
import { watch } from 'chokidar';
import { discoverActionUiBrowserAssets } from './actionUi';
import type {
  BackendBrowserAsset,
  BackendBrowserAssetCollection,
  BackendBrowserAssetProvider,
} from './types';

const scriptExtensions = ['.js', '.jsx', '.ts', '.tsx'];
const providers: BackendBrowserAssetProvider[] = [
  {
    name: 'action-ui',
    outputPath: 'action-ui',
    discover: discoverActionUiBrowserAssets,
  },
];

function escapeInline(source: string, tag: string) {
  return source.replaceAll(`</${tag}`, `<\\/${tag}`);
}

async function bundleBrowserAsset(
  asset: BackendBrowserAsset,
  targetDir: string,
) {
  const virtualId = `\0backstage-backend-browser-asset:${asset.id}`;
  const packageRequire = createRequire(resolve(targetDir, 'package.json'));
  const react = packageRequire.resolve('react');
  const reactDom = packageRequire.resolve('react-dom/client');
  const bundle = await rollup({
    input: virtualId,
    onwarn(warning, warn) {
      if (warning.code !== 'CIRCULAR_DEPENDENCY') {
        warn(warning);
      }
    },
    plugins: [
      {
        name: 'backstage-backend-browser-asset-entry',
        resolveId(id) {
          return id === virtualId ? id : null;
        },
        load(id) {
          if (id !== virtualId) {
            return null;
          }
          return [
            `import React from ${JSON.stringify(react)};`,
            `import { createRoot } from ${JSON.stringify(reactDom)};`,
            `import { ${asset.exportName} as Component } from ${JSON.stringify(
              asset.entry,
            )};`,
            `const root = document.getElementById('app');`,
            `if (!root) throw new Error('Backend browser asset root not found');`,
            `createRoot(root).render(React.createElement(Component));`,
          ].join('');
        },
      },
      nodeResolve({ browser: true, extensions: scriptExtensions }),
      commonjs({ include: /node_modules/ }),
      json(),
      postcss({ inject: true, minimize: true }),
      esbuild({
        target: 'es2022',
        minify: true,
        jsx: 'automatic',
        define: { 'process.env.NODE_ENV': JSON.stringify('production') },
      }),
    ],
  });
  const generated = await bundle.generate({
    format: 'iife',
    inlineDynamicImports: true,
  });
  await bundle.close();
  const chunks = generated.output.filter(output => output.type === 'chunk');
  if (
    chunks.length !== 1 ||
    generated.output.some(output => output.type === 'asset')
  ) {
    throw new Error(
      `Backend browser asset '${asset.id}' did not produce one self-contained script`,
    );
  }
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${
    asset.id
  }</title></head><body><main id="app"></main><script>${escapeInline(
    chunks[0].code,
    'script',
  )}</script></body></html>`;
}

async function buildCollection(
  collection: BackendBrowserAssetCollection,
  targetDir: string,
) {
  const outputDir = resolve(targetDir, 'dist', collection.outputPath);
  const temporaryDir = resolve(
    targetDir,
    `dist/.browser-assets-${collection.name}-${process.pid}-${Date.now()}`,
  );
  try {
    if (collection.assets.length === 0) {
      await fs.remove(outputDir);
      return 0;
    }
    await fs.ensureDir(temporaryDir);
    const manifest: {
      version: 1;
      resources: Record<string, { path: string; integrity: string }>;
    } = { version: 1, resources: {} };
    for (const asset of collection.assets) {
      const filename = `${asset.id}.html`;
      const html = await bundleBrowserAsset(asset, targetDir);
      await fs.writeFile(join(temporaryDir, filename), html, 'utf8');
      manifest.resources[asset.id] = {
        path: filename,
        integrity: `sha256-${createHash('sha256')
          .update(html)
          .digest('base64')}`,
      };
    }
    await fs.writeJson(join(temporaryDir, 'manifest.json'), manifest, {
      spaces: 2,
    });
    await fs.remove(outputDir);
    await fs.move(temporaryDir, outputDir);
    return collection.assets.length;
  } catch (error) {
    await fs.remove(temporaryDir);
    await fs.remove(outputDir);
    throw error;
  }
}

export async function buildBackendBrowserAssets(options: {
  targetDir: string;
}) {
  const counts = await Promise.all(
    providers.map(async provider => {
      try {
        const assets = await provider.discover(options.targetDir);
        return await buildCollection(
          { ...provider, assets },
          options.targetDir,
        );
      } catch (error) {
        await fs.remove(
          resolve(options.targetDir, 'dist', provider.outputPath),
        );
        throw error;
      }
    }),
  );
  return { count: counts.reduce((total, count) => total + count, 0) };
}

export async function watchBackendBrowserAssets(options: {
  targetDirs: string[];
}) {
  let building = Promise.resolve();
  const rebuild = (targetDir: string) => {
    building = building
      .then(async () => {
        await buildBackendBrowserAssets({ targetDir });
      })
      .catch(error =>
        console.error(
          `Backend browser asset build failed in ${targetDir}:`,
          error,
        ),
      );
  };
  await Promise.all(
    options.targetDirs.map(targetDir =>
      buildBackendBrowserAssets({ targetDir }),
    ),
  );
  const sourceRoots = options.targetDirs.map(targetDir => ({
    targetDir,
    sourceRoot: resolve(targetDir, 'src'),
  }));
  const watcher = watch(
    sourceRoots.map(({ sourceRoot }) => join(sourceRoot, '**/*')),
    { ignoreInitial: true },
  );
  const rebuildChangedTarget = (changedPath: string) => {
    const target = sourceRoots.find(
      ({ sourceRoot }) =>
        changedPath === sourceRoot ||
        changedPath.startsWith(`${sourceRoot}${sep}`),
    );
    if (target) {
      rebuild(target.targetDir);
    }
  };
  watcher
    .on('add', rebuildChangedTarget)
    .on('change', rebuildChangedTarget)
    .on('unlink', rebuildChangedTarget);
  return async () => {
    await watcher.close();
    await building;
  };
}
