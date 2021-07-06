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

import { InputError } from '@backstage/errors';
import {
  LOCATION_ANNOTATION,
  parseLocationReference,
  TemplateEntityV1alpha1,
} from '@backstage/catalog-model';
import { posix as posixPath } from 'path';

export type ParsedLocationAnnotation = {
  protocol: 'file' | 'url';
  location: string;
};

export const parseLocationAnnotation = (
  entity: TemplateEntityV1alpha1,
): ParsedLocationAnnotation => {
  const annotation = entity.metadata.annotations?.[LOCATION_ANNOTATION];
  if (!annotation) {
    throw new InputError(
      `No location annotation provided in entity: ${entity.metadata.name}`,
    );
  }

  const { type, target } = parseLocationReference(annotation);
  return {
    protocol: type as 'file' | 'url',
    location: target,
  };
};

export function joinGitUrlPath(repoUrl: string, path?: string): string {
  const parsed = new URL(repoUrl);

  if (parsed.hostname.endsWith('azure.com')) {
    const templatePath = posixPath.normalize(
      posixPath.join(
        posixPath.dirname(parsed.searchParams.get('path') || '/'),
        path || '.',
      ),
    );
    parsed.searchParams.set('path', templatePath);
    return parsed.toString();
  }

  return new URL(path || '.', repoUrl).toString().replace(/\/$/, '');
}
