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

import crypto from 'node:crypto';
import { posix as posixPath } from 'node:path';
import fs from 'fs-extra';
import { parse as parseYaml } from 'yaml';
import type { LockfileDiff } from '@backstage/cli-node';
import { Lockfile, LockfileEntry } from '../Lockfile';
import { ParseLockfileOptions } from '../PackageManager';

const DEPENDENCY_FIELDS = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
] as const;

/**
 * A resolved package or workspace package that entries point to. Packages are
 * keyed by their package ID, `name@version`, and workspace packages by
 * `importer:<dir>`.
 */
type PnpmNode = {
  version: string;
  integrity?: string;
  dependencies: Set<string>;
};

type PnpmEntry = LockfileEntry & {
  node?: string;
};

/**
 * A pnpm `pnpm-lock.yaml` lockfile.
 *
 * @remarks
 *
 * Lockfile version 9 is supported, which pnpm 9 and later write. The file is
 * read with the libraries that pnpm itself uses, which also handle the
 * separate document that pnpm writes when `package.json` pins its version.
 *
 * The ranges of direct dependencies are their specifiers, while transitive
 * packages use their resolved version as the range. Dependencies on other
 * workspace packages have a `link:` version with the directory of the linked
 * package relative to the workspace root. Workspace packages themselves are
 * listed under their name with a `workspace:<dir>` range.
 *
 * pnpm lists workspace packages by directory, so their names come from the
 * `readWorkspacePackageJson` option, which must read from the same source as
 * the lockfile. Without it, workspace packages are listed under their
 * directory instead, and the lockfile can't be diffed.
 */
export class PnpmLockfile implements Lockfile {
  /** Loads a lockfile from a file path. */
  static async load(
    path: string,
    options?: ParseLockfileOptions,
  ): Promise<PnpmLockfile> {
    const content = await fs.readFile(path, 'utf8');
    return PnpmLockfile.parse(content, options);
  }

