/*
 * Copyright 2024 The Backstage Authors
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

import os from 'node:os';
import fs from 'fs-extra';
import {
  isAbsolute as isAbsolutePath,
  resolve as resolvePath,
} from 'node:path';
import { z } from 'zod';
import { getPortPromise } from 'portfinder';
import { ForwardedError } from '@backstage/errors';
import { ConfigSources } from '@backstage/config-loader';
import { targetPaths } from '@backstage/cli-common';
import chalk from 'chalk';

const TEMP_DIR_PREFIX = 'backstage-dev-db-';
const PID_FILE = 'backstage.pid';

function isProcessAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

async function cleanStaleDatabases() {
  const tmpBase = os.tmpdir();
  const entries = (await fs.readdir(tmpBase)).filter(d =>
    d.startsWith(TEMP_DIR_PREFIX),
  );
  await Promise.all(
    entries.map(async d => {
      const dir = resolvePath(tmpBase, d);
      const raw = await fs
        .readFile(resolvePath(dir, PID_FILE), 'utf8')
        .catch(() => undefined);
      const pid = raw ? Number(raw.trim()) : NaN;
      if (!pid || !isProcessAlive(pid)) {
        await fs.remove(dir);
      }
    }),
  );
}

export interface EmbeddedDbConnectionConfig {
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  flags?: {
    postgres?: string[];
    initdb?: string[];
  };
}

const connectionSchema: z.ZodType<EmbeddedDbConnectionConfig> = z.object({
  host: z.string().optional(),
  port: z.number().optional(),
  user: z.string().optional(),
  password: z.string().optional(),
  flags: z
    .object({
      postgres: z.array(z.string()).optional(),
      initdb: z.array(z.string()).optional(),
    })
    .optional(),
});

export interface StartEmbeddedDbOptions {
  configPaths?: string[];
  targetDir?: string;
}

/**
 * Reads the database configuration from the app config and, if the client is
 * `embedded-postgres`, starts an embedded Postgres instance. Returns the config
 * override to inject into the child process, or `undefined` if the database
 * client is not `embedded-postgres`.
 */
export async function startEmbeddedDb(options: StartEmbeddedDbOptions): Promise<
  | {
      configOverride: Record<string, unknown>;
      close(): Promise<void>;
    }
  | undefined
> {
  const dbConfig = await readDatabaseConfig(
    options.configPaths,
    options.targetDir,
  );
  if (dbConfig?.client !== 'embedded-postgres') {
    return undefined;
  }

  return startEmbeddedDbInternal(dbConfig.connection);
}

async function startEmbeddedDbInternal(
  userConfig?: EmbeddedDbConnectionConfig,
) {
  console.warn(
    chalk.yellow(
      'WARNING: Using embedded-postgres for local development is experimental and subject to change',
    ),
  );

  const { default: EmbeddedPostgres } = await import('embedded-postgres').catch(
    error => {
      throw new ForwardedError(
        `Failed to load 'embedded-postgres' which is required when using ` +
          `'embedded-postgres' as the database client. It must be installed ` +
          `as an explicit dependency in your project`,
        error,
      );
    },
  );

  await cleanStaleDatabases();

  const host = userConfig?.host ?? 'localhost';
  const user = userConfig?.user ?? 'postgres';
  const password = userConfig?.password ?? 'postgres';
  const port = userConfig?.port ?? (await getPortPromise());
  const tmpDir = await fs.mkdtemp(resolvePath(os.tmpdir(), TEMP_DIR_PREFIX));

  const pg = new EmbeddedPostgres({
    databaseDir: tmpDir,
    user,
    password,
    port,
    persistent: false,
    ...(userConfig?.flags?.postgres
      ? { postgresFlags: userConfig.flags.postgres }
      : {}),
    ...(userConfig?.flags?.initdb
      ? { initdbFlags: userConfig.flags.initdb }
      : {}),
    onError(messageOrError) {
      console.error(`[embedded-postgres]`, messageOrError);
    },
    onLog() {},
  });

  try {
    await pg.initialise();
    await fs.writeFile(resolvePath(tmpDir, PID_FILE), String(process.pid));
    await pg.start();
  } catch (error) {
    await pg.stop().catch(() => {});
    await fs.remove(tmpDir).catch(() => {});
    throw error;
  }

  const configOverride: Record<string, unknown> = {
    client: 'pg',
  };
  const defaultedConnection: Record<string, string | number> = {};
  if (!userConfig?.host) {
    defaultedConnection.host = host;
  }
  if (!userConfig?.user) {
    defaultedConnection.user = user;
  }
  if (!userConfig?.password) {
    defaultedConnection.password = password;
  }
  if (!userConfig?.port) {
    defaultedConnection.port = port;
  }
  if (Object.keys(defaultedConnection).length > 0) {
    configOverride.connection = defaultedConnection;
  }

  return {
    configOverride,
    async close() {
      await pg.stop();
      await fs.remove(tmpDir);
    },
  };
}

async function readDatabaseConfig(
  configPaths?: string[],
  targetDir?: string,
): Promise<
  | {
      client: string;
      connection?: EmbeddedDbConnectionConfig;
    }
  | undefined
> {
  const rootDir = targetPaths.installationRootDir;
  const configBaseDir = targetDir ?? rootDir;
  const source = ConfigSources.default({
    rootDir,
    allowMissingDefaultConfig: true,
    argv: (configPaths ?? []).flatMap(p => [
      '--config',
      isAbsolutePath(p) ? p : resolvePath(configBaseDir, p),
    ]),
  });

  const config = await ConfigSources.toConfig(source);
  try {
    const client = config.getOptionalString('backend.database.client');
    if (!client) {
      return undefined;
    }

    // Parse the raw connection value with zod rather than reading sub-keys
    // through the config reader, because the config reader's fallback chain
    // throws when a lower-priority config file has connection as a string.
    const rawConnection = config.getOptional('backend.database.connection');
    const connectionResult = connectionSchema.safeParse(rawConnection);
    const connection = connectionResult.success
      ? connectionResult.data
      : undefined;

    return { client, connection };
  } finally {
    config.close();
  }
}
