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

import createConnection from 'knex';
import { isDockerDisabledForTests } from '../util/isDockerDisabledForTests';
import { startPostgresContainer } from './startPostgresContainer';

const itIfDocker = isDockerDisabledForTests() ? it.skip : it;

describe('startPostgresContainer', () => {
  itIfDocker(
    'successfully launches the container',
    async () => {
      const { stop, ...connection } = await startPostgresContainer(
        'postgres:13',
      );
      const db = createConnection({ client: 'pg', connection });
      try {
        const result = await db.select(db.raw('version()'));
        // eslint-disable-next-line jest/no-standalone-expect
        expect(result[0]?.version).toContain('PostgreSQL');
      } finally {
        await db.destroy();
        await stop();
      }
    },
    60_000,
  );
});
