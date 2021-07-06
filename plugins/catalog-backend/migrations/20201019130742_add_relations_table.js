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
  await knex.schema.createTable('entities_relations', table => {
    table.comment('All relations between entities in the catalog');
    table
      .uuid('originating_entity_id')
      .references('id')
      .inTable('entities')
      .onDelete('CASCADE')
      .notNullable()
      .comment('The entity that provided the relation');
    table
      .string('source_full_name')
      .notNullable()
      .comment('The full name of the source entity of the relation');
    table
      .string('type')
      .notNullable()
      .comment('The type of the relation between the entities');
    table
      .string('target_full_name')
      .notNullable()
      .comment('The full name of the target entity of the relation');

    table.primary(['source_full_name', 'type', 'target_full_name']);
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTable('entities_relations');
};
