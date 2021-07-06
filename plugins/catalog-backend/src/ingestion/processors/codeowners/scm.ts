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

const CODEOWNERS = 'CODEOWNERS';

export const scmCodeOwnersPaths: Record<string, string[]> = {
  // https://mibexsoftware.atlassian.net/wiki/spaces/CODEOWNERS/pages/222822413/Usage
  bitbucket: [CODEOWNERS, `.bitbucket/${CODEOWNERS}`],

  // https://docs.gitlab.com/ee/user/project/code_owners.html#how-to-set-up-code-owners
  gitlab: [CODEOWNERS, `.gitlab/${CODEOWNERS}`, `docs/${CODEOWNERS}`],

  // https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/about-code-owners#codeowners-file-location
  github: [CODEOWNERS, `.github/${CODEOWNERS}`, `docs/${CODEOWNERS}`],
};
