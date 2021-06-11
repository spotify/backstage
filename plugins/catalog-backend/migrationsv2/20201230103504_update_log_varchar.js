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
  if (knex.client.config.client !== 'sqlite3') {
    // We actually just want to widen columns, but can't do that while a
    // view is dependent on them - so we just reconstruct it exactly as it was
    await knex.schema
      .raw('DROP VIEW location_update_log_latest;')
      .alterTable('location_update_log', table => {
        table.text('message').alter();
        table.text('entity_name').nullable().alter();
      }).raw(`
        CREATE VIEW location_update_log_latest AS
        SELECT t1.* FROM location_update_log t1
        JOIN
        (
          SELECT location_id, MAX(id) AS MAXID
          FROM location_update_log
          GROUP BY location_id
        ) t2
        ON t1.location_id = t2.location_id
        AND t1.id = t2.MAXID
        GROUP BY t1.location_id, t1.id
        ORDER BY created_at DESC;
      `);
  }
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  if (knex.client.config.client !== 'sqlite3') {
    await knex.schema
      .raw('DROP VIEW location_update_log_latest;')
      .alterTable('location_update_log', table => {
        table.string('message').alter();
        table.string('entity_name').nullable().alter();
      }).raw(`
        CREATE VIEW location_update_log_latest AS
        SELECT t1.* FROM location_update_log t1
        JOIN
        (
          SELECT location_id, MAX(id) AS MAXID
          FROM location_update_log
          GROUP BY location_id
        ) t2
        ON t1.location_id = t2.location_id
        AND t1.id = t2.MAXID
        GROUP BY t1.location_id, t1.id
        ORDER BY created_at DESC;
      `);
  }
};
