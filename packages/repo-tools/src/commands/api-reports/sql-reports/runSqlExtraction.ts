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

import fs, { readJson } from 'fs-extra';
import { relative as relativePath } from 'node:path';
import { targetPaths } from '@backstage/cli-common';
import { diff as justDiff } from 'just-diff';
import { SchemaInfo } from './types';
import { getPgSchemaInfo } from './getPgSchemaInfo';
import { generateSqlReport } from './generateSqlReport';
import type { Knex } from 'knex';
import {
  logApiReportInstructions,
  logReportDiff,
  tryRunPrettierAsync,
} from '../common';

interface SqlExtractionOptions {
  packageDirs: string[];
  isLocalBuild: boolean;
}

export async function runSqlExtraction(options: SqlExtractionOptions) {
  const { default: Knex } = await import('knex');
  const { default: ClientPgLite } = await import('knex-pglite');

  // Since we're passing this as the client we need to replace the `config.client` with `pg` afterwards
  class WrappedClientPgLite extends ClientPgLite {
    constructor(config: any) {
      super({ ...config, client: 'pg' });
    }
  }

  let dbIndex = 1;

  for (const packageDir of options.packageDirs) {
    const migrationDir = targetPaths.resolveWorkspaceRoot(
      packageDir,
      'migrations',
    );
    if (!(await fs.pathExists(migrationDir))) {
      console.log(`No SQL migrations found in ${packageDir}`);
      continue;
    }

    const { name: pkgName } = await readJson(
      targetPaths.resolveWorkspaceRoot(packageDir, 'package.json'),
    );

    const migrationFiles = await fs.readdir(migrationDir, {
      withFileTypes: true,
    });

    const migrationTargets = migrationFiles
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);
    if (migrationFiles.some(entry => entry.isFile())) {
      migrationTargets.push('.');
    }

    for (const migrationTarget of migrationTargets) {
      const database = `extractor-${dbIndex++}`;

      const knex = Knex({
        client: WrappedClientPgLite,
        dialect: 'postgres',
        connection: {
          database,
        },
      });

      await knex.raw('CREATE DATABASE ??', [database]);

      await runSingleSqlExtraction(
        packageDir,
        migrationTarget,
        pkgName,
        knex,
        options,
      );
    }
  }
}

async function runSingleSqlExtraction(
  targetDir: string,
  migrationTarget: string,
  pkgName: string,
  knex: Knex,
  options: SqlExtractionOptions,
) {
  const migrationDir = targetPaths.resolveWorkspaceRoot(
    targetDir,
    'migrations',
    migrationTarget,
  );

  const reportName =
    migrationTarget === '.' ? pkgName : `${pkgName}/${migrationTarget}`;

  console.log(`Generating SQL report for ${reportName}`);

  const migrationsListResult = await knex.migrate.list({
    directory: migrationDir,
  });
  const migrations: string[] = migrationsListResult[1].map(
    (m: { file: string }) => m.file,
  );

  const schemaInfoBeforeMigration = new Map<string, SchemaInfo>();

  for (const migration of migrations) {
    const schemaInfo = await getPgSchemaInfo(knex);
    schemaInfoBeforeMigration.set(migration, schemaInfo);

    await knex.migrate.up({
      directory: migrationDir,
      name: migration,
    });
  }

  const schemaInfo = await getPgSchemaInfo(knex);

  let failedDownMigration: string | undefined = undefined;
  for (const migration of migrations.toReversed()) {
    await knex.migrate.down({
      directory: migrationDir,
      name: migration,
    });
    const after = await getPgSchemaInfo(knex);
    const before = schemaInfoBeforeMigration.get(migration);
    if (!before) {
      throw new Error(`No previous result for migration ${migration}`);
    }

    const diff = justDiff(before, after);
    if (diff.length !== 0) {
      console.log(
        `Migration ${migration} is not reversible: ${JSON.stringify(
          diff,
          null,
          2,
        )}`,
      );
      failedDownMigration = migration;
      break;
    }
  }
  const reportPath = targetPaths.resolveWorkspaceRoot(
    targetDir,
    `report${migrationTarget === '.' ? '' : `-${migrationTarget}`}.sql.md`,
  );
  const report = await tryRunPrettierAsync(
    generateSqlReport({
      reportName,
      failedDownMigration,
      schemaInfo,
    }),
    { filepath: reportPath },
  );

  const existingReport = await fs.readFile(reportPath, 'utf8').catch(error => {
    if (error.code === 'ENOENT') {
      return undefined;
    }
    throw error;
  });
  if (existingReport !== report) {
    if (options.isLocalBuild) {
      console.warn(`SQL report changed for ${targetDir}`);
      await fs.writeFile(reportPath, report);
    } else {
      logApiReportInstructions();

      logReportDiff(
        relativePath(targetPaths.workspaceRootDir, reportPath),
        existingReport,
        report,
      );

      logApiReportInstructions();
      throw new Error(`Report ${reportPath} is out of date`);
    }
  }
}
