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
import path from 'path';

import { ensureDirSync } from 'fs-extra';
import knexFactory, { Knex } from 'knex';

import { Config } from '@backstage/config';
import { mergeDatabaseConfig } from '../config';
import { DatabaseConnector } from '../types';

/**
 * Creates a knex SQLite3 database connection
 *
 * @param dbConfig The database config
 * @param overrides Additional options to merge with the config
 */
export function createSqliteDatabaseClient(
  dbConfig: Config,
  overrides?: Knex.Config,
) {
  const knexConfig = buildSqliteDatabaseConfig(dbConfig, overrides);

  // If storage on disk is used, ensure that the directory exists
  if (
    (knexConfig.connection as Knex.Sqlite3ConnectionConfig).filename &&
    (knexConfig.connection as Knex.Sqlite3ConnectionConfig).filename !==
      ':memory:'
  ) {
    const { filename } = knexConfig.connection as Knex.Sqlite3ConnectionConfig;
    const directory = path.dirname(filename);

    ensureDirSync(directory);
  }

  const database = knexFactory(knexConfig);

  database.client.pool.on('createSuccess', (_eventId: any, resource: any) => {
    resource.run('PRAGMA foreign_keys = ON', () => {});
  });

  return database;
}

/**
 * Builds a knex SQLite3 connection config
 *
 * @param dbConfig The database config
 * @param overrides Additional options to merge with the config
 */
export function buildSqliteDatabaseConfig(
  dbConfig: Config,
  overrides?: Knex.Config,
): Knex.Config {
  const baseConfig = dbConfig.get<Knex.Config>();

  // Normalize config to always contain a connection object
  if (typeof baseConfig.connection === 'string') {
    baseConfig.connection = { filename: baseConfig.connection };
  }
  if (overrides && typeof overrides.connection === 'string') {
    overrides.connection = { filename: overrides.connection };
  }

  const config: Knex.Config = mergeDatabaseConfig(
    {
      connection: {},
    },
    baseConfig,
    {
      useNullAsDefault: true,
    },
    overrides,
  );

  // If we don't create an in-memory database, interpret the connection string
  // as a directory that contains multiple sqlite files based on the database
  // name.
  const database = (config.connection as Knex.ConnectionConfig).database;
  const sqliteConnection = config.connection as Knex.Sqlite3ConnectionConfig;

  if (database && sqliteConnection.filename !== ':memory:') {
    sqliteConnection.filename = path.join(
      sqliteConnection.filename,
      `${database}.sqlite`,
    );
  }

  return config;
}

/**
 * Provides a partial knex SQLite3 config to override database name.
 */
export function createSqliteNameOverride(name: string): Partial<Knex.Config> {
  return {
    connection: parseSqliteConnectionString(name),
  };
}

/**
 * Produces a partial knex SQLite3 connection config with database name.
 */
export function parseSqliteConnectionString(
  name: string,
): Knex.Sqlite3ConnectionConfig {
  return {
    filename: name,
  };
}

/**
 * SQLite3 database connector.
 *
 * Exposes database connector functionality via an immutable object.
 */
export const sqlite3Connector: DatabaseConnector = Object.freeze({
  createClient: createSqliteDatabaseClient,
  createNameOverride: createSqliteNameOverride,
  parseConnectionString: parseSqliteConnectionString,
});
