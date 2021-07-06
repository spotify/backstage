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
  // Adds a single 'bootstrap' location that can be used to trigger work in processors.
  // This is primarily here to fulfill foreign key constraints.
  await knex('locations').insert({
    id: require('uuid').v4(),
    type: 'bootstrap',
    target: 'bootstrap',
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex('locations')
    .where({
      type: 'bootstrap',
      target: 'bootstrap',
    })
    .del();
};
