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

import { ConfigReader } from '@backstage/config';
import {
  readProviderConfigs,
  DEFAULT_GITHUB_ENTITY_PROVIDER_CONFIG_SCHEDULE,
} from './GithubEntityProviderConfig';

describe('readProviderConfigs', () => {
  afterEach(() => jest.resetAllMocks());

  it('no provider config', () => {
    const config = new ConfigReader({});
    const providerConfigs = readProviderConfigs(config);

    expect(providerConfigs).toHaveLength(0);
  });

  it('single simple provider config', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          github: {
            organization: 'test-org',
          },
        },
      },
    });
    const providerConfigs = readProviderConfigs(config);

    expect(providerConfigs).toHaveLength(1);
    expect(providerConfigs[0].id).toEqual('default');
    expect(providerConfigs[0].organization).toEqual('test-org');
  });

  it('multiple provider configs', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          github: {
            providerOrganizationOnly: {
              organization: 'test-org1',
            },
            providerCustomCatalogPath: {
              organization: 'test-org2',
              catalogPath: 'custom/path/catalog-info.yaml',
            },
            providerWithRepositoryFilter: {
              organization: 'test-org3',
              filters: {
                repository: 'repository.*filter',
              },
            },
            providerWithBranchFilter: {
              organization: 'test-org4',
              filters: {
                branch: 'branch-name',
              },
            },
            providerWithTopicFilter: {
              organization: 'test-org5',
              filters: {
                topic: {
                  exclude: ['backstage-exclude'],
                  include: ['backstage-include'],
                },
              },
            },
            providerWithForkFilter: {
              organization: 'test-org6',
              filters: {
                allowForks: false,
              },
            },
            providerWithVisibilityFilter: {
              organization: 'test-org6',
              filters: {
                visibility: ['public', 'internal'],
              },
            },
            providerWithArchiveFilter: {
              organization: 'test-org6',
              filters: {
                allowArchived: true,
              },
            },
            providerWithHost: {
              organization: 'test-org1',
              host: 'ghe.internal.com',
            },
            providerWithSchedule: {
              organization: 'test-org1',
              schedule: {
                frequency: 'PT30M',
                timeout: {
                  minutes: 3,
                },
              },
            },
            providerWithQueryLimits: {
              organization: 'test-org1',
              queryLimits: {
                repositoryChunkSize: 100,
              },
            },
            providerAppOnly: {
              app: '1234',
            },
            providerAppAndOrganization: {
              app: '1234',
              organization: 'test-org1',
            },
          },
        },
      },
    });
    const providerConfigs = readProviderConfigs(config);

    expect(providerConfigs).toHaveLength(13);
    expect(providerConfigs[0]).toEqual({
      id: 'providerOrganizationOnly',
      organization: 'test-org1',
      catalogPath: '/catalog-info.yaml',
      host: 'github.com',
      filters: {
        repository: undefined,
        branch: undefined,
        allowForks: true,
        topic: {
          include: undefined,
          exclude: undefined,
        },
        visibility: undefined,
        allowArchived: false,
      },
      schedule: DEFAULT_GITHUB_ENTITY_PROVIDER_CONFIG_SCHEDULE,
      validateLocationsExist: false,
      queryLimits: undefined,
    });
    expect(providerConfigs[1]).toEqual({
      id: 'providerCustomCatalogPath',
      organization: 'test-org2',
      catalogPath: 'custom/path/catalog-info.yaml',
      host: 'github.com',
      filters: {
        repository: undefined,
        branch: undefined,
        allowForks: true,
        topic: {
          include: undefined,
          exclude: undefined,
        },
        visibility: undefined,
        allowArchived: false,
      },
      schedule: DEFAULT_GITHUB_ENTITY_PROVIDER_CONFIG_SCHEDULE,
      validateLocationsExist: false,
      queryLimits: undefined,
    });
    expect(providerConfigs[2]).toEqual({
      id: 'providerWithRepositoryFilter',
      organization: 'test-org3', // organization
      catalogPath: '/catalog-info.yaml', // file
      host: 'github.com',
      filters: {
        repository: /^repository.*filter$/, // repo
        branch: undefined, // branch
        allowForks: true,
        topic: {
          include: undefined,
          exclude: undefined,
        },
        visibility: undefined,
        allowArchived: false,
      },
      schedule: DEFAULT_GITHUB_ENTITY_PROVIDER_CONFIG_SCHEDULE,
      validateLocationsExist: false,
      queryLimits: undefined,
    });
    expect(providerConfigs[3]).toEqual({
      id: 'providerWithBranchFilter',
      organization: 'test-org4',
      catalogPath: '/catalog-info.yaml',
      host: 'github.com',
      filters: {
        repository: undefined,
        branch: 'branch-name',
        allowForks: true,
        topic: {
          include: undefined,
          exclude: undefined,
        },
        visibility: undefined,
        allowArchived: false,
      },
      schedule: DEFAULT_GITHUB_ENTITY_PROVIDER_CONFIG_SCHEDULE,
      validateLocationsExist: false,
      queryLimits: undefined,
    });
    expect(providerConfigs[4]).toEqual({
      id: 'providerWithTopicFilter',
      organization: 'test-org5',
      catalogPath: '/catalog-info.yaml',
      host: 'github.com',
      filters: {
        repository: undefined,
        branch: undefined,
        allowForks: true,
        topic: {
          include: ['backstage-include'],
          exclude: ['backstage-exclude'],
        },
        visibility: undefined,
        allowArchived: false,
      },
      schedule: DEFAULT_GITHUB_ENTITY_PROVIDER_CONFIG_SCHEDULE,
      validateLocationsExist: false,
      queryLimits: undefined,
    });
    expect(providerConfigs[5]).toEqual({
      id: 'providerWithForkFilter',
      organization: 'test-org6',
      catalogPath: '/catalog-info.yaml',
      host: 'github.com',
      filters: {
        repository: undefined,
        branch: undefined,
        allowForks: false,
        topic: {
          include: undefined,
          exclude: undefined,
        },
        visibility: undefined,
        allowArchived: false,
      },
      schedule: DEFAULT_GITHUB_ENTITY_PROVIDER_CONFIG_SCHEDULE,
      validateLocationsExist: false,
      queryLimits: undefined,
    });
    expect(providerConfigs[6]).toEqual({
      id: 'providerWithVisibilityFilter',
      organization: 'test-org6',
      catalogPath: '/catalog-info.yaml',
      host: 'github.com',
      filters: {
        repository: undefined,
        branch: undefined,
        allowForks: true,
        topic: {
          include: undefined,
          exclude: undefined,
        },
        visibility: ['public', 'internal'],
        allowArchived: false,
      },
      schedule: DEFAULT_GITHUB_ENTITY_PROVIDER_CONFIG_SCHEDULE,
      validateLocationsExist: false,
      queryLimits: undefined,
    });
    expect(providerConfigs[7]).toEqual({
      id: 'providerWithArchiveFilter',
      organization: 'test-org6',
      catalogPath: '/catalog-info.yaml',
      host: 'github.com',
      filters: {
        repository: undefined,
        branch: undefined,
        allowForks: true,
        topic: {
          include: undefined,
          exclude: undefined,
        },
        visibility: undefined,
        allowArchived: true,
      },
      schedule: DEFAULT_GITHUB_ENTITY_PROVIDER_CONFIG_SCHEDULE,
      validateLocationsExist: false,
    });
    expect(providerConfigs[8]).toEqual({
      id: 'providerWithHost',
      organization: 'test-org1',
      catalogPath: '/catalog-info.yaml',
      host: 'ghe.internal.com',
      filters: {
        repository: undefined,
        branch: undefined,
        allowForks: true,
        topic: {
          include: undefined,
          exclude: undefined,
        },
        visibility: undefined,
        allowArchived: false,
      },
      validateLocationsExist: false,
      schedule: DEFAULT_GITHUB_ENTITY_PROVIDER_CONFIG_SCHEDULE,
      queryLimits: undefined,
    });
    expect(providerConfigs[9]).toEqual({
      id: 'providerWithSchedule',
      organization: 'test-org1',
      catalogPath: '/catalog-info.yaml',
      host: 'github.com',
      filters: {
        repository: undefined,
        branch: undefined,
        allowForks: true,
        topic: {
          include: undefined,
          exclude: undefined,
        },
        visibility: undefined,
        allowArchived: false,
      },
      schedule: {
        frequency: { minutes: 30 },
        timeout: {
          minutes: 3,
        },
      },
      validateLocationsExist: false,
      queryLimits: undefined,
    });
    expect(providerConfigs[10]).toEqual({
      id: 'providerWithQueryLimits',
      organization: 'test-org1',
      catalogPath: '/catalog-info.yaml',
      host: 'github.com',
      filters: {
        repository: undefined,
        branch: undefined,
        allowForks: true,
        topic: {
          include: undefined,
          exclude: undefined,
        },
        visibility: undefined,
        allowArchived: false,
      },
      schedule: DEFAULT_GITHUB_ENTITY_PROVIDER_CONFIG_SCHEDULE,
      validateLocationsExist: false,
      queryLimits: {
        repositoryChunkSize: 100,
      },
    });
    expect(providerConfigs[11]).toEqual({
      id: 'providerAppOnly',
      app: 1234,
      catalogPath: '/catalog-info.yaml',
      host: 'github.com',
      filters: {
        repository: undefined,
        branch: undefined,
        allowForks: true,
        topic: {
          include: undefined,
          exclude: undefined,
        },
        visibility: undefined,
        allowArchived: false,
      },
      schedule: DEFAULT_GITHUB_ENTITY_PROVIDER_CONFIG_SCHEDULE,
      validateLocationsExist: false,
      queryLimits: undefined,
    });
    expect(providerConfigs[12]).toEqual({
      id: 'providerAppAndOrganization',
      app: 1234,
      organization: 'test-org1',
      catalogPath: '/catalog-info.yaml',
      host: 'github.com',
      filters: {
        repository: undefined,
        branch: undefined,
        allowForks: true,
        topic: {
          include: undefined,
          exclude: undefined,
        },
        visibility: undefined,
        allowArchived: false,
      },
      schedule: DEFAULT_GITHUB_ENTITY_PROVIDER_CONFIG_SCHEDULE,
      validateLocationsExist: false,
    });
  });

  it('defaults validateLocationsExist to false', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          github: {
            organization: 'test-org',
          },
        },
      },
    });
    const providerConfigs = readProviderConfigs(config);

    expect(providerConfigs[0].validateLocationsExist).toEqual(false);
  });

  it('throws an error when a wildcard catalog path is configured with validation of locations', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          github: {
            organization: 'test-org',
            validateLocationsExist: true,
            catalogPath: '/*/catalog-info.yaml',
          },
        },
      },
    });

    expect(() => readProviderConfigs(config)).toThrow();
  });

  it('throws an error when filters.branch contains a slash', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          github: {
            invalidBranchUser: {
              organization: 'test-org',
              catalogPath: '/*/catalog-info.yaml',
              filters: {
                branch: 'test/a',
              },
            },
          },
        },
      },
    });

    expect(() => readProviderConfigs(config)).toThrow();
  });

  it('throws an error when no organization or app is configured', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          github: {
            catalogPath: '/*/catalog-info.yaml',
          },
        },
      },
    });

    expect(() => readProviderConfigs(config)).toThrow();
  });

  it('reads page sizes configuration', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          github: {
            organization: 'test-org',
            pageSizes: {
              repositories: 10,
            },
          },
        },
      },
    });
    const providerConfigs = readProviderConfigs(config);

    expect(providerConfigs).toHaveLength(1);
    expect(providerConfigs[0].pageSizes).toEqual({
      repositories: 10,
    });
  });

  it('handles missing page sizes configuration', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          github: {
            organization: 'test-org',
          },
        },
      },
    });
    const providerConfigs = readProviderConfigs(config);

    expect(providerConfigs).toHaveLength(1);
    expect(providerConfigs[0].pageSizes).toBeUndefined();
  });

  it('reads multiple providers with different page sizes', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          github: {
            providerWithPageSizes: {
              organization: 'test-org1',
              pageSizes: {
                repositories: 15,
              },
            },
            providerWithoutPageSizes: {
              organization: 'test-org2',
            },
          },
        },
      },
    });
    const providerConfigs = readProviderConfigs(config);

    expect(providerConfigs).toHaveLength(2);
    expect(providerConfigs[0].pageSizes).toEqual({
      repositories: 15,
    });
    expect(providerConfigs[1].pageSizes).toBeUndefined();
  });

  it('reads query limits configuration', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          github: {
            organization: 'test-org',
            queryLimits: {
              repositoryChunkSize: 50,
            },
          },
        },
      },
    });
    const providerConfigs = readProviderConfigs(config);

    expect(providerConfigs).toHaveLength(1);
    expect(providerConfigs[0].queryLimits).toEqual({
      repositoryChunkSize: 50,
    });
  });

  it('handles missing query limits configuration', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          github: {
            organization: 'test-org',
          },
        },
      },
    });
    const providerConfigs = readProviderConfigs(config);

    expect(providerConfigs).toHaveLength(1);
    expect(providerConfigs[0].queryLimits).toBeUndefined();
  });
});
