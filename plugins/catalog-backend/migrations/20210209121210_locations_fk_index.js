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

// @ts-check

/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  if (knex.client.config.client !== 'sqlite3') {
    await knex.schema.alterTable('entities', table => {
      table.index('location_id', 'entity_location_id_idx');
    });
    await knex.schema.alterTable('location_update_log', table => {
      table.index('location_id', 'update_log_location_id_idx');
    });
  }
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  if (knex.client.config.client !== 'sqlite3') {
    await knex.schema.alterTable('entities', table => {
      table.dropIndex([], 'entity_location_id_idx');
    });
    await knex.schema.alterTable('location_update_log', table => {
      table.dropIndex([], 'update_log_location_id_idx');
    });
  }
};
