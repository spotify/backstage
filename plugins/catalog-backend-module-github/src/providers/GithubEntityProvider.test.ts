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

import {
  SchedulerService,
  SchedulerServiceTaskRunner,
  SchedulerServiceTaskInvocationDefinition,
} from '@backstage/backend-plugin-api';
import { Config, ConfigReader } from '@backstage/config';
import {
  DeferredEntity,
  EntityProviderConnection,
  locationSpecToMetadataName,
} from '@backstage/plugin-catalog-node';
import { GithubEntityProvider } from './GithubEntityProvider';
import * as helpers from '../lib/github';
import { EventParams } from '@backstage/plugin-events-node';
import { mockServices } from '@backstage/backend-test-utils';
import {
  Commit,
  PushEvent,
  RepositoryEvent,
  RepositoryRenamedEvent,
} from '@octokit/webhooks-types';

type PartialDeep<T> = T extends (...args: unknown[]) => unknown
  ? T
  : T extends Array<infer U>
  ? Array<PartialDeep<U>>
  : T extends object
  ? { [K in keyof T]?: PartialDeep<T[K]> }
  : T;

jest.mock('../lib/github', () => {
  return {
    getOrganizationRepositories: jest.fn(),
    createGraphqlClient: jest.fn().mockReturnValue(jest.fn()),
  };
});
class PersistingTaskRunner implements SchedulerServiceTaskRunner {
  private tasks: SchedulerServiceTaskInvocationDefinition[] = [];

  getTasks() {
    return this.tasks;
  }

  run(task: SchedulerServiceTaskInvocationDefinition): Promise<void> {
    this.tasks.push(task);
    return Promise.resolve(undefined);
  }
}

const logger = mockServices.logger.mock();

