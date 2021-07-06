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

import { createContext, useContext } from 'react';

import { VERSIONING_STRATEGIES } from '../constants/constants';
import { GitReleaseManagerError } from '../errors/GitReleaseManagerError';

export interface Project {
  /**
   * Repository's owner (user or organisation)
   *
   * @example erikengervall
   */
  owner: string;
  /**
   * Repository's name
   *
   * @example dockest
   */
  repo: string;
  /**
   * Declares the versioning strategy of the project
   *
   * semver: `1.2.3` (major.minor.patch)
   * calver: `2020.01.01_0` (YYYY.0M.0D_patch)
   *
   * Default: false
   */
  versioningStrategy: keyof typeof VERSIONING_STRATEGIES;
  /**
   * Project props was provided via props
   *
   * If true, this means select inputs will be disabled
   */
  isProvidedViaProps: boolean;
}

export const ProjectContext = createContext<{ project: Project } | undefined>(
  undefined,
);

export const useProjectContext = () => {
  const { project } = useContext(ProjectContext) ?? {};

  if (!project) {
    throw new GitReleaseManagerError('project not found');
  }

  return {
    project,
  };
};
