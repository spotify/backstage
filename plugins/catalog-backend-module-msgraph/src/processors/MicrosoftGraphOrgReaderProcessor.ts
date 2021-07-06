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

import { LocationSpec } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import {
  CatalogProcessor,
  CatalogProcessorEmit,
  results,
} from '@backstage/plugin-catalog-backend';
import { Logger } from 'winston';
import {
  GroupTransformer,
  MicrosoftGraphClient,
  MicrosoftGraphProviderConfig,
  readMicrosoftGraphConfig,
  readMicrosoftGraphOrg,
} from '../microsoftGraph';

/**
 * Extracts teams and users out of a the Microsoft Graph API.
 */
export class MicrosoftGraphOrgReaderProcessor implements CatalogProcessor {
  private readonly providers: MicrosoftGraphProviderConfig[];
  private readonly logger: Logger;
  private readonly groupTransformer?: GroupTransformer;

  static fromConfig(
    config: Config,
    options: { logger: Logger; groupTransformer?: GroupTransformer },
  ) {
    const c = config.getOptionalConfig('catalog.processors.microsoftGraphOrg');
    return new MicrosoftGraphOrgReaderProcessor({
      ...options,
      providers: c ? readMicrosoftGraphConfig(c) : [],
    });
  }

  constructor(options: {
    providers: MicrosoftGraphProviderConfig[];
    logger: Logger;
    groupTransformer?: GroupTransformer;
  }) {
    this.providers = options.providers;
    this.logger = options.logger;
    this.groupTransformer = options.groupTransformer;
  }

  async readLocation(
    location: LocationSpec,
    _optional: boolean,
    emit: CatalogProcessorEmit,
  ): Promise<boolean> {
    if (location.type !== 'microsoft-graph-org') {
      return false;
    }

    const provider = this.providers.find(p =>
      location.target.startsWith(p.target),
    );
    if (!provider) {
      throw new Error(
        `There is no Microsoft Graph Org provider that matches ${location.target}. Please add a configuration entry for it under catalog.processors.microsoftGraphOrg.providers.`,
      );
    }

    // Read out all of the raw data
    const startTimestamp = Date.now();
    this.logger.info('Reading Microsoft Graph users and groups');

    // We create a client each time as we need one that matches the specific provider
    const client = MicrosoftGraphClient.create(provider);
    const { users, groups } = await readMicrosoftGraphOrg(
      client,
      provider.tenantId,
      {
        userFilter: provider.userFilter,
        groupFilter: provider.groupFilter,
        groupTransformer: this.groupTransformer,
        logger: this.logger,
      },
    );

    const duration = ((Date.now() - startTimestamp) / 1000).toFixed(1);
    this.logger.debug(
      `Read ${users.length} users and ${groups.length} groups from Microsoft Graph in ${duration} seconds`,
    );

    // Done!
    for (const group of groups) {
      emit(results.entity(location, group));
    }
    for (const user of users) {
      emit(results.entity(location, user));
    }

    return true;
  }
}
