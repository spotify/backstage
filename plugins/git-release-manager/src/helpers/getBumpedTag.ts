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

import { CalverTagParts } from './tagParts/getCalverTagParts';
import { getTagParts } from './tagParts/getTagParts';
import { isCalverTagParts } from './isCalverTagParts';
import { Project } from '../contexts/ProjectContext';
import { SEMVER_PARTS } from '../constants/constants';
import { SemverTagParts } from './tagParts/getSemverTagParts';

export function getBumpedTag({
  project,
  tag,
  bumpLevel,
}: {
  project: Project;
  tag: string;
  bumpLevel: keyof typeof SEMVER_PARTS;
}) {
  const tagParts = getTagParts({ project, tag });

  if (tagParts.error !== undefined) {
    return {
      error: tagParts.error,
    };
  }

  if (isCalverTagParts(project, tagParts.tagParts)) {
    return getPatchedCalverTag(tagParts.tagParts);
  }

  return getBumpedSemverTag(tagParts.tagParts, bumpLevel);
}

function getPatchedCalverTag(tagParts: CalverTagParts) {
  const bumpedTagParts: CalverTagParts = {
    ...tagParts,
    patch: tagParts.patch + 1,
  };
  const bumpedTag = `${bumpedTagParts.prefix}-${bumpedTagParts.calver}_${bumpedTagParts.patch}`;

  return {
    bumpedTag,
    tagParts: bumpedTagParts,
    error: undefined,
  };
}

function getBumpedSemverTag(
  tagParts: SemverTagParts,
  semverBumpLevel: keyof typeof SEMVER_PARTS,
) {
  const { bumpedTagParts } = getBumpedSemverTagParts(tagParts, semverBumpLevel);

  const bumpedTag = `${bumpedTagParts.prefix}-${bumpedTagParts.major}.${bumpedTagParts.minor}.${bumpedTagParts.patch}`;

  return {
    bumpedTag,
    tagParts: bumpedTagParts,
    error: undefined,
  };
}

export function getBumpedSemverTagParts(
  tagParts: SemverTagParts,
  semverBumpLevel: keyof typeof SEMVER_PARTS,
) {
  const bumpedTagParts = {
    ...tagParts,
  };

  if (semverBumpLevel === 'major') {
    bumpedTagParts.major = bumpedTagParts.major + 1;
    bumpedTagParts.minor = 0;
    bumpedTagParts.patch = 0;
  }

  if (semverBumpLevel === 'minor') {
    bumpedTagParts.minor = bumpedTagParts.minor + 1;
    bumpedTagParts.patch = 0;
  }

  if (semverBumpLevel === 'patch') {
    bumpedTagParts.patch = bumpedTagParts.patch + 1;
  }

  return {
    bumpedTagParts,
  };
}
