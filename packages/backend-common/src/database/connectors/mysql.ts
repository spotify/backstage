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

import knexFactory, { Knex } from 'knex';
import yn from 'yn';

import { Config } from '@backstage/config';
import { InputError } from '@backstage/errors';
import { mergeDatabaseConfig } from '../config';
import { DatabaseConnector } from '../types';
import defaultNameOverride from './defaultNameOverride';

/**
 * Creates a knex mysql database connection
 *
 * @param dbConfig The database config
 * @param overrides Additional options to merge with the config
 */
export function createMysqlDatabaseClient(
  dbConfig: Config,
  overrides?: Knex.Config,
) {
  const knexConfig = buildMysqlDatabaseConfig(dbConfig, overrides);
  const database = knexFactory(knexConfig);
  return database;
}

/**
 * Builds a knex mysql database connection
 *
 * @param dbConfig The database config
 * @param overrides Additional options to merge with the config
 */
export function buildMysqlDatabaseConfig(
  dbConfig: Config,
  overrides?: Knex.Config,
) {
  return mergeDatabaseConfig(
    dbConfig.get(),
    {
      connection: getMysqlConnectionConfig(dbConfig, !!overrides),
      useNullAsDefault: true,
    },
    overrides,
  );
}

/**
 * Gets the mysql connection config
 *
 * @param dbConfig The database config
 * @param parseConnectionString Flag to explicitly control connection string parsing
 */
export function getMysqlConnectionConfig(
  dbConfig: Config,
  parseConnectionString?: boolean,
): Knex.MySqlConnectionConfig | string {
  const connection = dbConfig.get('connection') as any;
  const isConnectionString =
    typeof connection === 'string' || connection instanceof String;
  const autoParse = typeof parseConnectionString !== 'boolean';

  const shouldParseConnectionString = autoParse
    ? isConnectionString
    : parseConnectionString && isConnectionString;

  return shouldParseConnectionString
    ? parseMysqlConnectionString(connection as string)
    : connection;
}

/**
 * Parses a mysql connection string.
 *
 * e.g. mysql://examplename:somepassword@examplehost:3306/dbname
 * @param connectionString The mysql connection string
 */
export function parseMysqlConnectionString(
  connectionString: string,
): Knex.MySqlConnectionConfig {
  try {
    const {
      protocol,
      username,
      password,
      port,
      hostname,
      pathname,
      searchParams,
    } = new URL(connectionString);

    if (protocol !== 'mysql:') {
      throw new Error(`Unknown protocol ${protocol}`);
    } else if (!username || !password) {
      throw new Error(`Missing username/password`);
    } else if (!pathname.match(/^\/[^/]+$/)) {
      throw new Error(`Expected single path segment`);
    }

    const result: Knex.MySqlConnectionConfig = {
      user: username,
      password,
      host: hostname,
      port: Number(port || 3306),
      database: decodeURIComponent(pathname.substr(1)),
    };

    const ssl = searchParams.get('ssl');
    if (ssl) {
      result.ssl = ssl;
    }

    const debug = searchParams.get('debug');
    if (debug) {
      result.debug = yn(debug);
    }

    return result;
  } catch (e) {
    throw new InputError(
      `Error while parsing MySQL connection string, ${e}`,
      e,
    );
  }
}

/**
 * Creates the missing mysql database if it does not exist
 *
 * @param dbConfig The database config
 * @param databases The names of the databases to create
 */
export async function ensureMysqlDatabaseExists(
  dbConfig: Config,
  ...databases: Array<string>
) {
  const admin = createMysqlDatabaseClient(dbConfig, {
    connection: {
      database: (null as unknown) as string,
    },
  });

  try {
    const ensureDatabase = async (database: string) => {
      await admin.raw(`CREATE DATABASE IF NOT EXISTS ??`, [database]);
    };
    await Promise.all(databases.map(ensureDatabase));
  } finally {
    await admin.destroy();
  }
}

/**
 * MySQL database connector.
 *
 * Exposes database connector functionality via an immutable object.
 */
export const mysqlConnector: DatabaseConnector = Object.freeze({
  createClient: createMysqlDatabaseClient,
  ensureDatabaseExists: ensureMysqlDatabaseExists,
  createNameOverride: defaultNameOverride,
  parseConnectionString: parseMysqlConnectionString,
});
