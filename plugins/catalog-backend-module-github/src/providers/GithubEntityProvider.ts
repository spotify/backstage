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

import { Config } from '@backstage/config';
import {
  GithubAppCredentialsMux,
  GithubCredentialsProvider,
  GithubIntegration,
  GithubIntegrationConfig,
  ScmIntegrations,
  SingleInstanceGithubCredentialsProvider,
} from '@backstage/integration';
import {
  DeferredEntity,
  EntityProvider,
  EntityProviderConnection,
  locationSpecToLocationEntity,
} from '@backstage/plugin-catalog-node';

import { LocationSpec } from '@backstage/plugin-catalog-common';

import { randomUUID } from 'node:crypto';
import {
  GithubEntityProviderConfig,
  readProviderConfigs,
} from './GithubEntityProviderConfig';
import {
  createGraphqlClient,
  getOrganizationRepositories,
  getOrganizationRepository,
  RepositoryResponse,
  GithubPageSizes,
  DEFAULT_PAGE_SIZES,
} from '../lib/github';
import {
  satisfiesForkFilter,
  satisfiesTopicFilter,
  satisfiesVisibilityFilter,
} from '../lib/util';

import {
  EventParams,
  EventsService,
  EventSubscriber,
} from '@backstage/plugin-events-node';
import {
  Commit,
  PushEvent,
  RepositoryArchivedEvent,
  RepositoryDeletedEvent,
  RepositoryEditedEvent,
  RepositoryEvent,
  RepositoryRenamedEvent,
  RepositoryTransferredEvent,
  RepositoryUnarchivedEvent,
} from '@octokit/webhooks-types';
import { Minimatch } from 'minimatch';
import {
  LoggerService,
  SchedulerService,
  SchedulerServiceTaskRunner,
} from '@backstage/backend-plugin-api';

const EVENT_TOPICS = ['github.push', 'github.repository'];

type Repository = {
  name: string;
  url: string;
  isArchived: boolean;
  isFork: boolean;
  repositoryTopics: string[];
  defaultBranchRef?: string;
  isCatalogInfoFilePresent: boolean;
  visibility: string;
  organization: string;
};

/**
 * Discovers catalog files located in [GitHub](https://github.com).
 * The provider will search your GitHub account and register catalog files matching the configured path
 * as Location entity and via following processing steps add all contained catalog entities.
 * This can be useful as an alternative to static locations or manually adding things to the catalog.
 *
 * @public
 */
export class GithubEntityProvider implements EntityProvider, EventSubscriber {
  private readonly config: GithubEntityProviderConfig;
  private readonly events?: EventsService;
  private readonly logger: LoggerService;
  private readonly integration: GithubIntegrationConfig;
  private readonly scheduleFn: () => Promise<void>;
  private connection?: EntityProviderConnection;
  private readonly githubCredentialsProvider: GithubCredentialsProvider;

  static fromConfig(
    config: Config,
    options: {
      events?: EventsService;
      logger: LoggerService;
      schedule?: SchedulerServiceTaskRunner;
      scheduler?: SchedulerService;
    },
  ): GithubEntityProvider[] {
    if (!options.schedule && !options.scheduler) {
      throw new Error('Either schedule or scheduler must be provided.');
    }

    const integrations = ScmIntegrations.fromConfig(config);

    return readProviderConfigs(config).map(providerConfig => {
      const integrationHost = providerConfig.host;
      const integration = integrations.github.byHost(integrationHost);

      if (!integration) {
        throw new Error(
          `There is no GitHub config that matches host ${integrationHost}. Please add a configuration entry for it under integrations.github`,
        );
      }

      const taskRunner =
        options.schedule ??
        options.scheduler!.createScheduledTaskRunner(providerConfig.schedule!);

      return new GithubEntityProvider(
        providerConfig,
        integration,
        options.logger,
        taskRunner,
        options.events,
      );
    });
  }