  /** Parses lockfile contents. */
  static async parse(
    content: string,
    options?: ParseLockfileOptions,
  ): Promise<PnpmLockfile> {
    // These libraries are only published as ES modules
    const { convertToLockfileObject, extractMainDocument } = await import(
      '@pnpm/lockfile.fs'
    );
    const {
      parse: parseDepPath,
      refToRelative,
      removeSuffix,
    } = await import('@pnpm/deps.path');

    let lockfileFile;
    try {
      lockfileFile = parseYaml(
        extractMainDocument(content.replace(/^\uFEFF/, '')),
      );
    } catch (error) {
      throw new Error(`Failed pnpm-lock.yaml parse, ${error}`);
    }
    if (!lockfileFile || typeof lockfileFile !== 'object') {
      throw new Error('Failed pnpm-lock.yaml parse, the lockfile is empty');
    }
    const lockfileVersion = String(lockfileFile.lockfileVersion);
    if (!/^9(\.|$)/.test(lockfileVersion)) {
      throw new Error(
        `Unsupported pnpm-lock.yaml version '${lockfileVersion}', only version 9 lockfiles are supported`,
      );
    }
    const lockfile = convertToLockfileObject(lockfileFile);

    const nodes = new Map<string, PnpmNode>();
    const entries = new Map<string, PnpmEntry[]>();

    const addEntry = (name: string, entry: PnpmEntry) => {
      let nameEntries = entries.get(name);
      if (!nameEntries) {
        nameEntries = [];
        entries.set(name, nameEntries);
      }
      const exists = nameEntries.some(
        e => e.range === entry.range && e.version === entry.version,
      );
      if (!exists) {
        nameEntries.push(entry);
      }
    };

    // Resolves a dependency reference, such as `1.0.0(peer@2.0.0)`,
    // `alias@1.0.0`, or `link:../dir`, to the node that it points to.
    const resolveReference = (
      importerDir: string,
      name: string,
      reference: string,
    ): { version: string; node?: string } => {
      // Links are relative to the importer, but are normalized to be relative
      // to the workspace root, so that links to the same package from
      // importers at different depths are the same version
      if (reference.startsWith('link:')) {
        const linkPath = reference.slice('link:'.length);
        const linkedDir = posixPath.isAbsolute(linkPath)
          ? posixPath.normalize(linkPath)
          : posixPath.normalize(posixPath.join(importerDir, linkPath));
        return {
          version: `link:${linkedDir}`,
          node:
            linkedDir in lockfile.importers
              ? `importer:${linkedDir}`
              : undefined,
        };
      }
      const depPath = refToRelative(reference, name);
      if (!depPath) {
        return { version: reference };
      }
      const packageId = removeSuffix(depPath);
      return {
        version: nodes.get(packageId)?.version ?? reference,
        node: packageId,
      };
    };

    // Packages and their dependencies. Variants of a package with different
    // peer dependencies are merged into a single node.
    const packageNames = new Map<string, string>();
    for (const [depPath, pkg] of Object.entries(lockfile.packages ?? {})) {
      const packageId = removeSuffix(depPath);
      const parsed = parseDepPath(packageId);
      if (!parsed.name) {
        throw new Error(`Failed to parse pnpm-lock.yaml package '${depPath}'`);
      }
      packageNames.set(packageId, parsed.name);

      let node = nodes.get(packageId);
      if (!node) {
        const resolution = pkg.resolution as { integrity?: string } | undefined;
        node = {
          version: parsed.version ?? parsed.nonSemverVersion ?? packageId,
          integrity: resolution?.integrity,
          dependencies: new Set(Object.keys(pkg.peerDependencies ?? {})),
        };
        nodes.set(packageId, node);
      }
      for (const depName of Object.keys(pkg.dependencies ?? {})) {
        node.dependencies.add(depName);
      }
      for (const depName of Object.keys(pkg.optionalDependencies ?? {})) {
        node.dependencies.add(depName);
      }
    }

    // Workspace packages and their direct dependencies
    let hasUnnamedWorkspacePackages = false;
    for (const [dir, importer] of Object.entries(lockfile.importers)) {
      const nodeKey = `importer:${dir}`;
      const node: PnpmNode = {
        version: `link:${dir}`,
        dependencies: new Set(),
      };
      nodes.set(nodeKey, node);

      for (const field of DEPENDENCY_FIELDS) {
        for (const [name, reference] of Object.entries(importer[field] ?? {})) {
          node.dependencies.add(name);

          const specifier = importer.specifiers[name] ?? reference;
          const { version, node: depNode } = resolveReference(
            dir,
            name,
            reference,
          );
          addEntry(name, {
            range: specifier.replace(/^npm:/, ''),
            version,
            node: depNode,
          });
        }
      }

      const packageJson = await options?.readWorkspacePackageJson?.(dir);
      if (!packageJson) {
        // Without a name the package is listed under its directory, which
        // nothing else refers to it by
        hasUnnamedWorkspacePackages = true;
        addEntry(dir, {
          range: `workspace:${dir}`,
          version: node.version,
          node: nodeKey,
        });
      } else if (packageJson.name) {
        addEntry(packageJson.name, {
          range: `workspace:${dir}`,
          version: node.version,
          node: nodeKey,
        });
      }
    }

    // Transitive packages, using the resolved version as the range
    for (const [packageId, name] of packageNames) {
      const isDirect = entries.get(name)?.some(e => e.node === packageId);
      if (!isDirect) {
        const { version } = nodes.get(packageId)!;
        addEntry(name, { range: version, version, node: packageId });
      }
    }

    for (const nameEntries of entries.values()) {
      nameEntries.sort(
        (a, b) =>
          compareStrings(a.range, b.range) ||
          compareStrings(a.version, b.version),
      );
    }

    return new PnpmLockfile(entries, nodes, hasUnnamedWorkspacePackages);
  }

  private constructor(
    private readonly entries: Map<string, PnpmEntry[]>,
    private readonly nodes: Map<string, PnpmNode>,
    private readonly hasUnnamedWorkspacePackages: boolean,
  ) {}

  /** {@inheritDoc Lockfile.get} */
  get(name: string): LockfileEntry[] | undefined {
    return this.entries
      .get(name)
      ?.map(({ range, version }) => ({ range, version }));
  }

  /** {@inheritDoc Lockfile.keys} */
  keys(): IterableIterator<string> {
    return this.entries.keys();
  }

