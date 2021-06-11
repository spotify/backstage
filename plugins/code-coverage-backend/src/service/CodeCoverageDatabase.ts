/*
 * Copyright 2021 Spotify AB
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
import { resolvePackagePath } from '@backstage/backend-common';
import { NotFoundError } from '@backstage/errors';
import { parseEntityName, stringifyEntityRef } from '@backstage/catalog-model';
import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';
import { aggregateCoverage } from './CoverageUtils';
import { JsonCodeCoverage, JsonCoverageHistory } from './types';

export type RawDbCoverageRow = {
  id: string;
  entity: string;
  coverage: string;
};

export interface CodeCoverageStore {
  insertCodeCoverage(
    coverage: JsonCodeCoverage,
  ): Promise<{ codeCoverageId: string }>;
  getCodeCoverage(entity: string): Promise<JsonCodeCoverage>;
  getHistory(entity: string, limit: number): Promise<JsonCoverageHistory>;
}

const migrationsDir = resolvePackagePath(
  '@backstage/plugin-code-coverage-backend',
  'migrations',
);

export class CodeCoverageDatabase implements CodeCoverageStore {
  static async create(knex: Knex): Promise<CodeCoverageStore> {
    await knex.migrate.latest({
      directory: migrationsDir,
    });
    return new CodeCoverageDatabase(knex);
  }

  constructor(private readonly db: Knex) {}

  async insertCodeCoverage(
    coverage: JsonCodeCoverage,
  ): Promise<{ codeCoverageId: string }> {
    const codeCoverageId = uuid();
    const entity = stringifyEntityRef({
      kind: coverage.entity.kind,
      namespace: coverage.entity.namespace,
      name: coverage.entity.name,
    });

    await this.db<RawDbCoverageRow>('code_coverage').insert({
      id: codeCoverageId,
      entity: entity,
      coverage: JSON.stringify(coverage),
    });

    return { codeCoverageId };
  }

  async getCodeCoverage(entity: string): Promise<JsonCodeCoverage> {
    const [result] = await this.db<RawDbCoverageRow>('code_coverage')
      .where({ entity: entity })
      .orderBy('index', 'desc')
      .limit(1)
      .select();

    if (!result) {
      throw new NotFoundError(
        `No coverage for entity '${JSON.stringify(entity)}' found`,
      );
    }

    try {
      return JSON.parse(result.coverage);
    } catch (error) {
      throw new Error(`Failed to parse coverage for '${entity}', ${error}`);
    }
  }

  async getHistory(
    entity: string,
    limit: number,
  ): Promise<JsonCoverageHistory> {
    const res = await this.db<RawDbCoverageRow>('code_coverage')
      .where({ entity: entity })
      .orderBy('index', 'desc')
      .limit(limit)
      .select();

    const history = res
      .map(r => JSON.parse(r.coverage))
      .map(c => aggregateCoverage(c));

    const entityName = parseEntityName(entity);

    return {
      entity: {
        name: entityName.name,
        kind: entityName.kind,
        namespace: entityName.namespace,
      },
      history: history,
    };
  }
}
