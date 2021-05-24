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
  await knex.schema.createTable('entities_attachments', table => {
    table.comment('Binary attachments to a entity');
    table
      .text('originating_entity_id')
      .references('id')
      .inTable('entities')
      .onDelete('CASCADE')
      .notNullable()
      .index('originating_entity_id_idx')
      .comment('The uid of the related entity');
    table
      .text('key')
      .notNullable()
      .comment('The name of the attachment, unique for a single entity');
    table
      .binary('data')
      .notNullable()
      .comment('The binary data of the attachment');
    table
      .text('content_type')
      .notNullable()
      .comment('The content type of the attachment for serving over HTTP');
    table
      .string('etag')
      .notNullable()
      .comment('A hash of the attachment and its metadata.');
    table.primary(['originating_entity_id', 'key']);
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('entities_attachments', table => {
    table.dropIndex(['originating_entity_id', 'key']);
    table.dropIndex([], 'originating_entity_id_idx');
  });
  await knex.schema.dropTable('entities_attachments');
};
