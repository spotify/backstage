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
import { Entity, LocationSpec } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import {
  ScmIntegrationRegistry,
  ScmIntegrations,
} from '@backstage/integration';
import parseGitUrl from 'git-url-parse';
import { identity, merge, pickBy } from 'lodash';
import { CatalogProcessor } from './types';

const GITHUB_ACTIONS_ANNOTATION = 'github.com/project-slug';

export class AnnotateScmSlugEntityProcessor implements CatalogProcessor {
  constructor(
    private readonly opts: { scmIntegrationRegistry: ScmIntegrationRegistry },
  ) {}

  static fromConfig(config: Config): AnnotateScmSlugEntityProcessor {
    return new AnnotateScmSlugEntityProcessor({
      scmIntegrationRegistry: ScmIntegrations.fromConfig(config),
    });
  }

  async preProcessEntity(
    entity: Entity,
    location: LocationSpec,
  ): Promise<Entity> {
    if (entity.kind !== 'Component' || location.type !== 'url') {
      return entity;
    }

    const scmIntegration = this.opts.scmIntegrationRegistry.byUrl(
      location.target,
    );

    if (!scmIntegration || scmIntegration.type !== 'github') {
      return entity;
    }

    const gitUrl = parseGitUrl(location.target);
    let githubProjectSlug =
      entity.metadata.annotations?.[GITHUB_ACTIONS_ANNOTATION];

    if (!githubProjectSlug) {
      githubProjectSlug = `${gitUrl.owner}/${gitUrl.name}`;
    }

    return merge(
      {
        metadata: {
          annotations: pickBy(
            {
              [GITHUB_ACTIONS_ANNOTATION]: githubProjectSlug,
            },
            identity,
          ),
        },
      },
      entity,
    );
  }
}
