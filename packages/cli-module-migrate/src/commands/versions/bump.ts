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
import { BACKSTAGE_JSON, run, targetPaths } from '@backstage/cli-common';

import { env } from 'node:process';
import fs from 'fs-extra';
import chalk from 'chalk';
import { minimatch } from 'minimatch';
import semver from 'semver';
import { cli } from 'cleye';
import { isError, NotFoundError } from '@backstage/errors';
import { resolve as resolvePath } from 'node:path';

import {
  hasBackstageYarnPlugin,
  Lockfile,
  runConcurrentTasks,
} from '@backstage/cli-node';
import {
  fetchPackageInfo,
  mapDependencies,
  YarnInfoInspectData,
} from '../../lib/versioning/packages';
import {
  getManifestByReleaseLine,
  getManifestByVersion,
  ReleaseManifest,
} from '@backstage/release-manifests';
import { migrateMovedPackages } from './migrate';
import { runYarnInstall } from '../../lib/utils';
import type { CliCommandContext } from '@backstage/cli-node';

const DEP_TYPES = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
];

const DEFAULT_PATTERN_GLOB = '@backstage/*';

type PkgVersionInfo = {
  range: string;
  target: string;
  name: string;
  location: string;
};

function extendsDefaultPattern(pattern: string): boolean {
  if (!pattern.endsWith('/*')) {
    return false;
  }

  return minimatch('@backstage/', pattern.slice(0, -1));
}

