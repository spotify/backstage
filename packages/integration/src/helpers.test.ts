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

import { defaultScmResolveUrl, isValidHost } from './helpers';

describe('isValidHost', () => {
  it.each([
    ['example.com', true],
    ['foo', true],
    ['foo:1', true],
    ['foo:10000', true],
    ['foo.bar', true],
    ['foo.bar.baz', true],
    ['1.2.3.4', true],
    ['[::]', true],
    ['[::1]', true],
    ['[1:2:3:4:5:6:7:8]', true],
    ['1.2.3.4.5.6.7.8', true],
    ['https://example.com', false],
    ['foo:100000', false],
    ['FOO', false],
    ['Foo', false],
    ['foo/bar', false],
    ['//foo', false],
    ['foo:bar', false],
    ['foo?', false],
    ['foo?bar', false],
    ['foo#', false],
    ['foo#bar', false],
    ['::', false],
    ['::1', false],
    ['1:2:3:4:5:6:7:8', false],
    ['???????', false],
    ['€&()=)&(', false],
    ['höst', false],
    ['πœπœﬁπœ', false],
  ])('Should check whether %s is a valid host', (str, expected) => {
    expect(isValidHost(str)).toBe(expected);
  });
});

describe('defaultScmResolveUrl', () => {
  it('works for relative paths and retains query params', () => {
    expect(
      defaultScmResolveUrl({
        url: './b.yaml',
        base:
          'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/a.yaml',
      }),
    ).toBe(
      'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/b.yaml',
    );

    expect(
      defaultScmResolveUrl({
        url: './b.yaml',
        base:
          'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/a.yaml?at=master',
      }),
    ).toBe(
      'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/b.yaml?at=master',
    );

    expect(
      defaultScmResolveUrl({
        url: 'b.yaml',
        base:
          'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/a.yaml',
      }),
    ).toBe(
      'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/b.yaml',
    );
  });

  it('works for absolute paths and retains query params', () => {
    expect(
      defaultScmResolveUrl({
        url: '/other/b.yaml',
        base:
          'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/a.yaml',
      }),
    ).toBe(
      'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/other/b.yaml',
    );

    expect(
      defaultScmResolveUrl({
        url: '/other/b.yaml',
        base:
          'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/a.yaml?at=master',
      }),
    ).toBe(
      'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/other/b.yaml?at=master',
    );
  });

  it('works in various situations with line numbers', () => {
    expect(
      defaultScmResolveUrl({
        url: './b.yaml',
        base:
          'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/a.yaml?at=master',
        lineNumber: 11,
      }),
    ).toBe(
      'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/b.yaml?at=master#L11',
    );

    expect(
      defaultScmResolveUrl({
        url: 'b.yaml',
        base:
          'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/a.yaml',
        lineNumber: 12,
      }),
    ).toBe(
      'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/b.yaml#L12',
    );

    expect(
      defaultScmResolveUrl({
        url: '/other/b.yaml',
        base:
          'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/a.yaml',
        lineNumber: 13,
      }),
    ).toBe(
      'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/other/b.yaml#L13',
    );

    expect(
      defaultScmResolveUrl({
        url: '/other/b.yaml',
        base:
          'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/a.yaml?at=master',
        lineNumber: 14,
      }),
    ).toBe(
      'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/other/b.yaml?at=master#L14',
    );
  });

  it('works for full urls and throws away query params', () => {
    expect(
      defaultScmResolveUrl({
        url: 'https://b.com/b.yaml',
        base:
          'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/folder/a.yaml?at=master',
      }),
    ).toBe('https://b.com/b.yaml');
  });
});