  private constructor(
    config: GithubEntityProviderConfig,
    integration: GithubIntegration,
    logger: LoggerService,
    taskRunner: SchedulerServiceTaskRunner,
    events?: EventsService,
  ) {
    this.config = config;
    this.events = events;
    this.integration = integration.config;
    this.logger = logger.child({
      target: this.getProviderName(),
    });
    this.scheduleFn = this.createScheduleFn(taskRunner);
    this.githubCredentialsProvider =
      SingleInstanceGithubCredentialsProvider.create(integration.config);
  }

  /** {@inheritdoc @backstage/plugin-catalog-node#EntityProvider.getProviderName} */
  getProviderName(): string {
    return `github-provider:${this.config.id}`;
  }

  /** {@inheritdoc @backstage/plugin-catalog-node#EntityProvider.connect} */
  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;
    await this.events?.subscribe({
      id: this.getProviderName(),
      topics: EVENT_TOPICS,
      onEvent: params => this.onEvent(params),
    });
    return await this.scheduleFn();
  }

  private createScheduleFn(
    taskRunner: SchedulerServiceTaskRunner,
  ): () => Promise<void> {
    return async () => {
      const taskId = `${this.getProviderName()}:refresh`;
      return taskRunner.run({
        id: taskId,
        fn: async () => {
          const logger = this.logger.child({
            class: GithubEntityProvider.prototype.constructor.name,
            taskId,
            taskInstanceId: randomUUID(),
          });
          try {
            await this.refresh(logger);
          } catch (error) {
            logger.error(
              `${this.getProviderName()} refresh failed, ${error}`,
              error,
            );
          }
        },
      });
    };
  }

  async refresh(logger: LoggerService) {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    const targets = await this.findCatalogFiles();
    const matchingTargets = this.matchesFilters(targets);
    const entities = this.toDeferredEntitiesFromRepos(matchingTargets);

    await this.connection.applyMutation({
      type: 'full',
      entities,
    });

    logger.info(
      `Read ${targets.length} GitHub repositories (${entities.length} matching the pattern)`,
    );
  }

  private async getOrganizations(): Promise<string[]> {
    if (this.config.organization) return [this.config.organization];

    const githubAppMux = new GithubAppCredentialsMux(this.integration, [
      this.config.app!,
    ]);
    const installs = await githubAppMux.getAllInstallations();
    return installs
      .map(install =>
        install.target_type === 'Organization' &&
        install.account &&
        'login' in install.account
          ? install.account.login
          : undefined,
      )
      .filter(Boolean) as string[];
  }

  private async createGraphqlClient(organization: string) {
    const host = this.integration.host;
    const orgUrl = `https://${host}/${organization}`;

    const { headers } = await this.githubCredentialsProvider.getCredentials({
      url: orgUrl,
    });

    return createGraphqlClient({
      headers,
      baseUrl: this.integration.apiBaseUrl!,
      logger: this.logger,
    });
  }

  // go to the server and get all repositories
  private async findCatalogFiles(): Promise<Repository[]> {
    const organizations = await this.getOrganizations();
    const catalogPath = this.config.catalogPath;
    const chunkSize = this.config.queryLimits?.repositoryChunkSize;

    let repositories: Repository[] = [];
    for (const organization of organizations) {
      const pageSizes: GithubPageSizes = {
        ...DEFAULT_PAGE_SIZES,
        ...this.config.pageSizes,
      };

      let startCursor: string | undefined = undefined;

      do {
        const client = await this.createGraphqlClient(organization);

        const { repositories: repositoriesFromGithub, nextCursor } =
          await getOrganizationRepositories(
            client,
            organization,
            catalogPath,
            pageSizes,
            this.config.filters.branch,
            {
              allowArchived: this.config.filters.allowArchived,
              startCursor,
              chunkSize,
            },
          );
        repositories = repositories.concat(
          repositoriesFromGithub.map(r =>
            this.createRepoFromGithubResponse(r, organization),
          ),
        );

        startCursor = nextCursor;
      } while (startCursor);
    }

    if (this.config.validateLocationsExist) {
      return repositories.filter(
        repository => repository.isCatalogInfoFilePresent,
      );
    }

    return repositories;
  }

  private matchesFilters(repositories: Repository[]): Repository[] {
    const repositoryFilter = this.config.filters.repository;
    const topicFilters = this.config.filters.topic;
    const allowForks = this.config.filters.allowForks;
    const visibilities = this.config.filters.visibility ?? [];
    const allowArchived = this.config.filters.allowArchived;

    return repositories.filter(r => {
      const repoTopics: string[] = r.repositoryTopics;
      return (
        (allowArchived || !r.isArchived) &&
        (!repositoryFilter || repositoryFilter.test(r.name)) &&
        satisfiesTopicFilter(repoTopics, topicFilters) &&
        satisfiesForkFilter(allowForks, r.isFork) &&
        satisfiesVisibilityFilter(visibilities, r.visibility) &&
        r.defaultBranchRef
      );
    });
  }

  private createLocationUrl(repository: Repository): string {
    const branch =
      this.config.filters.branch || repository.defaultBranchRef || '-';
    const catalogFile = this.config.catalogPath.startsWith('/')
      ? this.config.catalogPath.substring(1)
      : this.config.catalogPath;
    return `${repository.url}/blob/${branch}/${catalogFile}`;
  }

  private static toLocationSpec(target: string): LocationSpec {
    return {
      type: 'url',
      target: target,
      presence: 'optional',
    };
  }

  /** {@inheritdoc @backstage/plugin-events-node#EventSubscriber.onEvent} */
  async onEvent(params: EventParams): Promise<void> {
    this.logger.debug(`Received event for topic ${params.topic}`);
    if (EVENT_TOPICS.some(topic => topic === params.topic)) {
      if (!this.connection) {
        throw new Error('Not initialized');
      }

      switch (params.topic) {
        case 'github.push':
          await this.onPush(params.eventPayload as PushEvent);
          return;

        case 'github.repository':
          await this.onRepoChange(params.eventPayload as RepositoryEvent);
          return;

        default: // should never be reached
          this.logger.warn(
            `Missing implementation for event of topic ${params.topic}`,
          );
      }
    }
  }

  /** {@inheritdoc @backstage/plugin-events-node#EventSubscriber.supportsEventTopics} */
  supportsEventTopics(): string[] {
    return EVENT_TOPICS;
  }

  private async onPush(event: PushEvent) {
    const configOrganizations = (await this.getOrganizations()).map(org =>
      org.toLowerCase(),
    );
    const eventOrganization = event.organization?.login.toLowerCase();

    if (
      !eventOrganization ||
      !configOrganizations.includes(eventOrganization)
    ) {
      this.logger.debug(
        `skipping push event from organization ${event.organization?.login}`,
      );
      return;
    }

    const repoName = event.repository.name;
    const repoUrl = event.repository.html_url;
    this.logger.debug(`handle github:push event for ${repoName} - ${repoUrl}`);

    const branch =
      this.config.filters.branch || event.repository.default_branch;

    if (event.ref !== `refs/heads/${branch}`) {
      this.logger.debug(`skipping push event from ref ${event.ref}`);
      return;
    }

    const repository = this.createRepoFromEvent(event);

    const matchingTargets = this.matchesFilters([repository]);
    if (matchingTargets.length === 0) {
      this.logger.debug(
        `skipping push event from repository ${repoName} because didn't match provider filters`,
      );
      return;
    }

    // the commit has information about the files (added,removed,modified)
    // so we will process the change based in this data
    // https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#push
    const added = this.collectDeferredEntitiesFromCommit(
      repoUrl,
      branch,
      event.commits,
      (commit: Commit) => [...commit.added],
    );
    const removed = this.collectDeferredEntitiesFromCommit(
      repoUrl,
      branch,
      event.commits,
      (commit: Commit) => [...commit.removed],
    );
    const modified = this.collectFilesFromCommit(
      event.commits,
      (commit: Commit) => [...commit.modified],
    );

    if (modified.length > 0) {
      const catalogPath = this.config.catalogPath.startsWith('/')
        ? this.config.catalogPath.substring(1)
        : this.config.catalogPath;

      await this.connection!.refresh({
        keys: [
          ...new Set([
            ...modified.map(
              filePath => `url:${repoUrl}/tree/${branch}/${filePath}`,
            ),
            ...modified.map(
              filePath => `url:${repoUrl}/blob/${branch}/${filePath}`,
            ),
            `url:${repoUrl}/tree/${branch}/${catalogPath}`,
          ]),
        ],
      });
    }

    if (added.length > 0 || removed.length > 0) {
      await this.connection!.applyMutation({
        type: 'delta',
        added: added,
        removed: removed,
      });
    }

    this.logger.info(
      `Processed Github push event: added ${added.length} - removed ${removed.length} - modified ${modified.length}`,
    );
  }

  private async onRepoChange(event: RepositoryEvent) {
    const configOrganizations = (await this.getOrganizations()).map(org =>
      org.toLowerCase(),
    );
    const eventOrganization = event.organization?.login.toLowerCase();

    if (
      !eventOrganization ||
      !configOrganizations.includes(eventOrganization)
    ) {
      this.logger.debug(
        `skipping repository event from organization ${event.organization?.login}`,
      );
      return;
    }

    const action = event.action;
    switch (action) {
      case 'archived':
        await this.onRepoArchived(event as RepositoryArchivedEvent);
        return;

      // A repository was created.
      case 'created':
        // skip these events
        return;

      case 'deleted':
        await this.onRepoDeleted(event as RepositoryDeletedEvent);
        return;

      case 'edited':
        await this.onRepoEdited(event as RepositoryEditedEvent);
        return;

      // The visibility of a repository was changed to `private`.
      case 'privatized':
        // skip these events
        return;

      // The visibility of a repository was changed to `public`.
      case 'publicized':
        // skip these events
        return;

      case 'renamed':
        await this.onRepoRenamed(event as RepositoryRenamedEvent);
        return;

      case 'transferred':
        await this.onRepoTransferred(event as RepositoryTransferredEvent);
        return;

      case 'unarchived':
        await this.onRepoUnarchived(event as RepositoryUnarchivedEvent);
        return;

      default: // should never be reached
        this.logger.warn(
          `Missing implementation for event of topic repository with action ${action}`,
        );
    }
  }

  /**
   * A repository was archived.
   *
   * Removes all entities associated with the repository.
   *
   * @param event - The repository archived event.
   */
  private async onRepoArchived(event: RepositoryArchivedEvent) {
    if (this.config.filters.allowArchived) return;

    const repository = this.createRepoFromEvent(event);
    await this.removeEntitiesForRepo(repository);
    this.logger.debug(
      `Removed entities for archived repository ${repository.name}`,
    );
  }

  /**
   * A repository was deleted.
   *
   * Removes all entities associated with the repository.
   *
   * @param event - The repository deleted event.
   */
  private async onRepoDeleted(event: RepositoryDeletedEvent) {
    const repository = this.createRepoFromEvent(event);
    await this.removeEntitiesForRepo(repository);
    this.logger.debug(
      `Removed entities for deleted repository ${repository.name}`,
    );
  }

  /**
   * The topics, default branch, description, or homepage of a repository was changed.
   *
   * We are interested in potential topic changes as these can be used as part of the filters.
   *
   * Removes all entities associated with the repository if the repository no longer matches the filters.
   *
   * @param event - The repository edited event.
   */
  private async onRepoEdited(event: RepositoryEditedEvent) {
    const repository = this.createRepoFromEvent(event);

    const matchingTargets = this.matchesFilters([repository]);
    if (matchingTargets.length === 0) {
      await this.removeEntitiesForRepo(repository);
    }
    // else: repository is (still) matching the filters, so we don't need to do anything
  }

  /**
   * The name of a repository was changed.
   *
   * Removes all entities associated with the repository's old name.
   * Creates new entities for the repository's new name if it still matches the filters.
   *
   * @param event - The repository renamed event.
   */
  private async onRepoRenamed(event: RepositoryRenamedEvent) {
    const repository = this.createRepoFromEvent(event);
    const oldRepoName = event.changes.repository.name.from;
    const urlParts = repository.url.split('/');
    urlParts[urlParts.length - 1] = oldRepoName;
    const oldRepoUrl = urlParts.join('/');
    const oldRepository: Repository = {
      ...repository,
      name: oldRepoName,
      url: oldRepoUrl,
    };
    await this.removeEntitiesForRepo(oldRepository);

    const matchingTargets = this.matchesFilters([repository]);
    if (matchingTargets.length === 0) {
      this.logger.debug(
        `skipping repository renamed event for repository ${repository.name} because it didn't match provider filters`,
      );
      return;
    }

    await this.addEntitiesForRepo(repository);
  }

  /**
   * Ownership of the repository was transferred to a user or organization account.
   * This event is only sent to the account where the ownership is transferred.
   * To receive the `repository.transferred` event, the new owner account must have the GitHub App installed,
   * and the App must be subscribed to "Repository" events.
   *
   * Creates new entities for the repository if it matches the filters.
   *
   * @param event - The repository transferred event.
   */
  private async onRepoTransferred(event: RepositoryTransferredEvent) {
    const repository = this.createRepoFromEvent(event);

    const matchingTargets = this.matchesFilters([repository]);
    if (matchingTargets.length === 0) {
      this.logger.debug(
        `skipping repository transferred event for repository ${repository.name} because it didn't match provider filters`,
      );
      return;
    }

    await this.addEntitiesForRepo(repository);
  }

  /**
   * A previously archived repository was unarchived.
   *
   * Creates new entities for the repository if it matches the filters.
   *
   * @param event - The repository unarchived event.
   */
  private async onRepoUnarchived(event: RepositoryUnarchivedEvent) {
    const repository = this.createRepoFromEvent(event);

    const matchingTargets = this.matchesFilters([repository]);
    if (matchingTargets.length === 0) {
      this.logger.debug(
        `skipping repository unarchived event for repository ${repository.name} because it didn't match provider filters`,
      );
      return;
    }

    await this.addEntitiesForRepo(repository);
  }

  private async removeEntitiesForRepo(repository: Repository) {
    const removed = this.toDeferredEntitiesFromRepos([repository]);
    await this.connection!.applyMutation({
      type: 'delta',
      added: [],
      removed: removed,
    });
  }

  private async addEntitiesForRepo(repository: Repository) {
    if (this.config.validateLocationsExist) {
      const organization = repository.organization;
      const catalogPath = this.config.catalogPath;
      const client = await this.createGraphqlClient(organization);

      const repositoryFromGithub = await getOrganizationRepository(
        client,
        organization,
        repository.name,
        catalogPath,
        this.config.filters.branch,
      ).then(r =>
        r ? this.createRepoFromGithubResponse(r, organization) : null,
      );

      if (!repositoryFromGithub?.isCatalogInfoFilePresent) {
        return;
      }
    }

    const added = this.toDeferredEntitiesFromRepos([repository]);
    await this.connection!.applyMutation({
      type: 'delta',
      added: added,
      removed: [],
    });
  }

  private createRepoFromEvent(event: RepositoryEvent | PushEvent): Repository {
    return {
      // $.repository.url can be a value like
      // "https://api.github.com/repos/{org}/{repo}"
      // or "https://github.com/{org}/{repo}"
      url: event.repository.html_url,
      name: event.repository.name,
      defaultBranchRef: event.repository.default_branch,
      repositoryTopics: event.repository.topics,
      isArchived: event.repository.archived,
      isFork: event.repository.fork,
      // we can consider this file present because
      // only the catalog file will be recovered from the commits
      isCatalogInfoFilePresent: true,
      visibility: event.repository.visibility,
      organization: event.repository.owner.login,
    };
  }

  private createRepoFromGithubResponse(
    repositoryResponse: RepositoryResponse,
    organization: string,
  ): Repository {
    return {
      url: repositoryResponse.url,
      name: repositoryResponse.name,
      defaultBranchRef: repositoryResponse.defaultBranchRef?.name,
      repositoryTopics: repositoryResponse.repositoryTopics.nodes.map(
        t => t.topic.name,
      ),
      isArchived: repositoryResponse.isArchived,
      isFork: repositoryResponse.isFork,
      isCatalogInfoFilePresent:
        repositoryResponse.catalogInfoFile?.__typename === 'Blob' &&
        repositoryResponse.catalogInfoFile.text !== '',
      visibility: repositoryResponse.visibility,
      organization,
    };
  }

  private collectDeferredEntitiesFromCommit(
    repositoryUrl: string,
    branch: string,
    commits: Commit[],
    transformOperation: (commit: Commit) => string[],
  ): DeferredEntity[] {
    const catalogFiles = this.collectFilesFromCommit(
      commits,
      transformOperation,
    );
    return this.toDeferredEntities(
      catalogFiles.map(
        filePath => `${repositoryUrl}/blob/${branch}/${filePath}`,
      ),
    );
  }

  private collectFilesFromCommit(
    commits: Commit[],
    transformOperation: (commit: Commit) => string[],
  ): string[] {
    const catalogFile = this.config.catalogPath.startsWith('/')
      ? this.config.catalogPath.substring(1)
      : this.config.catalogPath;

    const matcher = new Minimatch(catalogFile);
    return commits
      .map(transformOperation)
      .flat()
      .filter(file => matcher.match(file));
  }

  private toDeferredEntities(targets: string[]): DeferredEntity[] {
    return targets
      .map(target => {
        const location = GithubEntityProvider.toLocationSpec(target);

        return locationSpecToLocationEntity({ location });
      })
      .map(entity => {
        return {
          locationKey: this.getProviderName(),
          entity: entity,
        };
      });
  }

  private toDeferredEntitiesFromRepos(
    repositories: Repository[],
  ): DeferredEntity[] {
    return repositories
      .map(repository => this.createLocationUrl(repository))
      .map(GithubEntityProvider.toLocationSpec)
      .map(location => {
        return {
          locationKey: this.getProviderName(),
          entity: locationSpecToLocationEntity({ location }),
        };
      });
  }
}

/*
 * Helpers
 */

export function parseUrl(urlString: string): {
  org: string;
  repoSearchPath: RegExp;
  catalogPath: string;
  branch: string;
  host: string;
} {
  const url = new URL(urlString);
  const path = url.pathname.slice(1).split('/');

  // /backstage/techdocs-*/blob/master/catalog-info.yaml
  // can also be
  // /backstage
  if (path.length > 2 && path[0].length && path[1].length) {
    return {
      org: decodeURIComponent(path[0]),
      repoSearchPath: escapeRegExp(decodeURIComponent(path[1])),
      catalogPath: `/${decodeURIComponent(path.slice(4).join('/'))}`,
      branch: decodeURIComponent(path[3]),
      host: url.host,
    };
  } else if (path.length === 1 && path[0].length) {
    return {
      org: decodeURIComponent(path[0]),
      repoSearchPath: escapeRegExp('*'),
      catalogPath: '/catalog-info.yaml',
      branch: '-',
      host: url.host,
    };
  }

  throw new Error(`Failed to parse ${urlString}`);
}

export function escapeRegExp(str: string): RegExp {
  return new RegExp(`^${str.replace(/\*/g, '.*')}$`);
}
