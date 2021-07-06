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

import { Config, JsonObject } from '@backstage/config';
import { InputError } from '@backstage/errors';
import knexFactory, { Knex } from 'knex';
import { mergeDatabaseConfig } from './config';
import { DatabaseConnector } from './types';

import { mysqlConnector, pgConnector, sqlite3Connector } from './connectors';

type DatabaseClient = 'pg' | 'sqlite3' | 'mysql' | 'mysql2' | string;

/**
 * Mapping of client type to supported database connectors
 *
 * Database connectors can be aliased here, for example mysql2 uses
 * the same connector as mysql.
 */
const ConnectorMapping: Record<DatabaseClient, DatabaseConnector> = {
  pg: pgConnector,
  sqlite3: sqlite3Connector,
  mysql: mysqlConnector,
  mysql2: mysqlConnector,
};

/**
 * Creates a knex database connection
 *
 * @param dbConfig The database config
 * @param overrides Additional options to merge with the config
 */
export function createDatabaseClient(
  dbConfig: Config,
  overrides?: Partial<Knex.Config>,
) {
  const client: DatabaseClient = dbConfig.getString('client');

  return (
    ConnectorMapping[client]?.createClient(dbConfig, overrides) ??
    knexFactory(mergeDatabaseConfig(dbConfig.get(), overrides))
  );
}

/**
 * Alias for createDatabaseClient
 * @deprecated Use createDatabaseClient instead
 */
export const createDatabase = createDatabaseClient;

/**
 * Ensures that the given databases all exist, creating them if they do not.
 */
export async function ensureDatabaseExists(
  dbConfig: Config,
  ...databases: Array<string>
): Promise<void> {
  const client: DatabaseClient = dbConfig.getString('client');

  return ConnectorMapping[client]?.ensureDatabaseExists?.(
    dbConfig,
    ...databases,
  );
}

/**
 * Provides a Knex.Config object with the provided database name for a given client.
 */
export function createNameOverride(
  client: string,
  name: string,
): Partial<Knex.Config> {
  try {
    return ConnectorMapping[client].createNameOverride(name);
  } catch (e) {
    throw new InputError(
      `Unable to create database name override for '${client}' connector`,
      e,
    );
  }
}

/**
 * Parses a connection string for a given client and provides a connection config.
 */
export function parseConnectionString(
  connectionString: string,
  client?: string,
): Knex.StaticConnectionConfig {
  if (typeof client === 'undefined' || client === null) {
    throw new InputError(
      'Database connection string client type auto-detection is not yet supported.',
    );
  }

  try {
    return ConnectorMapping[client].parseConnectionString(connectionString);
  } catch (e) {
    throw new InputError(
      `Unable to parse connection string for '${client}' connector`,
    );
  }
}

/**
 * Normalizes a connection config or string into an object which can be passed to Knex.
 */
export function normalizeConnection(
  connection: Knex.StaticConnectionConfig | JsonObject | string | undefined,
  client: string,
): Partial<Knex.StaticConnectionConfig> {
  if (typeof connection === 'undefined' || connection === null) {
    return {};
  }

  return typeof connection === 'string' || connection instanceof String
    ? parseConnectionString(connection as string, client)
    : connection;
}
