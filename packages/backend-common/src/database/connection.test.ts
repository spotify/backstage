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

import { ConfigReader } from '@backstage/config';
import { createDatabaseClient } from './connection';

describe('database connection', () => {
  describe('createDatabaseClient', () => {
    it('returns a postgres connection', () => {
      expect(
        createDatabaseClient(
          new ConfigReader({
            client: 'pg',
            connection: {
              host: 'acme',
              user: 'foo',
              password: 'bar',
              database: 'foodb',
            },
          }),
        ),
      ).toBeTruthy();
    });

    it('returns an sqlite connection', () => {
      expect(
        createDatabaseClient(
          new ConfigReader({
            client: 'sqlite3',
            connection: ':memory:',
          }),
        ),
      ).toBeTruthy();
    });

    it('returns a mysql connection', () => {
      expect(() =>
        createDatabaseClient(
          new ConfigReader({
            client: 'mysql2',
            connection: {
              host: '127.0.0.1',
              user: 'foo',
              password: 'bar',
              database: 'dbname',
            },
          }),
        ),
      ).toBeTruthy();
    });

    it('accepts overrides', () => {
      expect(
        createDatabaseClient(
          new ConfigReader({
            client: 'pg',
            connection: {
              host: 'acme',
              user: 'foo',
              password: 'bar',
              database: 'foodb',
            },
          }),
          {
            connection: {
              database: 'foo',
            },
          },
        ),
      ).toBeTruthy();
    });

    it('throws an error without a client', () => {
      expect(() =>
        createDatabaseClient(
          new ConfigReader({
            connection: '',
          }),
        ),
      ).toThrowError();
    });

    it('throws an error without a connection', () => {
      expect(() =>
        createDatabaseClient(
          new ConfigReader({
            client: 'pg',
          }),
        ),
      ).toThrowError();
    });
  });
});
