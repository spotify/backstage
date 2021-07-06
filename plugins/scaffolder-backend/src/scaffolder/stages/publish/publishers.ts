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

import { Config } from '@backstage/config';
import { PublisherBase, PublisherBuilder } from './types';
import {
  GithubPublisher,
  RepoVisibilityOptions as GithubRepoVisibilityOptions,
} from './github';
import {
  GitlabPublisher,
  RepoVisibilityOptions as GitlabRepoVisibilityOptions,
} from './gitlab';
import { AzurePublisher } from './azure';
import {
  BitbucketPublisher,
  RepoVisibilityOptions as BitbucketRepoVisibilityOptions,
} from './bitbucket';
import { Logger } from 'winston';
import { ScmIntegrations } from '@backstage/integration';

export class Publishers implements PublisherBuilder {
  private publisherMap = new Map<string, PublisherBase | undefined>();

  register(host: string, preparer: PublisherBase | undefined) {
    this.publisherMap.set(host, preparer);
  }

  get(url: string): PublisherBase {
    const preparer = this.publisherMap.get(new URL(url).host);
    if (!preparer) {
      throw new Error(
        `Unable to find a publisher for URL: ${url}. Please make sure to register this host under an integration in app-config`,
      );
    }
    return preparer;
  }

  static async fromConfig(
    config: Config,
    _options: { logger: Logger },
  ): Promise<PublisherBuilder> {
    const publishers = new Publishers();

    const scm = ScmIntegrations.fromConfig(config);

    for (const integration of scm.azure.list()) {
      const publisher = await AzurePublisher.fromConfig(integration.config);
      if (publisher) {
        publishers.register(integration.config.host, publisher);
      }
    }

    for (const integration of scm.github.list()) {
      const repoVisibility = (config.getOptionalString(
        'scaffolder.github.visibility',
      ) ?? 'public') as GithubRepoVisibilityOptions;

      const publisher = await GithubPublisher.fromConfig(integration.config, {
        repoVisibility,
      });
      if (publisher) {
        publishers.register(integration.config.host, publisher);
      }
    }

    for (const integration of scm.gitlab.list()) {
      const repoVisibility = (config.getOptionalString(
        'scaffolder.gitlab.visibility',
      ) ?? 'public') as GitlabRepoVisibilityOptions;

      const publisher = await GitlabPublisher.fromConfig(integration.config, {
        repoVisibility,
      });

      if (publisher) {
        publishers.register(integration.config.host, publisher);
      }
    }

    for (const integration of scm.bitbucket.list()) {
      const repoVisibility = (config.getOptionalString(
        'scaffolder.bitbucket.visibility',
      ) ?? 'public') as BitbucketRepoVisibilityOptions;

      const publisher = await BitbucketPublisher.fromConfig(
        integration.config,
        {
          repoVisibility,
        },
      );

      if (publisher) {
        publishers.register(integration.config.host, publisher);
      }
    }

    return publishers;
  }
}
