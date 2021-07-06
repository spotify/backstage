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

import { DatabaseManager } from '../database';
import { DatabaseLocationsCatalog } from './DatabaseLocationsCatalog';

const bootstrapLocation = {
  id: expect.any(String),
  type: 'bootstrap',
  target: 'bootstrap',
};

describe('DatabaseLocationsCatalog', () => {
  let catalog: DatabaseLocationsCatalog;

  beforeEach(async () => {
    const db = await DatabaseManager.createTestDatabase();
    catalog = new DatabaseLocationsCatalog(db);
  });

  it('can add a location', async () => {
    const location = {
      id: 'dd12620d-0436-422f-93bd-929aa0788123',
      type: 'valid_type',
      target: 'valid_target',
    };
    await expect(catalog.addLocation(location)).resolves.toEqual(location);
    await expect(
      catalog.location('dd12620d-0436-422f-93bd-929aa0788123'),
    ).resolves.toEqual(expect.objectContaining({ data: location }));
    await expect(catalog.locations()).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ data: location }),
        expect.objectContaining({ data: bootstrapLocation }),
      ]),
    );
  });

  it('does not return duplicates of rows because of logs', async () => {
    const location1 = {
      id: 'dd12620d-0436-422f-93bd-929aa0788123',
      type: 'valid_type',
      target: 'valid_target1',
    };
    const location2 = {
      id: '1a89c479-1a33-4f27-8927-6090ba488c42',
      type: 'valid_type',
      target: 'valid_target2',
    };
    await expect(catalog.addLocation(location1)).resolves.toEqual(location1);
    await expect(catalog.addLocation(location2)).resolves.toEqual(location2);
    await expect(
      catalog.logUpdateSuccess(location1.id),
    ).resolves.toBeUndefined();
    await expect(
      catalog.logUpdateSuccess(location1.id),
    ).resolves.toBeUndefined();
    const locations = await catalog.locations();
    expect(locations.length).toBe(3);
    expect(locations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ data: location1 }),
        expect.objectContaining({ data: location2 }),
        expect.objectContaining({ data: bootstrapLocation }),
      ]),
    );
  });
});