export default async ({ args, info }: CliCommandContext) => {
  const {
    flags: { pattern: patternFlag, release, skipInstall, skipMigrate },
  } = cli(
    {
      name: info.usage,
      booleanFlagNegation: true,
      flags: {
        pattern: {
          type: String,
          description: 'Override glob for matching packages to upgrade',
        },
        release: {
          type: String,
          description: 'Bump to a specific Backstage release line or version',
          default: 'main',
        },
        skipInstall: {
          type: Boolean,
          description: 'Skips yarn install step',
        },
        skipMigrate: {
          type: Boolean,
          description: 'Skips migration of any moved packages',
        },
      },
    },
    undefined,
    args,
  );

  const lockfilePath = targetPaths.resolveWorkspaceRoot('yarn.lock');
  const lockfile = await Lockfile.load(lockfilePath);
  const yarnPluginEnabled = await hasBackstageYarnPlugin();

  let pattern = patternFlag;

  if (!pattern) {
    console.log(`Using default pattern glob ${DEFAULT_PATTERN_GLOB}`);
    pattern = DEFAULT_PATTERN_GLOB;
  } else if (pattern === '*') {
    throw new Error(`Rejected pattern '*', please use a more specific pattern`);
  } else {
    console.log(`Using custom pattern glob ${pattern}`);
  }

  let findTargetVersion: (name: string) => Promise<string>;
  let releaseManifest: ReleaseManifest;
  if (env.BACKSTAGE_MANIFEST_FILE) {
    // Use specific manifest file if provided
    releaseManifest = await fs.readJson(env.BACKSTAGE_MANIFEST_FILE);
    findTargetVersion = createStrictVersionFinder({
      releaseManifest,
    });
  } else if (semver.valid(release)) {
    // Specific release specified. Be strict when resolving versions
    releaseManifest = await getManifestByVersion({ version: release! });
    findTargetVersion = createStrictVersionFinder({
      releaseManifest,
    });
  } else {
    // Release line specified. Be lenient when resolving versions.
    if (release === 'next') {
      const next = await getManifestByReleaseLine({
        releaseLine: 'next',
        versionsBaseUrl: env.BACKSTAGE_VERSIONS_BASE_URL,
      });
      const main = await getManifestByReleaseLine({
        releaseLine: 'main',
        versionsBaseUrl: env.BACKSTAGE_VERSIONS_BASE_URL,
      });
      // Prefer manifest with the latest release version
      releaseManifest = semver.gt(next.releaseVersion, main.releaseVersion)
        ? next
        : main;
    } else {
      releaseManifest = await getManifestByReleaseLine({
        releaseLine: release!,
        versionsBaseUrl: env.BACKSTAGE_VERSIONS_BASE_URL,
      });
    }
    findTargetVersion = createVersionFinder({
      releaseLine: release,
      releaseManifest,
    });
  }

  if (yarnPluginEnabled) {
    console.log();
    console.log(
      `Updating yarn plugin to v${releaseManifest.releaseVersion}...`,
    );
    console.log();

    const yarnPluginUrl = env.BACKSTAGE_VERSIONS_BASE_URL
      ? `${env.BACKSTAGE_VERSIONS_BASE_URL}/v1/releases/${releaseManifest.releaseVersion}/yarn-plugin`
      : `https://versions.backstage.io/v1/releases/${releaseManifest.releaseVersion}/yarn-plugin`;

    await run(['yarn', 'plugin', 'import', yarnPluginUrl]).waitForExit();
    console.log();
  }

  // First we discover all Backstage dependencies within our own repo
  const dependencyMap = await mapDependencies(targetPaths.dir, pattern);

  // Next check with the package registry to see which dependency ranges we need to bump
  const versionBumps = new Map<string, PkgVersionInfo[]>();

  await runConcurrentTasks({
    concurrencyFactor: 4,
    items: dependencyMap.entries(),
    async worker([name, pkgs]) {
      let target: string;
      try {
        target = await findTargetVersion(name);
      } catch (error) {
        if (isError(error) && error.name === 'NotFoundError') {
          console.log(`Package info not found, ignoring package ${name}`);
          return;
        }
        throw error;
      }

      for (const pkg of pkgs) {
        versionBumps.set(
          pkg.name,
          (versionBumps.get(pkg.name) ?? []).concat({
            name,
            location: pkg.location,
            range: `^${target}`, // TODO(Rugvip): Option to use something else than ^?
            target,
          }),
        );
      }
    },
  });

  // Write all discovered version bumps to package.json in this repo
  if (versionBumps.size === 0) {
    console.log(chalk.green('All Backstage packages are up to date!'));
  } else {
    console.log(chalk.yellow('Some packages are outdated, updating'));
    console.log();

    const breakingUpdates = new Map<string, { from: string; to: string }>();
    await runConcurrentTasks({
      concurrencyFactor: 4,
      items: versionBumps.entries(),
      async worker([name, deps]) {
        const pkgPath = resolvePath(deps[0].location, 'package.json');
        const pkgJson = await fs.readJson(pkgPath);

        for (const dep of deps) {
          console.log(
            `${chalk.cyan('bumping')} ${dep.name} in ${chalk.cyan(
              name,
            )} to ${chalk.yellow(dep.range)}`,
          );

          for (const depType of DEP_TYPES) {
            if (depType in pkgJson && dep.name in pkgJson[depType]) {
              const oldRange = pkgJson[depType][dep.name];

              // backstage:^ are written to the lockfile as
              // backstage:<backstage-version>, so that updates to
              // backstage.json can be detected during yarn install. In order to
              // locate the corresponding lockfile entry for "backstage:^"
              // versions, we need to perform the same transformation.
              const oldLockfileRange = await asLockfileVersion(oldRange);

              const useBackstageRange =
                yarnPluginEnabled &&
                // Only use backstage:^ versions if the package is present in
                // the manifest for the release we're bumping to.
                releaseManifest.packages.find(
                  ({ name: manifestPackageName }) =>
                    dep.name === manifestPackageName,
                ) &&
                // Don't use backstage:^ versions for peerDependencies; they only
                // support npm and workspace: versions.
                depType !== 'peerDependencies';

              const newRange = useBackstageRange ? 'backstage:^' : dep.range;

              pkgJson[depType][dep.name] = newRange;

              // Check if the update was at least a pre-v1 minor or post-v1 major release
              const lockfileEntry = lockfile
                .get(dep.name)
                ?.find(entry => entry.range === oldLockfileRange);
              if (lockfileEntry) {
                const from = lockfileEntry.version;
                const to = dep.target;
                if (!semver.satisfies(to, `^${from}`)) {
                  breakingUpdates.set(dep.name, { from, to });
                }
              }
            }
          }
        }

        await fs.writeJson(pkgPath, pkgJson, { spaces: 2 });
      },
    });

    console.log();

    // Do not update backstage.json when default pattern is not covered
    if (extendsDefaultPattern(pattern)) {
      await bumpBackstageJsonVersion(
        releaseManifest.releaseVersion,
        yarnPluginEnabled,
      );
    } else {
      console.log(
        chalk.yellow(
          `Skipping backstage.json update as custom pattern is used`,
        ),
      );
    }

    if (!skipInstall) {
      await runYarnInstall();
    } else {
      console.log();

      console.log(chalk.yellow(`Skipping yarn install`));
    }

    if (!skipMigrate) {
      console.log();

      const changed = await migrateMovedPackages({
        pattern: patternFlag,
      });

      if (changed && !skipInstall) {
        await runYarnInstall();
      }
    }

    if (breakingUpdates.size > 0) {
      console.log();
      console.log(
        chalk.yellow('⚠️  The following packages may have breaking changes:'),
      );
      console.log();

      for (const [name, { from, to }] of Array.from(
        breakingUpdates.entries(),
      ).sort()) {
        console.log(
          `  ${chalk.yellow(name)} : ${chalk.yellow(from)} ~> ${chalk.yellow(
            to,
          )}`,
        );

        let path;
        if (name.startsWith('@backstage/plugin-')) {
          path = `plugins/${name.replace('@backstage/plugin-', '')}`;
        } else if (name.startsWith('@backstage/')) {
          path = `packages/${name.replace('@backstage/', '')}`;
        }
        if (path) {
          // TODO(Rugvip): Grab these URLs and paths from package.json, possibly verify existence
          //               Possibly invent new "changelog" field in package.json or some sh*t.
          console.log(
            `    https://github.com/backstage/backstage/blob/master/${path}/CHANGELOG.md`,
          );
        }
        console.log();
      }
    } else {
      console.log();
    }

    if (yarnPluginEnabled) {
      console.log();
      console.log(
        chalk.blue(
          `${chalk.bold(
            'NOTE',
          )}: this bump used backstage:^ versions in package.json files, since the Backstage ` +
            `yarn plugin was detected in the repository. To migrate back to explicit npm versions, ` +
            `remove the plugin by running "yarn plugin remove @yarnpkg/plugin-backstage", then ` +
            `repeat this command.`,
        ),
      );
      console.log();
    }

    console.log(chalk.green('Version bump complete!'));
  }

  console.log();
};

