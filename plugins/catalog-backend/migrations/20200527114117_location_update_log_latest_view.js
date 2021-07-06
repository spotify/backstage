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
  // Get list sorted by created_at timestamp in descending order
  // Grouped by location_id
  return knex.schema.raw(`
    CREATE VIEW location_update_log_latest AS
    SELECT t1.* FROM location_update_log t1
    JOIN
    (
       SELECT location_id, MAX(created_at) AS MAXDATE
       FROM location_update_log
       GROUP BY location_id
    ) t2
    ON t1.location_id = t2.location_id
    AND t1.created_at = t2.MAXDATE
    ORDER BY created_at DESC;
  `);
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  return knex.schema.raw(`DROP VIEW location_update_log_latest;`);
};
