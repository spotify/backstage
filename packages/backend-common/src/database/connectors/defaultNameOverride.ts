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
import { Knex } from 'knex';

/**
 * Provides a partial knex config with database name override.
 *
 * Default override for knex database drivers which accept ConnectionConfig
 * with `connection.database` as the database name field.
 *
 * @param name database name to get config override for
 */
export default function defaultNameOverride(
  name: string,
): Partial<Knex.Config> {
  return {
    connection: {
      database: name,
    },
  };
}
