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
  await knex.schema.alterTable('entities', table => {
    table.dropColumn('api_version');
    table.dropColumn('kind');
    table.dropColumn('name');
    table.dropColumn('namespace');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('entities', table => {
    table
      .string('api_version')
      .notNullable()
      .comment('The apiVersion field of the entity');
    table.string('kind').notNullable().comment('The kind field of the entity');
    table
      .string('name')
      .nullable()
      .comment('The metadata.name field of the entity');
    table
      .string('namespace')
      .nullable()
      .comment('The metadata.namespace field of the entity');
  });
};
