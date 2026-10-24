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
import { parseAllDocuments } from 'yaml';

// Matches `name@version` and `@scope/name@version`
const PACKAGE_KEY_PATTERN = /^(@[^/@]+\/[^/@]+|[^/@]+)@(.+)$/;

type PnpmLockfileData = {
  lockfileVersion?: string | number;
  packages?: Record<string, unknown>;
};

type LockfileQueryEntry = {
  version: string;
};

/**
 * A minimal reader of `pnpm-lock.yaml` files that only provides the names and
 * versions of the resolved packages.
 */
export class PnpmLockfile {
  static async load(path: string) {
    const lockfileContents = await fs.readFile(path, 'utf8');

    let documents;
    try {
      documents = parseAllDocuments(lockfileContents);
    } catch (err) {
      throw new Error(`Failed pnpm-lock.yaml parse with ${err}`);
    }

    // When pnpm is pinned through the packageManager field, the lockfile is
    // written as multiple YAML documents, where the last one is the project
    // lockfile.
    const document = documents[documents.length - 1];
    if (!document || document.errors.length > 0) {
      throw new Error(
        `Failed pnpm-lock.yaml parse with ${
          document?.errors[0] ?? 'empty lockfile'
        }`,
      );
    }

    const data = (document.toJS() ?? {}) as PnpmLockfileData;
    if (!/^9(\.|$)/.test(String(data.lockfileVersion))) {
      throw new Error(
        `Unsupported pnpm lockfile version '${data.lockfileVersion}', only version 9 lockfiles are supported`,
      );
    }

    const packages = new Map<string, LockfileQueryEntry[]>();

    for (const key of Object.keys(data.packages ?? {})) {
      const [, name, version] = PACKAGE_KEY_PATTERN.exec(key) ?? [];
      if (!name) {
        throw new Error(`Failed to parse pnpm-lock.yaml entry '${key}'`);
      }

      let queries = packages.get(name);
      if (!queries) {
        queries = [];
        packages.set(name, queries);
      }
      queries.push({ version });
    }

    return new PnpmLockfile(packages);
  }

  private constructor(
    private readonly packages: Map<string, LockfileQueryEntry[]>,
  ) {}

  /** Get the entries for a single package in the lockfile */
  get(name: string): LockfileQueryEntry[] | undefined {
    return this.packages.get(name);
  }

  /** Returns the name of all packages available in the lockfile */
  keys(): IterableIterator<string> {
    return this.packages.keys();
  }
}
