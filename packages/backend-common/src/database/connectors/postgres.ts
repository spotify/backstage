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

import { Config } from '@backstage/config';
import { mergeDatabaseConfig } from '../config';
import { DatabaseConnector } from '../types';
import defaultNameOverride from './defaultNameOverride';

/**
 * Creates a knex postgres database connection
 *
 * @param dbConfig The database config
 * @param overrides Additional options to merge with the config
 */
export function createPgDatabaseClient(
  dbConfig: Config,
  overrides?: Knex.Config,
) {
  const knexConfig = buildPgDatabaseConfig(dbConfig, overrides);
  const database = knexFactory(knexConfig);
  return database;
}

/**
 * Builds a knex postgres database connection
 *
 * @param dbConfig The database config
 * @param overrides Additional options to merge with the config
 */
export function buildPgDatabaseConfig(
  dbConfig: Config,
  overrides?: Knex.Config,
) {
  return mergeDatabaseConfig(
    dbConfig.get(),
    {
      connection: getPgConnectionConfig(dbConfig, !!overrides),
      useNullAsDefault: true,
    },
    overrides,
  );
}

/**
 * Gets the postgres connection config
 *
 * @param dbConfig The database config
 * @param parseConnectionString Flag to explicitly control connection string parsing
 */
export function getPgConnectionConfig(
  dbConfig: Config,
  parseConnectionString?: boolean,
): Knex.PgConnectionConfig | string {
  const connection = dbConfig.get('connection') as any;
  const isConnectionString =
    typeof connection === 'string' || connection instanceof String;
  const autoParse = typeof parseConnectionString !== 'boolean';

  const shouldParseConnectionString = autoParse
    ? isConnectionString
    : parseConnectionString && isConnectionString;

  return shouldParseConnectionString
    ? parsePgConnectionString(connection as string)
    : connection;
}

/**
 * Parses a connection string using pg-connection-string
 *
 * @param connectionString The postgres connection string
 */
export function parsePgConnectionString(connectionString: string) {
  const parse = requirePgConnectionString();
  return parse(connectionString);
}

function requirePgConnectionString() {
  try {
    return require('pg-connection-string').parse;
  } catch (e) {
    const message = `Postgres: Install 'pg-connection-string'`;
    throw new Error(`${message}\n${e.message}`);
  }
}

/**
 * Creates the missing Postgres database if it does not exist
 *
 * @param dbConfig The database config
 * @param databases The name of the databases to create
 */
export async function ensurePgDatabaseExists(
  dbConfig: Config,
  ...databases: Array<string>
) {
  const admin = createPgDatabaseClient(dbConfig, {
    connection: {
      database: 'postgres',
    },
  });

  try {
    const ensureDatabase = async (database: string) => {
      const result = await admin
        .from('pg_database')
        .where('datname', database)
        .count<Record<string, { count: string }>>();

      if (parseInt(result[0].count, 10) > 0) {
        return;
      }

      await admin.raw(`CREATE DATABASE ??`, [database]);
    };

    await Promise.all(databases.map(ensureDatabase));
  } finally {
    await admin.destroy();
  }
}

/**
 * PostgreSQL database connector.
 *
 * Exposes database connector functionality via an immutable object.
 */
export const pgConnector: DatabaseConnector = Object.freeze({
  createClient: createPgDatabaseClient,
  ensureDatabaseExists: ensurePgDatabaseExists,
  createNameOverride: defaultNameOverride,
  parseConnectionString: parsePgConnectionString,
});
