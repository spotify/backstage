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
import { Knex } from 'knex';
import { omit } from 'lodash';
import { Config, ConfigReader, JsonObject } from '@backstage/config';
import {
  createDatabaseClient,
  ensureDatabaseExists,
  createNameOverride,
  normalizeConnection,
} from './connection';
import { PluginDatabaseManager } from './types';

/**
 * Provides a config lookup path for a plugin's config block.
 */
function pluginPath(pluginId: string): string {
  return `plugin.${pluginId}`;
}

export class DatabaseManager {
  /**
   * Creates a DatabaseManager from `backend.database` config.
   *
   * The database manager allows the user to set connection and client settings on a per pluginId
   * basis by defining a database config block under `plugin.<pluginId>` in addition to top level
   * defaults. Optionally, a user may set `prefix` which is used to prefix generated database
   * names if config is not provided.
   *
   * @param config The loaded application configuration.
   */
  static fromConfig(config: Config): DatabaseManager {
    const databaseConfig = config.getConfig('backend.database');

    return new DatabaseManager(
      databaseConfig,
      databaseConfig.getOptionalString('prefix'),
    );
  }

  private constructor(
    private readonly config: Config,
    private readonly prefix: string = 'backstage_plugin_',
  ) {}

  /**
   * Generates a PluginDatabaseManager for consumption by plugins.
   *
   * @param pluginId The plugin that the database manager should be created for. Plugin names
   * should be unique as they are used to look up database config overrides under
   * `backend.database.plugin`.
   */
  forPlugin(pluginId: string): PluginDatabaseManager {
    const _this = this;

    return {
      getClient(): Promise<Knex> {
        return _this.getDatabase(pluginId);
      },
    };
  }

  /**
   * Provides the canonical database name for a given plugin.
   *
   * This method provides the effective database name which is determined using global
   * and plugin specific database config. If no explicit database name is configured,
   * this method will provide a generated name which is the pluginId prefixed with
   * 'backstage_plugin_'.
   *
   * @param pluginId Lookup the database name for given plugin
   * @returns String representing the plugin's database name
   */
  private getDatabaseName(pluginId: string): string {
    const connection = this.getConnectionConfig(pluginId);

    if (this.getClientType(pluginId).client === 'sqlite3') {
      // sqlite database name should fallback to ':memory:' as a special case
      return (
        (connection as Knex.Sqlite3ConnectionConfig)?.filename ?? ':memory:'
      );
    }
    // all other supported databases should fallback to an auto-prefixed name
    return (
      (connection as Knex.ConnectionConfig)?.database ??
      `${this.prefix}${pluginId}`
    );
  }

  /**
   * Provides the client type which should be used for a given plugin.
   *
   * The client type is determined by plugin specific config if present. Otherwise the base
   * client is used as the fallback.
   *
   * @param pluginId Plugin to get the client type for
   * @returns Object with client type returned as `client` and boolean representing whether
   * or not the client was overridden as `overridden`
   */
  private getClientType(
    pluginId: string,
  ): {
    client: string;
    overridden: boolean;
  } {
    const pluginClient = this.config.getOptionalString(
      `${pluginPath(pluginId)}.client`,
    );

    const baseClient = this.config.getString('client');
    const client = pluginClient ?? baseClient;
    return {
      client,
      overridden: client !== baseClient,
    };
  }

  /**
   * Provides a Knex connection plugin config by combining base and plugin config.
   *
   * This method provides a baseConfig for a plugin database connector. If the client type
   * has not been overridden, the global connection config will be included with plugin
   * specific config as the base. Values from the plugin connection take precedence over the
   * base. Base database name is omitted for all supported databases excluding SQLite.
   */
  private getConnectionConfig(
    pluginId: string,
  ): Partial<Knex.StaticConnectionConfig> {
    const { client, overridden } = this.getClientType(pluginId);

    let baseConnection = normalizeConnection(
      this.config.get('connection'),
      this.config.getString('client'),
    );
    // As databases cannot be shared, the `database` property from the base connection
    // is omitted. SQLite3's `filename` property is an exception as this is used as a
    // directory elsewhere so we preserve `filename`.
    baseConnection = omit(baseConnection, 'database');

    // get and normalize optional plugin specific database connection
    const connection = normalizeConnection(
      this.config.getOptional(`${pluginPath(pluginId)}.connection`),
      client,
    );

    return {
      // include base connection if client type has not been overriden
      ...(overridden ? {} : baseConnection),
      ...connection,
    };
  }

  /**
   * Provides a Knex database config for a given plugin.
   *
   * This method provides a Knex configuration object along with the plugin's client type.
   *
   * @param pluginId The plugin that the database config should correspond with
   */
  private getConfigForPlugin(pluginId: string): Knex.Config {
    const { client } = this.getClientType(pluginId);

    return {
      client,
      connection: this.getConnectionConfig(pluginId),
    };
  }

  /**
   * Provides a partial Knex.Config database name override for a given plugin.
   *
   * @param pluginId Target plugin to get database name override
   * @returns Partial Knex.Config with database name override
   */
  private getDatabaseOverrides(pluginId: string): Knex.Config {
    return createNameOverride(
      this.getClientType(pluginId).client,
      this.getDatabaseName(pluginId),
    );
  }

  /**
   * Provides a scoped Knex client for a plugin as per application config.
   *
   *  @param pluginId Plugin to get a Knex client for
   *  @returns Promise which resolves to a scoped Knex database client for a plugin
   */
  private async getDatabase(pluginId: string): Promise<Knex> {
    const pluginConfig = new ConfigReader(
      this.getConfigForPlugin(pluginId) as JsonObject,
    );

    const databaseName = this.getDatabaseName(pluginId);
    try {
      await ensureDatabaseExists(pluginConfig, databaseName);
    } catch (error) {
      throw new Error(
        `Failed to connect to the database to make sure that '${databaseName}' exists, ${error}`,
      );
    }

    return createDatabaseClient(
      pluginConfig,
      this.getDatabaseOverrides(pluginId),
    );
  }
}