export function createStrictVersionFinder(options: {
  releaseManifest: ReleaseManifest;
}) {
  const releasePackages = new Map(
    options.releaseManifest.packages.map(p => [p.name, p.version]),
  );
  return async function findTargetVersion(name: string) {
    console.log(`Checking for updates of ${name}`);
    const manifestVersion = releasePackages.get(name);
    if (manifestVersion) {
      return manifestVersion;
    }
    throw new NotFoundError(`Package ${name} not found in release manifest`);
  };
}

export function createVersionFinder(options: {
  releaseLine?: string;
  packageInfoFetcher?: () => Promise<YarnInfoInspectData>;
  releaseManifest?: ReleaseManifest;
}) {
  const {
    releaseLine = 'latest',
    packageInfoFetcher = fetchPackageInfo,
    releaseManifest,
  } = options;
  // The main release line is just an alias for latest
  const distTag = releaseLine === 'main' ? 'latest' : releaseLine;
  const found = new Map<string, string>();
  const releasePackages = new Map(
    releaseManifest?.packages.map(p => [p.name, p.version]),
  );
  return async function findTargetVersion(name: string) {
    const existing = found.get(name);
    if (existing) {
      return existing;
    }

    console.log(`Checking for updates of ${name}`);
    const manifestVersion = releasePackages.get(name);
    if (manifestVersion) {
      return manifestVersion;
    }

    const info = await packageInfoFetcher(name);
    const latestVersion = info['dist-tags'].latest;
    if (!latestVersion) {
      throw new Error(`No target 'latest' version found for ${name}`);
    }

    const taggedVersion = info['dist-tags'][distTag];
    if (distTag === 'latest' || !taggedVersion) {
      found.set(name, latestVersion);
      return latestVersion;
    }

    const latestVersionDateStr = info.time[latestVersion];
    const taggedVersionDateStr = info.time[taggedVersion];
    if (!latestVersionDateStr) {
      throw new Error(
        `No time available for version '${latestVersion}' of ${name}`,
      );
    }
    if (!taggedVersionDateStr) {
      throw new Error(
        `No time available for version '${taggedVersion}' of ${name}`,
      );
    }

    const latestVersionRelease = new Date(latestVersionDateStr).getTime();
    const taggedVersionRelease = new Date(taggedVersionDateStr).getTime();
    if (latestVersionRelease > taggedVersionRelease) {
      // Prefer latest version if it's newer.
      found.set(name, latestVersion);
      return latestVersion;
    }

    found.set(name, taggedVersion);
    return taggedVersion;
  };
}

function getBackstageJsonPath() {
  return targetPaths.backstageJsonPath;
}

async function getBackstageJson() {
  const backstageJsonPath = getBackstageJsonPath();
  return fs.readJSON(backstageJsonPath).catch(e => {
    if (e.code === 'ENOENT') {
      // gracefully continue in case the file doesn't exist
      return;
    }
    throw e;
  });
}

export async function bumpBackstageJsonVersion(
  version: string,
  useYarnPlugin?: boolean,
) {
  const backstageJson = await getBackstageJson();
  const prevVersion = backstageJson?.version;

  if (prevVersion === version) {
    return;
  }

  const { yellow, cyan, green } = chalk;
  if (prevVersion) {
    const from = encodeURIComponent(prevVersion);
    const to = encodeURIComponent(version);
    let link = `https://backstage.github.io/upgrade-helper/?from=${from}&to=${to}`;

    if (useYarnPlugin) {
      link += '&yarnPlugin=1';
    }

    console.log(
      yellow(
        `Upgraded from release ${green(prevVersion)} to ${green(
          version,
        )}, please review these template changes:`,
      ),
    );
    console.log();
    console.log(`  ${cyan(link)}`);
    console.log();
  } else {
    console.log(
      yellow(
        `Your project is now at version ${version}, which has been written to ${BACKSTAGE_JSON}`,
      ),
    );
  }

  await fs.writeJson(
    getBackstageJsonPath(),
    { ...backstageJson, version },
    {
      spaces: 2,
      encoding: 'utf8',
    },
  );
}

async function asLockfileVersion(version: string) {
  if (version === 'backstage:^') {
    return `backstage:${(await getBackstageJson())?.version}`;
  }

  return version;
}
