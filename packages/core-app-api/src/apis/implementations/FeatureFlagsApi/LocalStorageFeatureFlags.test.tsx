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

import { LocalStorageFeatureFlags } from './LocalStorageFeatureFlags';
import { FeatureFlagState, FeatureFlagsApi } from '@backstage/core-plugin-api';

describe('FeatureFlags', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe('getFlags', () => {
    let featureFlags: FeatureFlagsApi;

    beforeEach(() => {
      featureFlags = new LocalStorageFeatureFlags();
    });

    it('returns no flags', () => {
      expect(featureFlags.getRegisteredFlags()).toEqual([]);
    });

    it('loads flags from local storage', () => {
      window.localStorage.setItem(
        'featureFlags',
        JSON.stringify({
          'feature-flag-one': 1,
          'feature-flag-two': 1,
          'feature-flag-three': 0,
          'feature-flag-four': 2,
          'feature-flag-five': 'not-valid',
        }),
      );

      expect(featureFlags.isActive('feature-flag-one')).toBe(true);
      expect(featureFlags.isActive('feature-flag-two')).toBe(true);
      expect(featureFlags.isActive('feature-flag-three')).toBe(false);
      expect(featureFlags.isActive('feature-flag-four')).toBe(false);
      expect(featureFlags.isActive('feature-flag-five')).toBe(false);
    });

    it('sets the correct values', () => {
      featureFlags.save({
        states: {
          'feature-flag-zero': FeatureFlagState.Active,
        },
      });

      expect(featureFlags.isActive('feature-flag-zero')).toBe(true);
      expect(window.localStorage.getItem('featureFlags')).toEqual(
        '{"feature-flag-zero":1}',
      );
    });

    it('deletes the correct values', () => {
      window.localStorage.setItem(
        'featureFlags',
        JSON.stringify({
          'feature-flag-one': 1,
          'feature-flag-two': 0,
          'feature-flag-tree': 1,
          'feature-flag-four': 0,
        }),
      );

      featureFlags.save({
        states: {
          'feature-flag-one': FeatureFlagState.None,
          'feature-flag-two': FeatureFlagState.Active,
        },
      });

      expect(window.localStorage.getItem('featureFlags')).toEqual(
        '{"feature-flag-two":1}',
      );
    });

    it('clears all values', () => {
      window.localStorage.setItem(
        'featureFlags',
        JSON.stringify({
          'feature-flag-one': 1,
          'feature-flag-two': 1,
          'feature-flag-three': 0,
        }),
      );

      expect(featureFlags.isActive('feature-flag-one')).toBe(true);
      expect(featureFlags.isActive('feature-flag-two')).toBe(true);
      expect(featureFlags.isActive('feature-flag-three')).toBe(false);

      featureFlags.save({ states: {} });

      expect(featureFlags.isActive('feature-flag-one')).toBe(false);
      expect(featureFlags.isActive('feature-flag-two')).toBe(false);
      expect(featureFlags.isActive('feature-flag-three')).toBe(false);

      expect(window.localStorage.getItem('featureFlags')).toEqual('{}');
    });
  });

  describe('getRegisteredFlags', () => {
    let featureFlags: FeatureFlagsApi;

    beforeEach(() => {
      featureFlags = new LocalStorageFeatureFlags();
      featureFlags.registerFlag({
        name: 'registered-flag-1',
        pluginId: 'plugin-one',
      });
      featureFlags.registerFlag({
        name: 'registered-flag-2',
        pluginId: 'plugin-one',
      });
      featureFlags.registerFlag({
        name: 'registered-flag-3',
        pluginId: 'plugin-two',
      });
    });

    it('should return an empty list', () => {
      featureFlags = new LocalStorageFeatureFlags();
      expect(featureFlags.getRegisteredFlags()).toEqual([]);
    });

    it('should return an valid list', () => {
      expect(featureFlags.getRegisteredFlags()).toEqual([
        { name: 'registered-flag-1', pluginId: 'plugin-one' },
        { name: 'registered-flag-2', pluginId: 'plugin-one' },
        { name: 'registered-flag-3', pluginId: 'plugin-two' },
      ]);
    });

    it('should provide a copy of the list of flags', () => {
      const flags = featureFlags.getRegisteredFlags();
      expect(flags).toEqual([
        { name: 'registered-flag-1', pluginId: 'plugin-one' },
        { name: 'registered-flag-2', pluginId: 'plugin-one' },
        { name: 'registered-flag-3', pluginId: 'plugin-two' },
      ]);
      flags.splice(2, 1);
      expect(flags).toEqual([
        { name: 'registered-flag-1', pluginId: 'plugin-one' },
        { name: 'registered-flag-2', pluginId: 'plugin-one' },
      ]);
      expect(featureFlags.getRegisteredFlags()).toEqual([
        { name: 'registered-flag-1', pluginId: 'plugin-one' },
        { name: 'registered-flag-2', pluginId: 'plugin-one' },
        { name: 'registered-flag-3', pluginId: 'plugin-two' },
      ]);
    });

    it('should get the correct values', () => {
      const getByName = (name: string) =>
        featureFlags.getRegisteredFlags().find(flag => flag.name === name);

      expect(getByName('registered-flag-0')).toBeUndefined();
      expect(getByName('registered-flag-1')).toEqual({
        name: 'registered-flag-1',
        pluginId: 'plugin-one',
      });
      expect(getByName('registered-flag-2')).toEqual({
        name: 'registered-flag-2',
        pluginId: 'plugin-one',
      });
      expect(getByName('registered-flag-3')).toEqual({
        name: 'registered-flag-3',
        pluginId: 'plugin-two',
      });
    });

    it('throws an error if length is less than three characters', () => {
      expect(() =>
        featureFlags.registerFlag({
          name: 'ab',
          pluginId: 'plugin-three',
        }),
      ).toThrow(/minimum length of three characters/i);
    });

    it('throws an error if length is greater than 150 characters', () => {
      expect(() =>
        featureFlags.registerFlag({
          name:
            'loremipsumdolorsitametconsecteturadipiscingelitnuncvitaeportaexaullamcorperturpismaurisutmattisnequemorbisediaculisauguevivamuspulvinarcursuseratblandithendreritquisqueuttinciduntmagnavestibulumblanditaugueat',
          pluginId: 'plugin-three',
        }),
      ).toThrow(/not exceed 150 characters/i);
    });

    it('throws an error if name does not start with a lowercase letter', () => {
      expect(() =>
        featureFlags.registerFlag({
          name: '123456789',
          pluginId: 'plugin-three',
        }),
      ).toThrow(/start with a lowercase letter/i);
    });

    it('throws an error if name contains characters other than lowercase letters, numbers and hyphens', () => {
      expect(() =>
        featureFlags.registerFlag({
          name: 'Invalid_Feature_Flag',
          pluginId: 'plugin-three',
        }),
      ).toThrow(/only contain lowercase letters, numbers and hyphens/i);
    });
  });
});
