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

import { Config } from '@backstage/config';
import { Knex } from 'knex';

/**
 * The PluginDatabaseManager manages access to databases that Plugins get.
 */
export interface PluginDatabaseManager {
  /**
   * getClient provides backend plugins database connections for itself.
   *
   * The purpose of this method is to allow plugins to get isolated data
   * stores so that plugins are discouraged from database integration.
   */
  getClient(): Promise<Knex>;
}

/**
 * DatabaseConnector manages an underlying Knex database driver.
 */
export interface DatabaseConnector {
  /**
   * createClient provides an instance of a knex database connector.
   */
  createClient(dbConfig: Config, overrides?: Partial<Knex.Config>): Knex;
  /**
   * createNameOverride provides a partial knex config sufficient to override a
   * database name.
   */
  createNameOverride(name: string): Partial<Knex.Config>;
  /**
   * parseConnectionString produces a knex connection config object representing
   * a database connection string.
   */
  parseConnectionString(
    connectionString: string,
    client?: string,
  ): Knex.StaticConnectionConfig;
  /**
   * ensureDatabaseExists performs a side-effect to ensure database names passed in are
   * present.
   *
   * Calling this function on databases which already exist should do nothing.
   * Missing databases should be created if needed.
   */
  ensureDatabaseExists?(
    dbConfig: Config,
    ...databases: Array<string>
  ): Promise<void>;
}
