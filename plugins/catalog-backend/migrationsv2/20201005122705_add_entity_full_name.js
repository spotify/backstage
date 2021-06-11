/*
 * Copyright 2020 Spotify AB
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

// @ts-check

/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.alterTable('entities', table => {
    table.text('full_name').nullable();
  });

  await knex('entities').update({
    full_name: knex.raw(
      "LOWER(kind) || ':' || LOWER(COALESCE(namespace, 'default')) || '/' || LOWER(name)",
    ),
  });

  // SQLite does not support alter column
  if (knex.client.config.client !== 'sqlite3') {
    await knex.schema.alterTable('entities', table => {
      table.text('full_name').notNullable().alter();
    });
  }

  await knex.schema.alterTable('entities', table => {
    // https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/#objectmeta-v1-meta
    table.unique(['full_name'], 'entities_unique_full_name');
    table.dropUnique([], 'entities_unique_name');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('entities', table => {
    // https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/#objectmeta-v1-meta
    table.dropUnique([], 'entities_unique_full_name');
    table.unique(['kind', 'namespace', 'name'], 'entities_unique_name');
  });

  await knex.schema.alterTable('entities_search', table => {
    table.dropColumn('full_name');
  });
};
