/*
 * Copyright 2023 The Backstage Authors
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

import { resolve as resolvePath } from 'node:path';
import fs from 'fs-extra';
import { Config, ConfigReader } from '@backstage/config';
import parseArgs from 'minimist';
import { EnvConfigSource } from './EnvConfigSource';
import { FileConfigSource } from './FileConfigSource';
import { MergedConfigSource } from './MergedConfigSource';
import {
  RemoteConfigSource,
  RemoteConfigSourceOptions,
} from './RemoteConfigSource';
import { ConfigSource, SubstitutionFunc } from './types';
import { ObservableConfigProxy } from './ObservableConfigProxy';
import { targetPaths } from '@backstage/cli-common';

/**
 * A target to read configuration from.
 *
 * @public
 */
export type ConfigSourceTarget =
  | {
      type: 'path';
      target: string;
    }
  | {
      type: 'url';
      target: string;
    };

/**
 * A config implementation that can be closed.
 *
 * @remarks
 *
 * Closing the configuration instance will stop the reading from the underlying source.
 *
 * @public
 */
export interface ClosableConfig extends Config {
  /**
   * Closes the configuration instance.
   *
   * @remarks
   *
   * The configuration instance will still be usable after closing, but it will
   * no longer be updated with new values from the underlying source.
   */
  close(): void;
}

/**
 * Common options for the default Backstage configuration sources.
 *
 * @public
 */
export interface BaseConfigSourcesOptions {
  watch?: boolean;
  rootDir?: string;
  remote?: Pick<RemoteConfigSourceOptions, 'reloadInterval'>;
  /**
   * Allow the default app-config.yaml to be missing, in which case the source
   * will not be created.
   */
  allowMissingDefaultConfig?: boolean;

  /**
   * A custom substitution function that overrides the default one.
   *
   * @remarks
   * The substitution function handles syntax like `${MY_ENV_VAR}` in configuration values.
   * The default substitution will read the value from the environment and trim whitespace.
   */
  substitutionFunc?: SubstitutionFunc;
}

/**
 * Options for {@link ConfigSources.defaultForTargets}.
 *
 * @public
 */
export interface ConfigSourcesDefaultForTargetsOptions
  extends BaseConfigSourcesOptions {
  targets: ConfigSourceTarget[];
}

/**
 * Options for {@link ConfigSources.default}.
 *
 * @public
 */
export interface ConfigSourcesDefaultOptions extends BaseConfigSourcesOptions {
  argv?: string[];
  env?: Record<string, string | undefined>;
}

/**
 * A collection of utilities for working with and creating {@link ConfigSource}s.
 *
 * @public
 */
export class ConfigSources {
  /**
   * Parses command line arguments and returns the config targets.
   *
   * @param argv - The command line arguments to parse. Defaults to `process.argv`
   * @returns A list of config targets
   */
  static parseArgs(argv: string[] = process.argv): ConfigSourceTarget[] {
    const args: string[] = [parseArgs(argv).config].flat().filter(Boolean);
    return args.map(target => {
      try {
        const url = new URL(target);

        // Some file paths are valid relative URLs, so check if the host is empty too
        if (!url.host) {
          return { type: 'path', target };
        }
        return { type: 'url', target };
      } catch {
        return { type: 'path', target };
      }
    });
  }