  /** {@inheritDoc Lockfile.createSimplifiedDependencyGraph} */
  createSimplifiedDependencyGraph(): Map<string, Set<string>> {
    const graph = new Map<string, Set<string>>();

    for (const [name, entries] of this.entries) {
      const dependencies = new Set(
        entries.flatMap(e => [...(this.getNode(e)?.dependencies ?? [])]),
      );
      graph.set(name, dependencies);
    }

    return graph;
  }

  /**
   * Diff with another lockfile, returning entries that have been added,
   * changed, and removed compared to the other lockfile.
   *
   * @remarks
   *
   * Both lockfiles must be pnpm lockfiles with named workspace packages, since
   * changes can otherwise not be attributed to the right packages.
   */
  diff(otherLockfile: Lockfile): LockfileDiff {
    if (!(otherLockfile instanceof PnpmLockfile)) {
      throw new Error(
        'A pnpm-lock.yaml file can only be diffed with another one',
      );
    }
    if (
      this.hasUnnamedWorkspacePackages ||
      otherLockfile.hasUnnamedWorkspacePackages
    ) {
      throw new Error(
        'The workspace packages in pnpm-lock.yaml could not be named, so the changes cannot be attributed to them',
      );
    }

    const diff = {
      added: new Array<{ name: string; range: string }>(),
      changed: new Array<{ name: string; range: string }>(),
      removed: new Array<{ name: string; range: string }>(),
    };

    // Keeps track of packages that only exist in this lockfile
    const remainingOldNames = new Set(this.entries.keys());

    for (const [name, otherEntries] of otherLockfile.entries) {
      remainingOldNames.delete(name);

      const thisEntries = this.entries.get(name);
      // A package that only exists in the other lockfile has had all of its
      // entries removed
      if (!thisEntries) {
        diff.removed.push(...otherEntries.map(e => ({ name, range: e.range })));
        continue;
      }

      const remainingOldRanges = new Set(thisEntries.map(e => e.range));

      for (const otherEntry of otherEntries) {
        remainingOldRanges.delete(otherEntry.range);

        const thisEntry = thisEntries.find(e => e.range === otherEntry.range);
        if (!thisEntry) {
          diff.removed.push({ name, range: otherEntry.range });
          continue;
        }

        const thisCheck =
          this.getNode(thisEntry)?.integrity ?? thisEntry.version;
        const otherCheck =
          otherLockfile.getNode(otherEntry)?.integrity ?? otherEntry.version;
        if (thisCheck !== otherCheck) {
          diff.changed.push({ name, range: otherEntry.range });
        }
      }

      for (const thisRange of remainingOldRanges) {
        diff.added.push({ name, range: thisRange });
      }
    }

    for (const name of remainingOldNames) {
      const entries = this.entries.get(name) ?? [];
      diff.added.push(...entries.map(e => ({ name, range: e.range })));
    }

    return diff;
  }

  /** {@inheritDoc Lockfile.getDependencyTreeHash} */
  getDependencyTreeHash(startName: string): string {
    if (!this.entries.has(startName)) {
      throw new Error(`Package '${startName}' not found in lockfile`);
    }

    const hash = crypto.createHash('sha1');

    const queue = [startName];
    const seen = new Set<string>();

    while (queue.length > 0) {
      const name = queue.pop()!;

      if (seen.has(name)) {
        continue;
      }
      seen.add(name);

      const entries = this.entries.get(name);
      if (!entries) {
        continue; // In case of missing optional peer dependencies
      }

      hash.update(`pkg:${name}`);
      hash.update('\0');

      const deps = new Array<string>();
      for (const entry of entries) {
        hash.update(entry.version);

        const node = this.getNode(entry);
        if (!node) {
          continue;
        }

        if (node.integrity) {
          hash.update('#');
          hash.update(node.integrity);
        }

        hash.update(' ');

        deps.push(...node.dependencies);
      }

      queue.push(...new Set(deps));
    }

    return hash.digest('hex');
  }

  private getNode(entry: PnpmEntry): PnpmNode | undefined {
    return entry.node ? this.nodes.get(entry.node) : undefined;
  }
}

function compareStrings(a: string, b: string): number {
  if (a < b) {
    return -1;
  }
  return a > b ? 1 : 0;
}
