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

import { DatabaseManager } from '@backstage/backend-common';
import { Knex } from 'knex';

/**
 * The possible databases to test against.
 */
export type TestDatabaseId =
  | 'POSTGRES_13'
  | 'POSTGRES_9'
  | 'MYSQL_8'
  | 'SQLITE_3';

export type TestDatabaseProperties = {
  name: string;
  driver: string;
  dockerImageName?: string;
  connectionStringEnvironmentVariableName?: string;
};

export type Instance = {
  stopContainer?: () => Promise<void>;
  databaseManager: DatabaseManager;
  connections: Array<Knex>;
};
export const allDatabases: Record<
  TestDatabaseId,
  TestDatabaseProperties
> = Object.freeze({
  POSTGRES_13: {
    name: 'Postgres 13.x',
    driver: 'pg',
    dockerImageName: 'postgres:13',
    connectionStringEnvironmentVariableName:
      'BACKSTAGE_TEST_DATABASE_POSTGRES13_CONNECTION_STRING',
  },
  POSTGRES_9: {
    name: 'Postgres 9.x',
    driver: 'pg',
    dockerImageName: 'postgres:9',
    connectionStringEnvironmentVariableName:
      'BACKSTAGE_TEST_DATABASE_POSTGRES9_CONNECTION_STRING',
  },
  MYSQL_8: {
    name: 'MySQL 8.x',
    driver: 'mysql2',
    dockerImageName: 'mysql:8',
    connectionStringEnvironmentVariableName:
      'BACKSTAGE_TEST_DATABASE_MYSQL8_CONNECTION_STRING',
  },
  SQLITE_3: {
    name: 'SQLite 3.x',
    driver: 'sqlite3',
  },
});