  /**
   * Creates the default config sources for the provided targets.
   *
   * @remarks
   *
   * This will create {@link FileConfigSource}s and {@link RemoteConfigSource}s
   * for the provided targets, and merge them together to a single source.
   * If no targets are provided it will fall back to `app-config.yaml` and
   * `app-config.local.yaml`.
   *
   * URL targets are only supported if the `remote` option is provided.
   *
   * @param options - Options
   * @returns A config source for the provided targets
   */
  static defaultForTargets(
    options: ConfigSourcesDefaultForTargetsOptions,
  ): ConfigSource {
    const rootDir = options.rootDir ?? targetPaths.installationRootDir;

    const argSources = options.targets.map(arg => {
      if (arg.type === 'url') {
        if (!options.remote) {
          throw new Error(
            `Config argument "${arg.target}" looks like a URL but remote configuration is not enabled. Enable it by passing the \`remote\` option`,
          );
        }
        return RemoteConfigSource.create({
          url: arg.target,
          substitutionFunc: options.substitutionFunc,
          reloadInterval: options.remote.reloadInterval,
        });
      }
      return FileConfigSource.create({
        watch: options.watch,
        path: resolvePath(arg.target),
        substitutionFunc: options.substitutionFunc,
      });
    });

    if (argSources.length === 0) {
      const defaultPath = resolvePath(rootDir, 'app-config.yaml');
      const localPath = resolvePath(rootDir, 'app-config.local.yaml');
      const alwaysIncludeDefaultConfigSource =
        !options.allowMissingDefaultConfig;

      const envs = (process.env.BACKSTAGE_ENV ?? '')
        .split(',')
        .map(e => e.trim())
        .filter(Boolean);

      if (alwaysIncludeDefaultConfigSource || fs.pathExistsSync(defaultPath)) {
        argSources.push(
          FileConfigSource.create({
            watch: options.watch,
            path: defaultPath,
            substitutionFunc: options.substitutionFunc,
          }),
        );
      }

      for (const env of envs) {
        const envPath = resolvePath(rootDir, `app-config.${env}.yaml`);
        if (fs.pathExistsSync(envPath)) {
          argSources.push(
            FileConfigSource.create({
              watch: options.watch,
              path: envPath,
              substitutionFunc: options.substitutionFunc,
            }),
          );
        }
      }

      if (fs.pathExistsSync(localPath)) {
        argSources.push(
          FileConfigSource.create({
            watch: options.watch,
            path: localPath,
            substitutionFunc: options.substitutionFunc,
          }),
        );
      }

      for (const env of envs) {
        const envLocalPath = resolvePath(
          rootDir,
          `app-config.${env}.local.yaml`,
        );
        if (fs.pathExistsSync(envLocalPath)) {
          argSources.push(
            FileConfigSource.create({
              watch: options.watch,
              path: envLocalPath,
              substitutionFunc: options.substitutionFunc,
            }),
          );
        }
      }
    }

    return this.merge(argSources);
  }

  /**
   * Creates the default config source for Backstage.
   *
   * @remarks
   *
   * This will read from `app-config.yaml` and `app-config.local.yaml` by
   * default, as well as environment variables prefixed with `APP_CONFIG_`.
   * If `--config <path|url>` command line arguments are passed, these will
   * override the default configuration file paths. URLs are only supported
   * if the `remote` option is provided.
   *
   * @param options - Options
   * @returns The default Backstage config source
   */
  static default(options: ConfigSourcesDefaultOptions): ConfigSource {
    const argSource = this.defaultForTargets({
      ...options,
      targets: this.parseArgs(options.argv),
    });

    const envSource = EnvConfigSource.create({
      env: options.env,
    });

    return this.merge([argSource, envSource]);
  }

  /**
   * Merges multiple config sources into a single source that reads from all
   * sources and concatenates the result.
   *
   * @param sources - The config sources to merge
   * @returns A single config source that concatenates the data from the given sources
   */
  static merge(sources: ConfigSource[]): ConfigSource {
    return MergedConfigSource.from(sources);
  }

  /**
   * Creates an observable {@link @backstage/config#Config} implementation from a {@link ConfigSource}.
   *
   * @remarks
   *
   * If you only want to read the config once you can close the returned config immediately.
   *
   * @example
   *
   * ```ts
   * const sources = ConfigSources.default(...)
   * const config = await ConfigSources.toConfig(source)
   * config.close()
   * const example = config.getString(...)
   * ```
   *
   * @param source - The config source to read from
   * @returns A promise that resolves to a closable config
   */
  static toConfig(source: ConfigSource): Promise<ClosableConfig> {
    return new Promise(async (resolve, reject) => {
      let config: ObservableConfigProxy | undefined = undefined;
      try {
        const abortController = new AbortController();
        for await (const { configs } of source.readConfigData({
          signal: abortController.signal,
        })) {
          if (config) {
            config.setConfig(ConfigReader.fromConfigs(configs));
          } else {
            config = ObservableConfigProxy.create(abortController);
            config!.setConfig(ConfigReader.fromConfigs(configs));
            resolve(config);
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}
