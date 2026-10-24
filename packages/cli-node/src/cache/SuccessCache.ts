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
import { resolve as resolvePath } from 'node:path';
import { targetPaths } from '@backstage/cli-common';

const DEFAULT_CACHE_BASE_PATH = 'node_modules/.cache/backstage-cli';

const CACHE_MAX_AGE_MS = 7 * 24 * 3600_000;

/**
 * A file-system-based cache that tracks successful operations by storing
 * timestamped marker files.
 *
 * @public
 */
export class SuccessCache {
  readonly #path: string;

  /**
   * Trim any occurrences of the workspace root path from the input string. This
   * is useful to ensure stable hashes that don't vary based on the workspace
   * location.
   */
  static trimPaths(input: string) {
    return input.replaceAll(targetPaths.workspaceRootDir, '');
  }

  static create(options: { name: string; basePath?: string }): SuccessCache {
    return new SuccessCache(options);
  }

  private constructor(options: { name: string; basePath?: string }) {
    this.#path = resolvePath(
      options.basePath ?? DEFAULT_CACHE_BASE_PATH,
      options.name,
    );
  }

  async read(): Promise<Set<string>> {
    try {
      const stat = await fs.stat(this.#path);
      if (!stat.isDirectory()) {
        await fs.rm(this.#path);
        return new Set();
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        return new Set();
      }
      throw error;
    }

    const items = await fs.readdir(this.#path);

    const returned = new Set<string>();
    const removed = new Set<string>();

    const now = Date.now();

    for (const item of items) {
      const split = item.split('_');
      if (split.length !== 2) {
        removed.add(item);
        continue;
      }
      const createdAt = parseInt(split[0], 10);
      if (Number.isNaN(createdAt) || now - createdAt > CACHE_MAX_AGE_MS) {
        removed.add(item);
      } else {
        returned.add(split[1]);
      }
    }

    for (const item of removed) {
      await fs.unlink(resolvePath(this.#path, item));
    }

    return returned;
  }

  async write(newEntries: Iterable<string>): Promise<void> {
    const now = Date.now();

    await fs.ensureDir(this.#path);

    const existingItems = await fs.readdir(this.#path);

    const empty = Buffer.alloc(0);
    for (const key of newEntries) {
      const trimmedItems = existingItems.filter(item =>
        item.endsWith(`_${key}`),
      );
      for (const trimmedItem of trimmedItems) {
        await fs.unlink(resolvePath(this.#path, trimmedItem));
      }

      await fs.writeFile(resolvePath(this.#path, `${now}_${key}`), empty);
    }
  }
}
