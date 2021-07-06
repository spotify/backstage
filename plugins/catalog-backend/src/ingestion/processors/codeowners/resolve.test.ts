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

import { normalizeCodeOwner, resolveCodeOwner } from './resolve';

const mockCodeOwnersText = () => `
*       @acme/team-foo @acme/team-bar
/docs   @acme/team-bar
`;

describe('resolveCodeOwner', () => {
  it('should parse the codeowners file', () => {
    expect(resolveCodeOwner(mockCodeOwnersText())).toBe('team-foo');
  });
});

describe('normalizeCodeOwner', () => {
  it('should remove the @ symbol', () => {
    expect(normalizeCodeOwner('@yoda')).toBe('yoda');
  });

  it('should remove org from org/team format', () => {
    expect(normalizeCodeOwner('@acme/foo')).toBe('foo');
  });

  it('should return username from email format', () => {
    expect(normalizeCodeOwner('foo@acme.com')).toBe('foo');
  });

  it.each([['acme/foo'], ['dacme/foo']])(
    'should return string everything else',
    owner => {
      expect(normalizeCodeOwner(owner)).toBe(owner);
    },
  );
});
