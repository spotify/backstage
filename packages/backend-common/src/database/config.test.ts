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

import { mergeDatabaseConfig } from './config';

describe('config', () => {
  describe('mergeDatabaseConfig', () => {
    it('does not mutate the input object', () => {
      const input = {
        original: 'key',
      };
      const override = {
        added: 'value',
      };

      mergeDatabaseConfig(input, override);
      expect(input).not.toHaveProperty('added');
    });

    it('does not require overrides', () => {
      expect(
        mergeDatabaseConfig({
          client: 'pg',
          connection: '',
          useNullAsDefault: true,
        }),
      ).toEqual({
        client: 'pg',
        connection: '',
        useNullAsDefault: true,
      });
    });

    it('accepts an empty object', () => {
      expect(
        mergeDatabaseConfig(
          {
            client: 'pg',
            connection: '',
            useNullAsDefault: true,
          },
          {},
        ),
      ).toEqual({
        client: 'pg',
        connection: '',
        useNullAsDefault: true,
      });
    });

    it('does a deep merge', () => {
      expect(
        mergeDatabaseConfig(
          {
            client: 'pg',
            connection: {
              database: 'dbname',
              ssl: {
                ca: 'foo',
              },
            },
          },
          {
            connection: {
              password: 'secret',
              ssl: {
                rejectUnauthorized: true,
              },
            },
            pool: { min: 0, max: 7 },
          },
        ),
      ).toEqual({
        client: 'pg',
        connection: {
          database: 'dbname',
          password: 'secret',
          ssl: {
            rejectUnauthorized: true,
            ca: 'foo',
          },
        },
        pool: { min: 0, max: 7 },
      });
    });

    it('replaces a string connection', () => {
      expect(
        mergeDatabaseConfig(
          {
            client: 'sqlite3',
            connection: ':memory:',
            useNullAsDefault: true,
          },
          {
            connection: {
              filename: '/path/to/file',
            },
          },
        ),
      ).toEqual({
        client: 'sqlite3',
        connection: {
          filename: '/path/to/file',
        },
        useNullAsDefault: true,
      });
    });
  });
});
