/*
 * Copyright 2022 The Backstage Authors
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

import { Config, ConfigReader } from '@backstage/config';
import { loadConfigSchema } from '@backstage/config-loader';
import {
  ConfigInfo,
  DevToolsInfo,
  Endpoint,
  ExternalDependency,
  ExternalDependencyStatus,
  PackageDependency,
} from '@backstage/plugin-devtools-common';
import { JsonObject } from '@backstage/types';
import { targetPaths } from '@backstage/cli-common';
import { getPackages } from '@manypkg/get-packages';
import ping from 'ping';
import os from 'node:os';
import fs from 'fs-extra';
import { Lockfile } from '../util/Lockfile';
import { PnpmLockfile } from '../util/PnpmLockfile';
import { memoize } from 'lodash';
import { toError } from '@backstage/errors';
import { LoggerService } from '@backstage/backend-plugin-api';

/** @public */
export class DevToolsBackendApi {
  private readonly logger: LoggerService;
  private readonly config: Config;

  public constructor(logger: LoggerService, config: Config) {
    this.logger = logger;
    this.config = config;
  }

  public async listExternalDependencyDetails(): Promise<ExternalDependency[]> {
    const result: ExternalDependency[] = [];

    const endpoints = this.config.getOptional<Endpoint[]>(
      'devTools.externalDependencies.endpoints',
    );
    if (!endpoints) {
      // No external dependency endpoints configured
      return result;
    }
    for (const endpoint of endpoints) {
      this.logger?.info(
        `Checking external dependency "${endpoint.name}" at "${endpoint.target}"`,
      );

      switch (endpoint.type) {
        case 'ping': {
          const pingResult = await this.pingExternalDependency(endpoint);
          result.push(pingResult);
          break;
        }
        case 'fetch': {
          const fetchResult = await this.fetchExternalDependency(endpoint);
          result.push(fetchResult);
          break;
        }
        default:
          return result;
      }
    }

    return result;
  }

  private async fetchExternalDependency(
    endpoint: Endpoint,
  ): Promise<ExternalDependency> {
    let status;
    let error;

    await fetch(endpoint.target)
      .then(res => {
        status =
          res.status === 200
            ? ExternalDependencyStatus.healthy
            : ExternalDependencyStatus.unhealthy;
        this.logger.debug(
          `Fetch for ${endpoint.name} resulted in status code "${res.status}"`,
        );
      })
      .catch((err: Error) => {
        this.logger.error(`Fetch failed for ${endpoint.name} - ${err.message}`);
        error = err.message;
      });

    const result: ExternalDependency = {
      name: endpoint.name,
      type: endpoint.type,
      target: endpoint.target,
      status: status ?? ExternalDependencyStatus.unhealthy,
      error: error ?? undefined,
    };

    return result;
  }

  private async pingExternalDependency(
    endpoint: Endpoint,
  ): Promise<ExternalDependency> {
    const pingResult = await ping.promise.probe(endpoint.target);

    let error;
    if (
      pingResult.packetLoss === '100.000' ||
      pingResult.packetLoss === 'unknown'
    ) {
      this.logger.error(
        `Ping failed for ${endpoint.name} - ${pingResult.output}`,
      );
      error =
        pingResult.output === ''
          ? `${endpoint.target} - Unknown`
          : pingResult.output;
    }

    this.logger.debug(
      `Ping results for ${endpoint.name}: ${pingResult.output}`,
    );

    const result: ExternalDependency = {
      name: endpoint.name,
      type: endpoint.type,
      target: endpoint.target,
      status: pingResult.alive
        ? ExternalDependencyStatus.healthy
        : ExternalDependencyStatus.unhealthy,
      error: error ?? undefined,
    };

    return result;
  }

