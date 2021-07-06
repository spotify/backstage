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

import { extractInitials, stringToColor } from './utils';

describe('stringToColor', () => {
  it('extract color', async () => {
    expect(stringToColor('Jenny Doe')).toEqual('#7809fa');
  });
});

describe('extractInitials', () => {
  it('extract initials', async () => {
    expect(extractInitials('Jenny Doe')).toEqual('JD');
  });

  it('extract single letter for short name', async () => {
    expect(extractInitials('Doe')).toEqual('D');
  });

  it('limit the initials to two letters', async () => {
    expect(extractInitials('John Jonathan Doe')).toEqual('JJ');
  });
});
