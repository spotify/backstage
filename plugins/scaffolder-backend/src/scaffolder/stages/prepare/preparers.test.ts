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

import { GithubPreparer } from './github';
import { Preparers } from './preparers';

describe('Preparers', () => {
  it('should return the correct preparer based on the hostname', async () => {
    const preparer = await GithubPreparer.fromConfig({
      host: 'github.com',
      apiBaseUrl: 'lols',
      token: 'something else yo',
    });

    const preparers = new Preparers();
    preparers.register('github.com', preparer);

    expect(
      preparers.get('https://github.com/please/find/me/something/from/github'),
    ).toBe(preparer);
  });

  it('should throw an error if there is nothing that will match the url provided', async () => {
    const preparer = await GithubPreparer.fromConfig({
      host: 'github.com',
      apiBaseUrl: 'lols',
      token: 'something else yo',
    });

    const preparers = new Preparers();
    preparers.register('github.com', preparer);

    expect(() => preparers.get('https://404.com')).toThrow(
      `Unable to find a preparer for URL: https://404.com. Please make sure to register this host under an integration in app-config`,
    );
  });
});