  public async listConfig(): Promise<ConfigInfo> {
    const { packages } = await getPackages(targetPaths.dir);
    const schemaFunc = async () => {
      return await loadConfigSchema({
        dependencies: packages.map(p => p.packageJson.name),
      });
    };

    const schemaMemo = memoize(schemaFunc);
    const schema = await schemaMemo();

    const configInfo: ConfigInfo = {
      config: undefined,
      error: undefined,
    };
    try {
      const config = {
        data: this.config.get() as JsonObject,
        context: 'inline',
      };
      const sanitizedConfigs = schema.process([config], {
        ignoreSchemaErrors: false,
        valueTransform: (value, context) =>
          context.visibility === 'secret' ? '<secret>' : value,
      });

      const data = ConfigReader.fromConfigs(sanitizedConfigs).get();
      configInfo.config = data;
    } catch (error) {
      const err = toError(error);
      // The config is not valid for some reason but we want to be able to see it still
      const config = {
        data: this.config.get() as JsonObject,
        context: 'inline',
      };
      const sanitizedConfigs = schema.process([config], {
        ignoreSchemaErrors: true,
        valueTransform: (value, context) =>
          context.visibility === 'secret' ? '<secret>' : value,
      });

      const data = ConfigReader.fromConfigs(sanitizedConfigs).get();
      configInfo.config = data;
      configInfo.error = {
        name: err.name,
        message: err.message,
        messages: err.messages as string[] | undefined,
        stack: err.stack,
      };
    }

    return configInfo;
  }

  public async listInfo(): Promise<DevToolsInfo> {
    const operatingSystem = `${os.hostname()}: ${os.type} ${os.release} - ${
      os.platform
    }/${os.arch}`;
    const usedMem = Math.floor((os.totalmem() - os.freemem()) / (1024 * 1024));
    const resources = `Memory: ${usedMem}/${Math.floor(
      os.totalmem() / (1024 * 1024),
    )}MB - Load: ${os
      .loadavg()
      .map(v => v.toFixed(2))
      .join('/')}`;
    const nodeJsVersion = process.version;

    const backstageFile = targetPaths.backstageJsonPath;
    let backstageJson = undefined;
    if (fs.existsSync(backstageFile)) {
      const buffer = await fs.readFile(backstageFile);
      backstageJson = JSON.parse(buffer.toString());
    }

    const lockfile = await loadLockfile();

    const prefixes = ['@backstage', '@internal'].concat(
      this.config.getOptionalStringArray('devTools.info.packagePrefixes') ?? [],
    );
    const deps = [...lockfile.keys()].filter(n =>
      prefixes.some(prefix => n.startsWith(prefix)),
    );

    const infoDependencies: PackageDependency[] = [];
    for (const dep of deps) {
      const versions = new Set(lockfile.get(dep)!.map(i => i.version));
      const infoDependency: PackageDependency = {
        name: dep,
        versions: [...versions].join(', '),
      };
      infoDependencies.push(infoDependency);
    }

    const info: DevToolsInfo = {
      operatingSystem: operatingSystem ?? 'N/A',
      resourceUtilization: resources ?? 'N/A',
      nodeJsVersion: nodeJsVersion ?? 'N/A',
      backstageVersion:
        backstageJson && backstageJson.version ? backstageJson.version : 'N/A',
      dependencies: infoDependencies,
    };

    return info;
  }
}

// Picks the lockfile the same way as the Backstage CLI as far as needed here:
// the packageManager field of the root package.json, or else its
// devEngines.packageManager field, first, then whether there is a pnpm
// lockfile, and otherwise Yarn.
async function loadLockfile(): Promise<{
  keys(): IterableIterator<string>;
  get(name: string): Array<{ version: string }> | undefined;
}> {
  const packageJson = await fs
    .readJson(targetPaths.resolveWorkspaceRoot('package.json'))
    .catch(() => undefined);
  const declared = packageJson?.packageManager;
  const devEngineNames: unknown[] = [packageJson?.devEngines?.packageManager]
    .flat()
    .map(entry => entry?.name);
  const declaredName =
    typeof declared === 'string'
      ? declared.split('@')[0]
      : devEngineNames.find(name => name === 'yarn' || name === 'pnpm');

  const pnpmLockfilePath = targetPaths.resolveWorkspaceRoot('pnpm-lock.yaml');
  const usePnpm =
    declaredName === 'pnpm' ||
    (declaredName !== 'yarn' && (await fs.pathExists(pnpmLockfilePath)));

  return usePnpm
    ? PnpmLockfile.load(pnpmLockfilePath)
    : Lockfile.load(targetPaths.resolveWorkspaceRoot('yarn.lock'));
}