describe('GithubEntityProvider', () => {
  const createSingleProviderConfig = (options?: {
    providerConfig?: object;
    unwrapped?: boolean;
  }): Config => {
    const providerConfig = {
      organization: 'test-org',
      ...options?.providerConfig,
    };

    return new ConfigReader({
      catalog: {
        providers: {
          github: options?.unwrapped
            ? providerConfig
            : { myProvider: providerConfig },
        },
      },
    });
  };

  const createProviders = (config: Config) => {
    const schedule = new PersistingTaskRunner();
    return GithubEntityProvider.fromConfig(config, {
      logger,
      schedule,
    });
  };

  const createExpectedEntitiesForUrl = (url: string): DeferredEntity[] => {
    return [
      {
        entity: {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Location',
          metadata: {
            annotations: {
              'backstage.io/managed-by-location': `url:${url}`,
              'backstage.io/managed-by-origin-location': `url:${url}`,
            },
            name: locationSpecToMetadataName({ type: 'url', target: url }),
          },
          spec: {
            presence: 'optional',
            target: url,
            type: 'url',
          },
        },
        locationKey: 'github-provider:myProvider',
      },
    ];
  };

  afterEach(() => jest.clearAllMocks());

  it('no provider config', () => {
    const config = new ConfigReader({});
    const providers = createProviders(config);

    expect(providers).toHaveLength(0);
  });

  it('single simple provider config', () => {
    const config = createSingleProviderConfig({ unwrapped: true });
    const providers = createProviders(config);

    expect(providers).toHaveLength(1);
    expect(providers[0].getProviderName()).toEqual('github-provider:default');
  });

  it('throws when the integration config does not exist', () => {
    const config = createSingleProviderConfig({
      providerConfig: {
        host: 'ghe.internal.com',
      },
    });

    expect(() => createProviders(config)).toThrow(
      /There is no GitHub config that matches host ghe.internal.com/,
    );
  });

  it('multiple provider configs', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          github: {
            myProvider: {
              organization: 'test-org1',
            },
            anotherProvider: {
              organization: 'test-org2',
            },
          },
        },
      },
    });
    const providers = createProviders(config);

    expect(providers).toHaveLength(2);
    expect(providers[0].getProviderName()).toEqual(
      'github-provider:myProvider',
    );
    expect(providers[1].getProviderName()).toEqual(
      'github-provider:anotherProvider',
    );
  });

  it('apply full update on scheduled execution with basic filters', async () => {
    const config = createSingleProviderConfig({
      providerConfig: {
        catalogPath: 'custom/path/catalog-custom.yaml',
        filters: {
          branch: 'main',
          repository: 'test-.*',
        },
      },
    });
    const schedule = new PersistingTaskRunner();
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };

    const provider = GithubEntityProvider.fromConfig(config, {
      logger,
      schedule,
    })[0];

    const mockGetOrganizationRepositories = jest.spyOn(
      helpers,
      'getOrganizationRepositories',
    );

    mockGetOrganizationRepositories.mockReturnValue(
      Promise.resolve({
        repositories: [
          {
            name: 'test-repo',
            url: 'https://github.com/test-org/test-repo',
            repositoryTopics: { nodes: [] },
            isArchived: false,
            isFork: false,
            defaultBranchRef: {
              name: 'main',
            },
            catalogInfoFile: {
              __typename: 'Blob',
              id: 'abc123',
              text: 'some yaml',
            },
            visibility: 'public',
          },
        ],
      }),
    );

    await provider.connect(entityProviderConnection);

    const taskDef = schedule.getTasks()[0];
    expect(taskDef.id).toEqual('github-provider:myProvider:refresh');
    await (taskDef.fn as () => Promise<void>)();

    const url = `https://github.com/test-org/test-repo/blob/main/custom/path/catalog-custom.yaml`;
    const expectedEntities = createExpectedEntitiesForUrl(url);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: expectedEntities,
    });
  });

  it('apply full update on scheduled execution with topic exclusion', async () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          github: {
            myProvider: {
              organization: 'test-org',
              catalogPath: 'custom/path/catalog-custom.yaml',
              filters: {
                branch: 'main',
                repository: 'test-.*',
                topic: {
                  exclude: ['backstage-exclude'],
                },
              },
            },
          },
        },
      },
    });
    const schedule = new PersistingTaskRunner();
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };

    const provider = GithubEntityProvider.fromConfig(config, {
      logger,
      schedule,
    })[0];

    const mockGetOrganizationRepositories = jest.spyOn(
      helpers,
      'getOrganizationRepositories',
    );

    mockGetOrganizationRepositories.mockReturnValue(
      Promise.resolve({
        repositories: [
          {
            name: 'test-repo',
            url: 'https://github.com/test-org/test-repo',
            repositoryTopics: {
              nodes: [
                {
                  topic: { name: 'backstage-exclude' },
                },
                {
                  topic: { name: 'neat-repos' },
                },
              ],
            },
            isArchived: false,
            isFork: false,
            defaultBranchRef: {
              name: 'main',
            },
            catalogInfoFile: {
              __typename: 'Blob',
              id: 'abc123',
              text: 'some yaml',
            },
            visibility: 'public',
          },
        ],
      }),
    );

    await provider.connect(entityProviderConnection);

    const taskDef = schedule.getTasks()[0];
    expect(taskDef.id).toEqual('github-provider:myProvider:refresh');
    await (taskDef.fn as () => Promise<void>)();

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: [],
    });
  });

  it('apply full update on scheduled execution with topic inclusion', async () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          github: {
            myProvider: {
              organization: 'test-org',
              catalogPath: 'custom/path/catalog-custom.yaml',
              filters: {
                branch: 'main',
                repository: 'test-.*',
                topic: {
                  include: ['backstage-include'],
                },
              },
            },
          },
        },
      },
    });
    const schedule = new PersistingTaskRunner();
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };

    const provider = GithubEntityProvider.fromConfig(config, {
      logger,
      schedule,
    })[0];

    const mockGetOrganizationRepositories = jest.spyOn(
      helpers,
      'getOrganizationRepositories',
    );

    mockGetOrganizationRepositories.mockReturnValue(
      Promise.resolve({
        repositories: [
          {
            name: 'test-repo',
            url: 'https://github.com/test-org/test-repo',
            repositoryTopics: {
              nodes: [
                {
                  topic: { name: 'backstage-include' },
                },
                {
                  topic: { name: 'fruits' },
                },
              ],
            },
            isArchived: false,
            isFork: false,
            defaultBranchRef: {
              name: 'main',
            },
            catalogInfoFile: {
              __typename: 'Blob',
              id: 'abc123',
              text: 'some yaml',
            },
            visibility: 'public',
          },
        ],
      }),
    );

    await provider.connect(entityProviderConnection);

    const taskDef = schedule.getTasks()[0];
    expect(taskDef.id).toEqual('github-provider:myProvider:refresh');
    await (taskDef.fn as () => Promise<void>)();

    const url = `https://github.com/test-org/test-repo/blob/main/custom/path/catalog-custom.yaml`;
    const expectedEntities = createExpectedEntitiesForUrl(url);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: expectedEntities,
    });
  });

  it('should filter out invalid locations when validateLocationsExist is set to true', async () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          github: {
            myProvider: {
              organization: 'test-org',
              catalogPath: 'catalog-custom.yaml',
              filters: {
                branch: 'backstage',
              },
              validateLocationsExist: true,
            },
          },
        },
      },
    });
    const schedule = new PersistingTaskRunner();
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };

    const provider = GithubEntityProvider.fromConfig(config, {
      logger,
      schedule,
    })[0];

    const mockGetOrganizationRepositories = jest.spyOn(
      helpers,
      'getOrganizationRepositories',
    );

    mockGetOrganizationRepositories.mockReturnValue(
      Promise.resolve({
        repositories: [
          {
            name: 'test-repo',
            url: 'https://github.com/test-org/test-repo',
            repositoryTopics: {
              nodes: [],
            },
            isArchived: false,
            isFork: false,
            defaultBranchRef: {
              name: 'main',
            },
            catalogInfoFile: null,
            visibility: 'public',
          },
          {
            name: 'another-repo',
            url: 'https://github.com/test-org/another-repo',
            repositoryTopics: {
              nodes: [],
            },
            isArchived: false,
            isFork: false,
            defaultBranchRef: {
              name: 'main',
            },
            catalogInfoFile: {
              __typename: 'Blob',
              id: 'abc123',
              text: 'some yaml',
            },
            visibility: 'public',
          },
        ],
      }),
    );

    await provider.connect(entityProviderConnection);

    const taskDef = schedule.getTasks()[0];
    expect(taskDef.id).toEqual('github-provider:myProvider:refresh');
    await (taskDef.fn as () => Promise<void>)();

    expect(mockGetOrganizationRepositories).toHaveBeenCalledWith(
      expect.anything(),
      'test-org',
      'catalog-custom.yaml',
      expect.any(Object),
      'backstage',
      expect.objectContaining({
        allowArchived: false,
        startCursor: undefined,
        chunkSize: undefined,
      }),
    );

    const url = `https://github.com/test-org/another-repo/blob/backstage/catalog-custom.yaml`;
    const expectedEntities = createExpectedEntitiesForUrl(url);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: expectedEntities,
    });
  });

  it('apply full update on scheduled execution with topic exclusion taking priority over topic inclusion', async () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          github: {
            myProvider: {
              organization: 'test-org',
              catalogPath: 'custom/path/catalog-custom.yaml',
              filters: {
                branch: 'main',
                repository: 'test-.*',
                topic: {
                  exclude: ['backstage-exclude'],
                  include: ['backstage-include'],
                },
              },
            },
          },
        },
      },
    });
    const schedule = new PersistingTaskRunner();
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };

    const provider = GithubEntityProvider.fromConfig(config, {
      logger,
      schedule,
    })[0];

    const mockGetOrganizationRepositories = jest.spyOn(
      helpers,
      'getOrganizationRepositories',
    );

    mockGetOrganizationRepositories.mockReturnValue(
      Promise.resolve({
        repositories: [
          {
            name: 'test-repo',
            url: 'https://github.com/test-org/test-repo',
            repositoryTopics: {
              nodes: [
                {
                  topic: { name: 'backstage-include' },
                },
              ],
            },
            isArchived: false,
            isFork: false,
            defaultBranchRef: {
              name: 'main',
            },
            catalogInfoFile: {
              __typename: 'Blob',
              id: 'abc123',
              text: 'some yaml',
            },
            visibility: 'public',
          },
          {
            name: 'test-repo-2',
            url: 'https://github.com/test-org/test-repo-2',
            repositoryTopics: {
              nodes: [
                {
                  topic: { name: 'backstage-include' },
                },
                {
                  topic: { name: 'backstage-exclude' },
                },
              ],
            },
            isArchived: false,
            isFork: false,
            defaultBranchRef: {
              name: 'main',
            },
            catalogInfoFile: {
              __typename: 'Blob',
              id: 'abc123',
              text: 'some yaml',
            },
            visibility: 'public',
          },
          {
            name: 'test-repo-3',
            url: 'https://github.com/test-org/test-repo-3',
            repositoryTopics: {
              nodes: [
                {
                  topic: { name: 'backstage-exclude' },
                },
              ],
            },
            isArchived: false,
            isFork: false,
            defaultBranchRef: {
              name: 'main',
            },
            catalogInfoFile: {
              __typename: 'Blob',
              id: 'abc123',
              text: 'some yaml',
            },
            visibility: 'public',
          },
        ],
      }),
    );

    await provider.connect(entityProviderConnection);

    const taskDef = schedule.getTasks()[0];
    expect(taskDef.id).toEqual('github-provider:myProvider:refresh');
    await (taskDef.fn as () => Promise<void>)();

    const url = `https://github.com/test-org/test-repo/blob/main/custom/path/catalog-custom.yaml`;
    const expectedEntities = createExpectedEntitiesForUrl(url);

    expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: expectedEntities,
    });
  });

  it('chunks repository fetching when queryLimits.repositoryChunkSize is set', async () => {
    const config = createSingleProviderConfig({
      providerConfig: {
        catalogPath: 'custom/path/catalog-custom.yaml',
        filters: {
          branch: 'main',
        },
        queryLimits: {
          repositoryChunkSize: 1,
        },
      },
    });
    const schedule = new PersistingTaskRunner();
    const entityProviderConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };

    const provider = GithubEntityProvider.fromConfig(config, {
      logger,
      schedule,
    })[0];

    const mockGetOrganizationRepositories = jest.spyOn(
      helpers,
      'getOrganizationRepositories',
    );

    mockGetOrganizationRepositories
      .mockResolvedValueOnce({
        repositories: [
          {
            name: 'test-repo',
            url: 'https://github.com/test-org/test-repo',
            repositoryTopics: { nodes: [] },
            isArchived: false,
            isFork: false,
            defaultBranchRef: { name: 'main' },
            catalogInfoFile: {
              __typename: 'Blob',
              id: 'abc123',
              text: 'some yaml',
            },
            visibility: 'public',
          },
        ],
        nextCursor: 'cursor-1',
      })
      .mockResolvedValueOnce({
        repositories: [
          {
            name: 'test-repo-2',
            url: 'https://github.com/test-org/test-repo-2',
            repositoryTopics: { nodes: [] },
            isArchived: false,
            isFork: false,
            defaultBranchRef: { name: 'main' },
            catalogInfoFile: {
              __typename: 'Blob',
              id: 'def456',
              text: 'some yaml',
            },
            visibility: 'public',
          },
        ],
        nextCursor: undefined,
      });

    await provider.connect(entityProviderConnection);

    const taskDef = schedule.getTasks()[0];
    await (taskDef.fn as () => Promise<void>)();

    expect(mockGetOrganizationRepositories).toHaveBeenCalledTimes(2);
    expect(mockGetOrganizationRepositories).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      'test-org',
      'custom/path/catalog-custom.yaml',
      expect.any(Object),
      'main',
      expect.objectContaining({
        allowArchived: false,
        startCursor: undefined,
        chunkSize: 1,
      }),
    );
    expect(mockGetOrganizationRepositories).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      'test-org',
      'custom/path/catalog-custom.yaml',
      expect.any(Object),
      'main',
      expect.objectContaining({
        allowArchived: false,
        startCursor: 'cursor-1',
        chunkSize: 1,
      }),
    );
    expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: expect.arrayContaining([
        expect.objectContaining({
          entity: expect.objectContaining({
            spec: expect.objectContaining({
              target: expect.stringContaining('test-repo'),
            }),
          }),
        }),
      ]),
    });
  });

  it('fail without schedule and scheduler', () => {
    const config = createSingleProviderConfig();

    expect(() =>
      GithubEntityProvider.fromConfig(config, {
        logger,
      }),
    ).toThrow('Either schedule or scheduler must be provided');
  });

  it('single simple provider config with schedule in config', async () => {
    const schedule = new PersistingTaskRunner();
    const scheduler = {
      createScheduledTaskRunner: (_: any) => schedule,
    } as unknown as SchedulerService;
    const config = createSingleProviderConfig({
      providerConfig: {
        schedule: {
          frequency: 'P1M',
          timeout: 'PT3M',
        },
      },
      unwrapped: true,
    });
    const providers = GithubEntityProvider.fromConfig(config, {
      logger,
      scheduler,
    });

    expect(providers).toHaveLength(1);
    expect(providers[0].getProviderName()).toEqual('github-provider:default');
  });

  describe('on event', () => {
    const createExpectedEntitiesForEvent = (
      event: EventParams<PushEvent | RepositoryEvent>,
      options?: { branch?: string; catalogFilePath?: string },
    ): DeferredEntity[] => {
      const url = `${event.eventPayload.repository.html_url}/blob/${
        options?.branch ?? 'main'
      }/${options?.catalogFilePath ?? 'catalog-info.yaml'}`;
      return createExpectedEntitiesForUrl(url);
    };

    describe('on push event', () => {
      const createPushEvent = (options?: {
        catalogFile?: {
          action?: 'added' | 'removed' | 'modified';
          path?: string;
        };
        org?: string;
        ref?: string;
      }): EventParams<PushEvent> => {
        const organization = options?.org ?? 'test-org';
        const repo = {
          default_branch: 'main',
          master_branch: 'main',
          name: 'test-repo',
          organization,
          topics: [],
          html_url: `https://github.com/${organization}/test-repo`,
          url: `https://github.com/${organization}/test-repo`,
          owner: { login: 'test-org' },
        } as PartialDeep<PushEvent['repository']>;

        const catalogCommit = {
          added: [] as string[],
          modified: [] as string[],
          removed: [] as string[],
        };
        catalogCommit[options?.catalogFile?.action ?? 'modified'] = [
          options?.catalogFile?.path ?? 'catalog-info.yaml',
        ];

        const event = {
          ref: options?.ref ?? 'refs/heads/main',
          repository: repo as PushEvent['repository'],
          organization: {
            login: organization,
          },
          created: true,
          deleted: false,
          forced: false,
          commits: [
            {
              added: ['new-file.yaml'],
              removed: [],
              modified: [],
            },
            catalogCommit,
          ] as Partial<Commit>[],
        } as PushEvent;

        return {
          topic: 'github.push',
          metadata: {
            'x-github-event': 'push',
          },
          eventPayload: event,
        };
      };

      it('apply delta update on added files with glob catalog path', async () => {
        const config = createSingleProviderConfig({
          providerConfig: {
            catalogPath: '**/catalog-info.yaml',
          },
        });
        const provider = createProviders(config)[0];

        const entityProviderConnection: EntityProviderConnection = {
          applyMutation: jest.fn(),
          refresh: jest.fn(),
        };
        await provider.connect(entityProviderConnection);

        const event = createPushEvent({
          catalogFile: {
            action: 'added',
            path: 'folder1/folder2/folder3/catalog-info.yaml',
          },
        });
        const expectedEntities = createExpectedEntitiesForEvent(event, {
          catalogFilePath: 'folder1/folder2/folder3/catalog-info.yaml',
        });

        await provider.onEvent(event);

        expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
        expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
          type: 'delta',
          added: expectedEntities,
          removed: [],
        });
      });

      it('apply delta update on added files', async () => {
        const config = createSingleProviderConfig();
        const provider = createProviders(config)[0];

        const entityProviderConnection: EntityProviderConnection = {
          applyMutation: jest.fn(),
          refresh: jest.fn(),
        };
        await provider.connect(entityProviderConnection);

        const event = createPushEvent({
          catalogFile: {
            action: 'added',
          },
        });
        const expectedEntities = createExpectedEntitiesForEvent(event);

        await provider.onEvent(event);

        expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
        expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
          type: 'delta',
          added: expectedEntities,
          removed: [],
        });
      });

      it('apply delta update on removed files', async () => {
        const config = createSingleProviderConfig();
        const provider = createProviders(config)[0];

        const entityProviderConnection: EntityProviderConnection = {
          applyMutation: jest.fn(),
          refresh: jest.fn(),
        };
        await provider.connect(entityProviderConnection);

        const event = createPushEvent({
          catalogFile: {
            action: 'removed',
          },
        });
        const expectedEntities = createExpectedEntitiesForEvent(event);

        await provider.onEvent(event);

        expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(1);
        expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
          type: 'delta',
          added: [],
          removed: expectedEntities,
        });
      });

      it('apply refresh call on modified files', async () => {
        const config = createSingleProviderConfig();
        const provider = createProviders(config)[0];

        const entityProviderConnection: EntityProviderConnection = {
          applyMutation: jest.fn(),
          refresh: jest.fn(),
        };
        await provider.connect(entityProviderConnection);

        const event = createPushEvent();

        await provider.onEvent(event);

        expect(entityProviderConnection.refresh).toHaveBeenCalledTimes(1);
        expect(entityProviderConnection.refresh).toHaveBeenCalledWith({
          keys: [
            'url:https://github.com/test-org/test-repo/tree/main/catalog-info.yaml',
            'url:https://github.com/test-org/test-repo/blob/main/catalog-info.yaml',
          ],
        });
        expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(0);
      });

      it('apply refresh call on modified files with glob catalog path', async () => {
        const config = new ConfigReader({
          catalog: {
            providers: {
              github: {
                organization: 'test-org',
                catalogPath: '**/catalog-info.yaml',
              },
            },
          },
        });
        const provider = createProviders(config)[0];

        const entityProviderConnection: EntityProviderConnection = {
          applyMutation: jest.fn(),
          refresh: jest.fn(),
        };
        await provider.connect(entityProviderConnection);

        const event = createPushEvent();

        await provider.onEvent(event);

        expect(entityProviderConnection.refresh).toHaveBeenCalledTimes(1);
        expect(entityProviderConnection.refresh).toHaveBeenCalledWith({
          keys: [
            'url:https://github.com/test-org/test-repo/tree/main/catalog-info.yaml',
            'url:https://github.com/test-org/test-repo/blob/main/catalog-info.yaml',
            'url:https://github.com/test-org/test-repo/tree/main/**/catalog-info.yaml',
          ],
        });
        expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(0);
      });

      it('should process repository when match filters', async () => {
        const config = createSingleProviderConfig({
          providerConfig: {
            filters: {
              branch: 'my-special-branch',
              repository: 'test-repo',
            },
          },
        });
        const provider = createProviders(config)[0];

        const entityProviderConnection: EntityProviderConnection = {
          applyMutation: jest.fn(),
          refresh: jest.fn(),
        };
        await provider.connect(entityProviderConnection);

        const event = createPushEvent({ ref: 'refs/heads/my-special-branch' });

        await provider.onEvent(event);

        expect(entityProviderConnection.refresh).toHaveBeenCalledTimes(1);
        expect(entityProviderConnection.refresh).toHaveBeenCalledWith({
          keys: [
            'url:https://github.com/test-org/test-repo/tree/my-special-branch/catalog-info.yaml',
            'url:https://github.com/test-org/test-repo/blob/my-special-branch/catalog-info.yaml',
          ],
        });
        expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(0);
      });

      it("should skip process when didn't match filters", async () => {
        const config = createSingleProviderConfig({
          providerConfig: {
            filters: {
              repository: 'only-special-repository',
            },
          },
        });
        const provider = createProviders(config)[0];

        const entityProviderConnection: EntityProviderConnection = {
          applyMutation: jest.fn(),
          refresh: jest.fn(),
        };
        await provider.connect(entityProviderConnection);

        const event = createPushEvent();

        await provider.onEvent(event);

        expect(entityProviderConnection.refresh).toHaveBeenCalledTimes(0);
        expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(0);
      });

      it("should skip process when didn't match org", async () => {
        const config = createSingleProviderConfig({
          providerConfig: {
            filters: {
              branch: 'my-special-branch',
              repository: 'test-repo',
            },
          },
        });
        const provider = createProviders(config)[0];

        const entityProviderConnection: EntityProviderConnection = {
          applyMutation: jest.fn(),
          refresh: jest.fn(),
        };
        await provider.connect(entityProviderConnection);

        const event = createPushEvent({
          ref: 'refs/heads/my-special-branch',
          org: 'other-org',
        });

        await provider.onEvent(event);

        expect(entityProviderConnection.refresh).toHaveBeenCalledTimes(0);
        expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(0);
      });

      it('should process when orgs case-insensitive match', async () => {
        const config = createSingleProviderConfig({
          providerConfig: {
            organization: 'test-org',
          },
        });
        const provider = createProviders(config)[0];

        const entityProviderConnection: EntityProviderConnection = {
          applyMutation: jest.fn(),
          refresh: jest.fn(),
        };
        await provider.connect(entityProviderConnection);

        const event = createPushEvent({ org: 'Test-Org' });

        await provider.onEvent(event);

        expect(entityProviderConnection.refresh).toHaveBeenCalledTimes(1);
      });

      it('should fail with incorrect branch matching', async () => {
        const config = createSingleProviderConfig({
          providerConfig: {
            catalogPath: '**/catalog-info.yaml',
          },
        });
        const provider = createProviders(config)[0];

        const entityProviderConnection: EntityProviderConnection = {
          applyMutation: jest.fn(),
          refresh: jest.fn(),
        };
        await provider.connect(entityProviderConnection);

        const event = createPushEvent({
          catalogFile: {
            action: 'added',
            path: 'folder1/folder2/folder3/catalog-info.yaml',
          },
          ref: 'refs/heads/my-main-branch',
        });

        await provider.onEvent(event);

        expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(0);
      });
    });

    describe('on repository event', () => {
      const createRepoEvent = (
        action: RepositoryEvent['action'],
      ): EventParams<RepositoryEvent> => {
        const repo = {
          name: 'test-repo',
          html_url: 'https://github.com/test-org/test-repo',
          url: 'https://api.github.com/repos/test-org/test-repo',
          default_branch: 'main',
          master_branch: 'main',
          topics: [],
          archived: action === 'archived',
          private: action !== 'publicized',
          owner: {
            login: 'test-org',
          },
        } as PartialDeep<RepositoryEvent['repository']>;

        const event = {
          action,
          repository: repo as RepositoryEvent['repository'],
          organization: {
            login: 'test-org',
          },
        } as RepositoryEvent;

        if (action === 'renamed') {
          (event as RepositoryRenamedEvent).changes = {
            repository: {
              name: {
                from: `old-${event.repository.name}`,
              },
            },
          };
        }

        return {
          topic: 'github.repository',
          metadata: {
            'x-github-event': 'repository',
          },
          eventPayload: event,
        };
      };

      describe('on repository archived event', () => {
        it('skip on non-matching org', async () => {
          const config = createSingleProviderConfig({
            providerConfig: {
              organization: 'other-org',
            },
          });
          const provider = createProviders(config)[0];

          const entityProviderConnection: EntityProviderConnection = {
            applyMutation: jest.fn(),
            refresh: jest.fn(),
          };
          await provider.connect(entityProviderConnection);

          const event = createRepoEvent('archived');

          await provider.onEvent(event);

          expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(
            0,
          );
        });

        it('apply delta update removing entities', async () => {
          const config = createSingleProviderConfig();
          const provider = createProviders(config)[0];

          const entityProviderConnection: EntityProviderConnection = {
            applyMutation: jest.fn(),
            refresh: jest.fn(),
          };
          await provider.connect(entityProviderConnection);

          const event = createRepoEvent('archived');
          const expectedEntities = createExpectedEntitiesForEvent(event);

          await provider.onEvent(event);

          expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(
            1,
          );
          expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
            type: 'delta',
            added: [],
            removed: expectedEntities,
          });
        });
      });

      describe('on repository created event', () => {
        it('skip', async () => {
          const config = createSingleProviderConfig();
          const provider = createProviders(config)[0];

          const entityProviderConnection: EntityProviderConnection = {
            applyMutation: jest.fn(),
            refresh: jest.fn(),
          };
          await provider.connect(entityProviderConnection);

          const event = createRepoEvent('created');

          await provider.onEvent(event);

          expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(
            0,
          );
        });
      });

      describe('on repository deleted event', () => {
        it('skip on non-matching org', async () => {
          const config = createSingleProviderConfig({
            providerConfig: {
              organization: 'other-org',
            },
          });
          const provider = createProviders(config)[0];

          const entityProviderConnection: EntityProviderConnection = {
            applyMutation: jest.fn(),
            refresh: jest.fn(),
          };
          await provider.connect(entityProviderConnection);

          const event = createRepoEvent('deleted');

          await provider.onEvent(event);

          expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(
            0,
          );
        });

        it('apply delta update removing entities', async () => {
          const config = createSingleProviderConfig();
          const provider = createProviders(config)[0];

          const entityProviderConnection: EntityProviderConnection = {
            applyMutation: jest.fn(),
            refresh: jest.fn(),
          };
          await provider.connect(entityProviderConnection);

          const event = createRepoEvent('deleted');
          const expectedEntities = createExpectedEntitiesForEvent(event);

          await provider.onEvent(event);

          expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(
            1,
          );
          expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
            type: 'delta',
            added: [],
            removed: expectedEntities,
          });
        });
      });

      describe('on repository edited event', () => {
        it('skip on non-matching org', async () => {
          const config = createSingleProviderConfig({
            providerConfig: {
              organization: 'other-org',
            },
          });
          const provider = createProviders(config)[0];

          const entityProviderConnection: EntityProviderConnection = {
            applyMutation: jest.fn(),
            refresh: jest.fn(),
          };
          await provider.connect(entityProviderConnection);

          const event = createRepoEvent('edited');

          await provider.onEvent(event);

          expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(
            0,
          );
        });

        it('apply delta update removing entities with non-matching filters', async () => {
          const config = createSingleProviderConfig({
            providerConfig: {
              filters: {
                topic: {
                  include: ['backstage-include'],
                },
              },
            },
          });
          const provider = createProviders(config)[0];

          const entityProviderConnection: EntityProviderConnection = {
            applyMutation: jest.fn(),
            refresh: jest.fn(),
          };
          await provider.connect(entityProviderConnection);

          const event = createRepoEvent('edited');
          const expectedEntities = createExpectedEntitiesForEvent(event);

          await provider.onEvent(event);

          expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(
            1,
          );
          expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
            type: 'delta',
            added: [],
            removed: expectedEntities,
          });
        });

        it('apply no delta update with matching filters', async () => {
          const config = createSingleProviderConfig({
            providerConfig: {
              filters: {
                topic: {
                  include: ['backstage-include'],
                },
              },
            },
          });
          const provider = createProviders(config)[0];

          const entityProviderConnection: EntityProviderConnection = {
            applyMutation: jest.fn(),
            refresh: jest.fn(),
          };
          await provider.connect(entityProviderConnection);

          const event = createRepoEvent('edited');
          event.eventPayload.repository.topics = ['backstage-include'];

          await provider.onEvent(event);

          expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(
            0,
          );
        });

        it('applies update when orgs case-insensitive match', async () => {
          const config = createSingleProviderConfig({
            providerConfig: {
              organization: 'test-org',
              filters: {
                topic: {
                  include: ['backstage-include'],
                },
              },
            },
          });

          const provider = createProviders(config)[0];

          const entityProviderConnection: EntityProviderConnection = {
            applyMutation: jest.fn(),
            refresh: jest.fn(),
          };
          await provider.connect(entityProviderConnection);

          const event = createRepoEvent('edited');
          event.eventPayload.organization!.login = 'Test-Org';

          await provider.onEvent(event);

          expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(
            1,
          );
        });
      });

      describe('on repository privatized event', () => {
        it('skip', async () => {
          const config = createSingleProviderConfig();
          const provider = createProviders(config)[0];

          const entityProviderConnection: EntityProviderConnection = {
            applyMutation: jest.fn(),
            refresh: jest.fn(),
          };
          await provider.connect(entityProviderConnection);

          const event = createRepoEvent('privatized');

          await provider.onEvent(event);

          expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(
            0,
          );
        });
      });

      describe('on repository publicized event', () => {
        it('skip', async () => {
          const config = createSingleProviderConfig();
          const provider = createProviders(config)[0];

          const entityProviderConnection: EntityProviderConnection = {
            applyMutation: jest.fn(),
            refresh: jest.fn(),
          };
          await provider.connect(entityProviderConnection);

          const event = createRepoEvent('publicized');

          await provider.onEvent(event);

          expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(
            0,
          );
        });
      });

      describe('on repository renamed event', () => {
        it('skip on non-matching org', async () => {
          const config = createSingleProviderConfig({
            providerConfig: {
              organization: 'other-org',
            },
          });
          const provider = createProviders(config)[0];

          const entityProviderConnection: EntityProviderConnection = {
            applyMutation: jest.fn(),
            refresh: jest.fn(),
          };
          await provider.connect(entityProviderConnection);

          const event = createRepoEvent('renamed');

          await provider.onEvent(event);

          expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(
            0,
          );
        });

        it('apply delta update removing entities with non-matching filters', async () => {
          const config = createSingleProviderConfig({
            providerConfig: {
              filters: {
                repository: 'other-.*',
              },
            },
          });
          const provider = createProviders(config)[0];

          const entityProviderConnection: EntityProviderConnection = {
            applyMutation: jest.fn(),
            refresh: jest.fn(),
          };
          await provider.connect(entityProviderConnection);

          const event = createRepoEvent(
            'renamed',
          ) as EventParams<RepositoryRenamedEvent>;
          const urlOldRepo = `https://github.com/${event.eventPayload.organization?.login}/${event.eventPayload.changes.repository.name.from}/blob/main/catalog-info.yaml`;
          const expectedEntitiesRemoved =
            createExpectedEntitiesForUrl(urlOldRepo);

          await provider.onEvent(event);

          expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(
            1,
          );
          expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
            type: 'delta',
            added: [],
            removed: expectedEntitiesRemoved,
          });
        });

        it('apply delta update removing and adding entities with matching filters', async () => {
          const config = createSingleProviderConfig();
          const provider = createProviders(config)[0];

          const entityProviderConnection: EntityProviderConnection = {
            applyMutation: jest.fn(),
            refresh: jest.fn(),
          };
          await provider.connect(entityProviderConnection);

          const event = createRepoEvent(
            'renamed',
          ) as EventParams<RepositoryRenamedEvent>;
          const urlOldRepo = `https://github.com/${event.eventPayload.organization?.login}/${event.eventPayload.changes.repository.name.from}/blob/main/catalog-info.yaml`;
          const expectedEntitiesRemoved =
            createExpectedEntitiesForUrl(urlOldRepo);
          const expectedEntitiesAdded = createExpectedEntitiesForEvent(event);

          await provider.onEvent(event);

          expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(
            2,
          );
          expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
            type: 'delta',
            added: [],
            removed: expectedEntitiesRemoved,
          });
          expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
            type: 'delta',
            added: expectedEntitiesAdded,
            removed: [],
          });
        });
      });

      describe('on repository transferred event', () => {
        it('skip on non-matching org', async () => {
          const config = createSingleProviderConfig({
            providerConfig: {
              organization: 'other-org',
            },
          });
          const provider = createProviders(config)[0];

          const entityProviderConnection: EntityProviderConnection = {
            applyMutation: jest.fn(),
            refresh: jest.fn(),
          };
          await provider.connect(entityProviderConnection);

          const event = createRepoEvent('transferred');

          await provider.onEvent(event);

          expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(
            0,
          );
        });

        it('apply no delta update with non-matching filters', async () => {
          const config = createSingleProviderConfig({
            providerConfig: {
              filters: {
                topic: {
                  include: ['backstage-include'],
                },
              },
            },
          });
          const provider = createProviders(config)[0];

          const entityProviderConnection: EntityProviderConnection = {
            applyMutation: jest.fn(),
            refresh: jest.fn(),
          };
          await provider.connect(entityProviderConnection);

          const event = createRepoEvent('transferred');

          await provider.onEvent(event);

          expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(
            0,
          );
        });

        it('apply delta update adding entities with matching filters', async () => {
          const config = createSingleProviderConfig();
          const provider = createProviders(config)[0];

          const entityProviderConnection: EntityProviderConnection = {
            applyMutation: jest.fn(),
            refresh: jest.fn(),
          };
          await provider.connect(entityProviderConnection);

          const event = createRepoEvent('transferred');
          const expectedEntitiesAdded = createExpectedEntitiesForEvent(event);

          await provider.onEvent(event);

          expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(
            1,
          );
          expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
            type: 'delta',
            added: expectedEntitiesAdded,
            removed: [],
          });
        });
      });

      describe('on repository unarchived event', () => {
        it('skip on non-matching org', async () => {
          const config = createSingleProviderConfig({
            providerConfig: {
              organization: 'other-org',
            },
          });
          const provider = createProviders(config)[0];

          const entityProviderConnection: EntityProviderConnection = {
            applyMutation: jest.fn(),
            refresh: jest.fn(),
          };
          await provider.connect(entityProviderConnection);

          const event = createRepoEvent('unarchived');

          await provider.onEvent(event);

          expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(
            0,
          );
        });

        it('apply no delta update with non-matching filters', async () => {
          const config = createSingleProviderConfig({
            providerConfig: {
              filters: {
                topic: {
                  include: ['backstage-include'],
                },
              },
            },
          });
          const provider = createProviders(config)[0];

          const entityProviderConnection: EntityProviderConnection = {
            applyMutation: jest.fn(),
            refresh: jest.fn(),
          };
          await provider.connect(entityProviderConnection);

          const event = createRepoEvent('unarchived');

          await provider.onEvent(event);

          expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(
            0,
          );
        });

        it('apply delta update adding entities with matching filters', async () => {
          const config = createSingleProviderConfig();
          const provider = createProviders(config)[0];

          const entityProviderConnection: EntityProviderConnection = {
            applyMutation: jest.fn(),
            refresh: jest.fn(),
          };
          await provider.connect(entityProviderConnection);

          const event = createRepoEvent('unarchived');
          const expectedEntitiesAdded = createExpectedEntitiesForEvent(event);

          await provider.onEvent(event);

          expect(entityProviderConnection.applyMutation).toHaveBeenCalledTimes(
            1,
          );
          expect(entityProviderConnection.applyMutation).toHaveBeenCalledWith({
            type: 'delta',
            added: expectedEntitiesAdded,
            removed: [],
          });
        });
      });
    });
  });
});
