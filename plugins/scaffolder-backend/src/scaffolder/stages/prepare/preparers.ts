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
import { PreparerBase, PreparerBuilder } from './types';
import { Logger } from 'winston';

import { GitlabPreparer } from './gitlab';
import { AzurePreparer } from './azure';
import { GithubPreparer } from './github';
import { BitbucketPreparer } from './bitbucket';
import { ScmIntegrations } from '@backstage/integration';

export class Preparers implements PreparerBuilder {
  private preparerMap = new Map<string, PreparerBase>();

  register(host: string, preparer: PreparerBase) {
    this.preparerMap.set(host, preparer);
  }

  get(url: string): PreparerBase {
    const preparer = this.preparerMap.get(new URL(url).host);
    if (!preparer) {
      throw new Error(
        `Unable to find a preparer for URL: ${url}. Please make sure to register this host under an integration in app-config`,
      );
    }
    return preparer;
  }

  static async fromConfig(
    config: Config,
    // eslint-disable-next-line
    _: { logger: Logger },
  ): Promise<PreparerBuilder> {
    const preparers = new Preparers();
    const scm = ScmIntegrations.fromConfig(config);
    for (const integration of scm.azure.list()) {
      preparers.register(
        integration.config.host,
        AzurePreparer.fromConfig(integration.config),
      );
    }

    for (const integration of scm.github.list()) {
      preparers.register(
        integration.config.host,
        GithubPreparer.fromConfig(integration.config),
      );
    }

    for (const integration of scm.gitlab.list()) {
      preparers.register(
        integration.config.host,
        GitlabPreparer.fromConfig(integration.config),
      );
    }

    for (const integration of scm.bitbucket.list()) {
      preparers.register(
        integration.config.host,
        BitbucketPreparer.fromConfig(integration.config),
      );
    }

    return preparers;
  }
}
