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
import { readFile, writeFile, cp } from 'node:fs/promises';
import globby from 'globby';
import { dirname, join as joinPath, relative } from 'node:path';
import crypto from 'node:crypto';
import { YarnLockfile } from '@backstage/cli-node';
import { exists, rm, mkdirp } from 'fs-extra';
import { z } from 'zod/v3';
import { CACHE_DIR, CACHE_FILE } from './constants';

const version = '1';

interface CacheEntry {
  hash: string;
  packageName: string;
  restoreTo: string;
  version: string;
}

const cacheEntrySchema = z.object({
  hash: z.string(),
  packageName: z.string(),
  restoreTo: z.string(),
  version: z.string(),
});

export class PackageDocsCache {
  // A map of package directory to package hash.
  private keyCache: Map<string, string>;
  private readonly lockfile: YarnLockfile;
  // A map of package directory to cache entry.
  private readonly cache: Map<string, CacheEntry>;
  private readonly baseDirectory: string;

  constructor(
    lockfile: YarnLockfile,
    cache: Map<string, CacheEntry>,
    baseDirectory: string,
  ) {
    this.lockfile = lockfile;
    this.cache = cache;
    this.baseDirectory = baseDirectory;
    this.keyCache = new Map();
  }
  static async loadAsync(baseDirectory: string, lockfile: YarnLockfile) {
    const cacheDir = joinPath(baseDirectory, CACHE_DIR);
    await mkdirp(cacheDir);
    const cacheFiles = await globby(`**/${CACHE_FILE}`, {
      cwd: cacheDir,
    });
    const map = new Map<string, CacheEntry>();
    for (const file of cacheFiles) {
      const pkg = dirname(file);
      const cache = await readFile(joinPath(cacheDir, file), 'utf-8');
      try {
        const cacheJson = JSON.parse(cache);
        const parsed = cacheEntrySchema.parse(cacheJson);
        if (parsed.version !== version) {
          console.warn(
            `Skipping cache file ${file} due to version mismatch: ${parsed.version} !== ${version}`,
          );
          continue;
        }
        map.set(pkg, parsed);
      } catch (e) {
        console.error(`Skipping unparsable cache file ${file}: ${e}`);
      }
    }
    return new PackageDocsCache(lockfile, map, baseDirectory);
  }

  async directoryToName(directory: string) {
    const packageJson = await readFile(
      joinPath(this.baseDirectory, directory, 'package.json'),
      'utf-8',
    );
    return JSON.parse(packageJson).name;
  }

  private async toKey(pkg: string) {
    if (this.keyCache.has(pkg)) {
      return this.keyCache.get(pkg)!;
    }
    const name = await this.directoryToName(pkg);
    const result = await globby('src/**', {
      gitignore: true,
      onlyFiles: true,
      cwd: pkg,
    });

    const hash = crypto.createHash('sha1');
    hash.update(version);
    hash.update('\0');

    for (const path of result.sort()) {
      const absPath = joinPath(this.baseDirectory, pkg, path);
      const pathInPackage = joinPath(absPath, path);
      hash.update(pathInPackage);
      hash.update('\0');
      hash.update(await readFile(absPath));
      hash.update('\0');
    }
    hash.update(this.lockfile.getDependencyTreeHash(name));
    hash.update('\0');
    const hashString = hash.digest('hex');
    this.keyCache.set(pkg, hashString);
    return hashString;
  }

  async has(pkg: string) {
    const cache = this.cache.get(pkg);
    if (!cache) {
      return false;
    }
    const hashString = await this.toKey(pkg);
    return cache.hash === hashString;
  }

  async restore(pkg: string) {
    if (!this.has(pkg)) {
      throw new Error(`Cache entry for ${pkg} not found`);
    }
    const cacheEntry = this.cache.get(pkg);
    const restoreTo = cacheEntry!.restoreTo;
    const cacheDir = joinPath(this.baseDirectory, CACHE_DIR, pkg);
    const contentsDir = joinPath(cacheDir, 'contents');

    const targetDir = joinPath(this.baseDirectory, restoreTo);
    await mkdirp(targetDir);
    await cp(contentsDir, targetDir, { recursive: true });
  }

  async write(pkg: string, contentDirectory: string) {
    const cacheDir = joinPath(this.baseDirectory, CACHE_DIR, pkg);
    const contentsDir = joinPath(cacheDir, 'contents');
    if (await exists(contentsDir)) {
      await rm(contentsDir, { recursive: true });
    } else {
      await mkdirp(contentsDir);
    }
    const hashString = await this.toKey(pkg);
    await cp(contentDirectory, contentsDir, { recursive: true });
    const cacheEntry: CacheEntry = {
      hash: hashString,
      packageName: await this.directoryToName(pkg),
      restoreTo: relative(this.baseDirectory, contentDirectory),
      version,
    };
    await writeFile(joinPath(cacheDir, CACHE_FILE), JSON.stringify(cacheEntry));
  }
}
