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

import { getCalverTagParts } from './getCalverTagParts';
import { getSemverTagParts } from './getSemverTagParts';
import { Project } from '../../contexts/ProjectContext';

export const validateTagName = ({
  project,
  tagName,
}: {
  project: Project;
  tagName?: string;
}) => {
  if (!tagName) {
    return {
      tagNameError: null,
    };
  }

  if (project.versioningStrategy === 'calver') {
    const { error } = getCalverTagParts(tagName);

    return {
      tagNameError: error,
    };
  }

  const { error } = getSemverTagParts(tagName);

  return {
    tagNameError: error,
  };
};
