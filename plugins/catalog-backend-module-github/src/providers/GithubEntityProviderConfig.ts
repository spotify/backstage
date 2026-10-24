/*
 * Copyright 2022 The Backstage Authors
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

import {
  SchedulerServiceTaskScheduleDefinition,
  readSchedulerServiceTaskScheduleDefinitionFromConfig,
} from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';

const DEFAULT_CATALOG_PATH = '/catalog-info.yaml';
const DEFAULT_PROVIDER_ID = 'default';

export const DEFAULT_GITHUB_ENTITY_PROVIDER_CONFIG_SCHEDULE = {
  frequency: {
    hours: 3,
  },
  timeout: {
    hours: 1,
  },
};

export type GithubEntityProviderConfig = {
  id: string;
  catalogPath: string;
  organization?: string;
  app?: number;
  host: string;
  filters: {
    repository?: RegExp;
    branch?: string;
    topic?: GithubTopicFilters;
    allowForks: boolean;
    visibility?: string[];
    allowArchived: boolean;
  };
  validateLocationsExist: boolean;
  schedule?: SchedulerServiceTaskScheduleDefinition;
  pageSizes?: {
    repositories?: number;
  };
  queryLimits?: {
    repositoryChunkSize?: number;
  };
};

export type GithubTopicFilters = {
  exclude?: string[];
  include?: string[];
};

export function readProviderConfigs(
  config: Config,
): GithubEntityProviderConfig[] {
  const providersConfig = config.getOptionalConfig('catalog.providers.github');
  if (!providersConfig) {
    return [];
  }

  if (providersConfig.has('organization') || providersConfig.has('app')) {
    // simple/single config variant
    return [readProviderConfig(DEFAULT_PROVIDER_ID, providersConfig)];
  }

  return providersConfig.keys().map(id => {
    const providerConfig = providersConfig.getConfig(id);

    return readProviderConfig(id, providerConfig);
  });
}

function readProviderConfig(
  id: string,
  config: Config,
): GithubEntityProviderConfig {
  const organization = config.getOptionalString('organization');
  const app = config.getOptionalNumber('app');

  if (!organization && !app) {
    throw new Error(
      'Error while processing GitHub provider config. Either organization or app must be specified.',
    );
  }

  const catalogPath =
    config.getOptionalString('catalogPath') ?? DEFAULT_CATALOG_PATH;
  const host = config.getOptionalString('host') ?? 'github.com';
  const repositoryPattern = config.getOptionalString('filters.repository');
  const branchPattern = config.getOptionalString('filters.branch');
  const allowForks = config.getOptionalBoolean('filters.allowForks') ?? true;
  const topicFilterInclude = config?.getOptionalStringArray(
    'filters.topic.include',
  );
  const topicFilterExclude = config?.getOptionalStringArray(
    'filters.topic.exclude',
  );
  const allowArchived =
    config.getOptionalBoolean('filters.allowArchived') ?? false;
  const validateLocationsExist =
    config?.getOptionalBoolean('validateLocationsExist') ?? false;

  const catalogPathContainsWildcard = catalogPath.includes('*');

  const visibilityFilterInclude =
    config?.getOptionalStringArray('filters.visibility');

  if (validateLocationsExist && catalogPathContainsWildcard) {
    throw Error(
      `Error while processing GitHub provider config. The catalog path ${catalogPath} contains a wildcard, which is incompatible with validation of locations existing before emitting them. Ensure that validateLocationsExist is set to false.`,
    );
  }

  if (branchPattern?.includes('/')) {
    throw new Error(
      'Error while processing GitHub provider config. Slash characters (/) are not allowed in filters.branch',
    );
  }

  const schedule = config.has('schedule')
    ? readSchedulerServiceTaskScheduleDefinitionFromConfig(
        config.getConfig('schedule'),
      )
    : DEFAULT_GITHUB_ENTITY_PROVIDER_CONFIG_SCHEDULE;

  const pageSizes = config.has('pageSizes')
    ? {
        repositories: config.getOptionalNumber('pageSizes.repositories'),
      }
    : undefined;

  const queryLimits = config.has('queryLimits')
    ? {
        repositoryChunkSize: config.getOptionalNumber(
          'queryLimits.repositoryChunkSize',
        ),
      }
    : undefined;

  return {
    id,
    catalogPath,
    organization,
    app,
    host,
    filters: {
      repository: repositoryPattern
        ? compileRegExp(repositoryPattern)
        : undefined,
      branch: branchPattern || undefined,
      allowForks: allowForks,
      topic: {
        include: topicFilterInclude,
        exclude: topicFilterExclude,
      },
      visibility: visibilityFilterInclude,
      allowArchived,
    },
    schedule,
    validateLocationsExist,
    pageSizes,
    queryLimits,
  };
}

/**
 * Compiles a RegExp while enforcing the pattern to contain
 * the start-of-line and end-of-line anchors.
 *
 * @param pattern
 */
function compileRegExp(pattern: string): RegExp {
  let fullLinePattern = pattern;
  if (!fullLinePattern.startsWith('^')) {
    fullLinePattern = `^${fullLinePattern}`;
  }
  if (!fullLinePattern.endsWith('$')) {
    fullLinePattern = `${fullLinePattern}$`;
  }

  return new RegExp(fullLinePattern);
}
