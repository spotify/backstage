/*
 * Copyright 2021 The Backstage Authors
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
import { defaultRepositoryParser } from './BitbucketRepositoryParser';
import { results } from '../index';
import { getVoidLogger } from '@backstage/backend-common';
import { BitbucketIntegration } from '@backstage/integration';

describe('BitbucketRepositoryParser', () => {
  describe('defaultRepositoryParser', () => {
    it('emits location', async () => {
      const browseUrl =
        'https://bitbucket.mycompany.com/projects/project-key/repos/repo-slug/browse';
      const path = '/catalog-info.yaml';
      const expected = [
        results.location(
          {
            type: 'url',
            target: `${browseUrl}${path}`,
          },
          true,
        ),
      ];
      const actual = await defaultRepositoryParser({
        integration: {} as BitbucketIntegration,
        target: `${browseUrl}${path}`,
        logger: getVoidLogger(),
      });

      let i = 0;
      for await (const entity of actual) {
        expect(entity).toStrictEqual(expected[i]);
        i++;
      }
    });
  });
});
