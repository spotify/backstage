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
import { validate, getInitialPageState } from './history';

describe('getInitialPageState', () => {
  describe('groups', () => {
    it('should set defaults if params or group is not provided', () => {
      const initialState = getInitialPageState([]);
      expect(initialState.group).toBe(null);
    });

    it('should set defaults if a group is fetched but no group is present on query params', () => {
      const initialState = getInitialPageState([{ id: 'group' }]);
      expect(initialState.group).toMatch(/group/);
    });

    it('group param should always override fetched group', () => {
      const initialState = getInitialPageState(
        [{ id: 'group' }, { id: 'second-group' }],
        { group: 'other-group' },
      );
      expect(initialState.group).toMatch(/other-group/);
    });

    it('first group should be set as default group if user belongs to multiple groups', () => {
      const initialState = getInitialPageState([
        { id: 'group' },
        { id: 'other-group' },
      ]);
      expect(initialState.group).toMatch(/group/);
    });
  });

  describe('projects', () => {
    it("should set defaults if project param doesn't exist", () => {
      const initialState = getInitialPageState([], {});
      expect(initialState.project).toBeNull();
    });

    it('should override defaults if project param exists', () => {
      const initialState = getInitialPageState([], { project: 'some-project' });
      expect(initialState.project).toMatch(/some-project/);
    });
  });
});

describe.each`
  params                                              | expected
  ${''}                                               | ${{}}
  ${'?foo=bar'}                                       | ${{}}
  ${'?group'}                                         | ${{ group: null }}
  ${'?project'}                                       | ${{ project: null }}
  ${'?project&group'}                                 | ${{ group: null, project: null }}
  ${'?group=some-group'}                              | ${{ group: 'some-group' }}
  ${'?group=some-group&project'}                      | ${{ group: 'some-group', project: null }}
  ${'?group=some-group&project=some-project'}         | ${{ group: 'some-group', project: 'some-project' }}
  ${'?group=some-group&project=some-project&foo=bar'} | ${{ group: 'some-group', project: 'some-project' }}
`('validate', ({ params, expected }) => {
  it(`should validate ${params}`, async () => {
    const pageFilters = await validate(params);
    expect(pageFilters).toMatchObject(expected);
  });
});
