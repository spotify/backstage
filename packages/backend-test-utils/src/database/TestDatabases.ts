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
import { ConfigReader } from '@backstage/config';
import { Knex } from 'knex';
import { isDockerDisabledForTests } from '../util/isDockerDisabledForTests';
import { startMysqlContainer } from './startMysqlContainer';
import { startPostgresContainer } from './startPostgresContainer';
import {
  allDatabases,
  Instance,
  TestDatabaseId,
  TestDatabaseProperties,
} from './types';

/**
 * Encapsulates the creation of ephemeral test database instances for use
 * inside unit or integration tests.
 */
export class TestDatabases {
  private readonly instanceById: Map<string, Instance>;
  private readonly supportedIds: TestDatabaseId[];
  private lastDatabaseIndex: number;

  /**
   * Creates an empty `TestDatabases` instance, and sets up Jest to clean up
   * all of its acquired resources after all tests finish.
   *
   * You typically want to create just a single instance like this at the top
   * of your test file or `describe` block, and then call `init` many times on
   * that instance inside the individual tests. Spinning up a "physical"
   * database instance takes a considerable amount of time, slowing down tests.
   * But initializing a new logical database inside that instance using `init`
   * is very fast.
   */
  static create(options?: {
    ids?: TestDatabaseId[];
    disableDocker?: boolean;
  }): TestDatabases {
    const defaultOptions = {
      ids: Object.keys(allDatabases) as TestDatabaseId[],
      disableDocker: isDockerDisabledForTests(),
    };

    const { ids, disableDocker } = Object.assign(
      {},
      defaultOptions,
      options ?? {},
    );

    const supportedIds = ids.filter(id => {
      const properties = allDatabases[id];
      if (!properties) {
        return false;
      }
      // If the caller has set up the env with an explicit connection string,
      // we'll assume that this database will work
      if (
        properties.connectionStringEnvironmentVariableName &&
        process.env[properties.connectionStringEnvironmentVariableName]
      ) {
        return true;
      }
      // If the database doesn't require docker at all, there's nothing to worry
      // about
      if (!properties.dockerImageName) {
        return true;
      }
      // If the database requires docker, but docker is disabled, we will fail.
      if (disableDocker) {
        return false;
      }
      return true;
    });

    const databases = new TestDatabases(supportedIds);

    afterAll(async () => {
      await databases.shutdown();
    });

    return databases;
  }

  private constructor(supportedIds: TestDatabaseId[]) {
    this.instanceById = new Map();
    this.supportedIds = supportedIds;
    this.lastDatabaseIndex = 0;
  }

  supports(id: TestDatabaseId): boolean {
    return this.supportedIds.includes(id);
  }

  eachSupportedId(): [TestDatabaseId][] {
    return this.supportedIds.map(id => [id]);
  }

  /**
   * Returns a fresh, unique, empty logical database on an instance of the
   * given database ID platform.
   *
   * @param id The ID of the database platform to use, e.g. 'POSTGRES_13'
   * @returns A `Knex` connection object
   */
  async init(id: TestDatabaseId): Promise<Knex> {
    const properties = allDatabases[id];
    if (!properties) {
      const candidates = Object.keys(allDatabases).join(', ');
      throw new Error(
        `Unknown test database ${id}, possible values are ${candidates}`,
      );
    }
    if (!this.supportedIds.includes(id)) {
      const candidates = this.supportedIds.join(', ');
      throw new Error(
        `Unsupported test database ${id} for this environment, possible values are ${candidates}`,
      );
    }

    let instance: Instance | undefined = this.instanceById.get(id);

    // Ensure that a testcontainers instance is up for this ID
    if (!instance) {
      instance = await this.initAny(properties);
      this.instanceById.set(id, instance);
    }

    // Ensure that a unique logical database is created in the instance
    const connection = await instance.databaseManager
      .forPlugin(String(`db${this.lastDatabaseIndex++}`))
      .getClient();

    instance.connections.push(connection);

    return connection;
  }

  private async initAny(properties: TestDatabaseProperties): Promise<Instance> {
    // Use the connection string if provided
    if (properties.driver === 'pg' || properties.driver === 'mysql2') {
      const envVarName = properties.connectionStringEnvironmentVariableName;
      if (envVarName) {
        const connectionString = process.env[envVarName];
        if (connectionString) {
          const databaseManager = DatabaseManager.fromConfig(
            new ConfigReader({
              backend: {
                database: {
                  client: properties.driver,
                  connection: connectionString,
                },
              },
            }),
          );
          return {
            databaseManager,
            connections: [],
          };
        }
      }
    }

    // Otherwise start a container for the purpose
    switch (properties.driver) {
      case 'pg':
        return this.initPostgres(properties);
      case 'mysql2':
        return this.initMysql(properties);
      case 'sqlite3':
        return this.initSqlite(properties);
      default:
        throw new Error(`Unknown database driver ${properties.driver}`);
    }
  }

  private async initPostgres(
    properties: TestDatabaseProperties,
  ): Promise<Instance> {
    const { host, port, user, password, stop } = await startPostgresContainer(
      properties.dockerImageName!,
    );

    const databaseManager = DatabaseManager.fromConfig(
      new ConfigReader({
        backend: {
          database: {
            client: 'pg',
            connection: { host, port, user, password },
          },
        },
      }),
    );

    return {
      stopContainer: stop,
      databaseManager,
      connections: [],
    };
  }

  private async initMysql(
    properties: TestDatabaseProperties,
  ): Promise<Instance> {
    const { host, port, user, password, stop } = await startMysqlContainer(
      properties.dockerImageName!,
    );

    const databaseManager = DatabaseManager.fromConfig(
      new ConfigReader({
        backend: {
          database: {
            client: 'mysql2',
            connection: { host, port, user, password },
          },
        },
      }),
    );

    return {
      stopContainer: stop,
      databaseManager,
      connections: [],
    };
  }

  private async initSqlite(
    _properties: TestDatabaseProperties,
  ): Promise<Instance> {
    const databaseManager = DatabaseManager.fromConfig(
      new ConfigReader({
        backend: {
          database: {
            client: 'sqlite3',
            connection: ':memory:',
          },
        },
      }),
    );

    return {
      databaseManager,
      connections: [],
    };
  }

  private async shutdown() {
    const instances = [...this.instanceById.values()];
    await Promise.all(
      instances.map(async ({ stopContainer, connections }) => {
        try {
          await Promise.all(connections.map(c => c.destroy()));
        } catch {
          // ignore
        }
        try {
          await stopContainer?.();
        } catch {
          // ignore
        }
      }),
    );
  }
}
