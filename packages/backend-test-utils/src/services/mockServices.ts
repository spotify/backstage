/*
 * Copyright 2023 The Backstage Authors
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

import { auditorServiceFactory } from '@backstage/backend-defaults/auditor';
import { cacheServiceFactory } from '@backstage/backend-defaults/cache';
import { databaseServiceFactory } from '@backstage/backend-defaults/database';
import { HostDiscovery } from '@backstage/backend-defaults/discovery';
import { httpRouterServiceFactory } from '@backstage/backend-defaults/httpRouter';
import { lifecycleServiceFactory } from '@backstage/backend-defaults/lifecycle';
import { loggerServiceFactory } from '@backstage/backend-defaults/logger';
import { permissionsServiceFactory } from '@backstage/backend-defaults/permissions';
import { permissionsRegistryServiceFactory } from '@backstage/backend-defaults/permissionsRegistry';
import { rootHealthServiceFactory } from '@backstage/backend-defaults/rootHealth';
import { rootHttpRouterServiceFactory } from '@backstage/backend-defaults/rootHttpRouter';
import { rootLifecycleServiceFactory } from '@backstage/backend-defaults/rootLifecycle';
import { urlReaderServiceFactory } from '@backstage/backend-defaults/urlReader';
import {
  AuthService,
  BackstageCredentials,
  BackstageUserInfo,
  DatabaseService,
  DiscoveryService,
  HttpAuthService,
  RootInstanceMetadataService,
  RootSystemMetadataService,
  PermissionsService,
  RootConfigService,
  SchedulerService,
  ServiceFactory,
  ServiceRef,
  UserInfoService,
  coreServices,
  createServiceFactory,
  RootLoggerService,
} from '@backstage/backend-plugin-api';
import { ConfigReader } from '@backstage/config';
import { EventsService, eventsServiceRef } from '@backstage/plugin-events-node';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { JsonObject } from '@backstage/types';
import { Knex } from 'knex';
import { MockAuthService } from './MockAuthService';
import { MockHttpAuthService } from './MockHttpAuthService';
import { MockRootLoggerService } from './MockRootLoggerService';
import { MockUserInfoService } from './MockUserInfoService';
import { mockCredentials } from './mockCredentials';
import { MockEventsService } from './MockEventsService';
import { MockPermissionsService } from './MockPermissionsService';
import { createServiceMock } from './createServiceMock';
import { MockSchedulerService } from './MockSchedulerService';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { ObservableConfigProxy } from '../../../config-loader/src/sources/ObservableConfigProxy';

/** @internal */
function createLoggerMock() {
  return {
    child: jest.fn().mockImplementation(createLoggerMock),
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  };
}

/** @internal */
function simpleFactoryWithOptions<
  TService,
  TScope extends 'root' | 'plugin',
  TInstances extends 'singleton' | 'multiton',
  TOptions extends [options?: object] = [],
>(
  ref: ServiceRef<TService, TScope, TInstances>,
  factory: (...options: TOptions) => TService,
): (...options: TOptions) => ServiceFactory<TService, TScope, TInstances> {
  const factoryWithOptions = (...options: TOptions) =>
    createServiceFactory({
      service: ref as ServiceRef<TService, any, any>,
      deps: {},
      async factory() {
        return factory(...options);
      },
    });
  return Object.assign(
    factoryWithOptions,
    factoryWithOptions(...([undefined] as unknown as TOptions)),
  ) as ServiceFactory<TService, TScope, TInstances> &
    ((...options: TOptions) => ServiceFactory<TService, TScope, TInstances>);
}

/**
 * Mock implementations of the core services, to be used in tests.
 *
 * @public
 * @remarks
 *
 * There are some variations among the services depending on what needs tests
 * might have, but overall there are three main usage patterns:
 *
 * 1. Creating an actual fake service instance, often with a simplified version
 * of functionality, by calling the mock service itself as a function.
 *
 * ```ts
 * // The function often accepts parameters that control its behavior
 * const foo = mockServices.foo();
 * ```
 *
 * 2. Creating a mock service, where all methods are replaced with jest mocks, by
 * calling the service's `mock` function.
 *
 * ```ts
 * // You can optionally supply a subset of its methods to implement
 * const foo = mockServices.foo.mock({
 *   someMethod: () => 'mocked result',
 * });
 * // After exercising your test, you can make assertions on the mock:
 * expect(foo.someMethod).toHaveBeenCalledTimes(2);
 * expect(foo.otherMethod).toHaveBeenCalledWith(testData);
 * ```
 *
 * 3. Creating a service factory that behaves similarly to the mock as per above.
 *
 * ```ts
 * await startTestBackend({
 *   features: [
 *     mockServices.foo.factory({
 *       someMethod: () => 'mocked result',
 *     })
 *   ],
 * });
 * ```
 */
export namespace mockServices {
  export function rootConfig(
    options?: rootConfig.Options,
  ): RootConfigService & { update(options: { data: JsonObject }): void } {
    const config = ObservableConfigProxy.create(new AbortController());
    config.setConfig(new ConfigReader(options?.data ?? {}, 'mock-config'));
    return Object.assign(config, {
      update({ data }: { data: JsonObject }): void {
        config.setConfig(new ConfigReader(data, 'mock-config'));
      },
    });
  }
  export namespace rootConfig {
    export type Options = { data?: JsonObject };

    export const factory = simpleFactoryWithOptions(
      coreServices.rootConfig,
      rootConfig,
    );
    export const mock = createServiceMock(coreServices.rootConfig, () => ({
      get: jest.fn(),
      getBoolean: jest.fn(),
      getConfig: jest.fn(),
      getConfigArray: jest.fn(),
      getNumber: jest.fn(),
      getOptional: jest.fn(),
      getOptionalBoolean: jest.fn(),
      getOptionalConfig: jest.fn(),
      getOptionalConfigArray: jest.fn(),
      getOptionalNumber: jest.fn(),
      getOptionalString: jest.fn(),
      getOptionalStringArray: jest.fn(),
      getString: jest.fn(),
      getStringArray: jest.fn(),
      has: jest.fn(),
      keys: jest.fn(),
    }));
  }

  export function rootLogger(options?: rootLogger.Options): RootLoggerService {
    return MockRootLoggerService.create(options);
  }
  export namespace rootLogger {
    export type Options = {
      level?: 'none' | 'error' | 'warn' | 'info' | 'debug';
    };

    export const factory = simpleFactoryWithOptions(
      coreServices.rootLogger,
      rootLogger,
    );
    export const mock = createServiceMock(coreServices.rootLogger, () => ({
      child: jest.fn(),
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
    }));
  }

  export namespace auditor {
    export const factory = () => auditorServiceFactory;

    export const mock = createServiceMock(coreServices.auditor, () => ({
      createEvent: jest.fn(async _ => {
        return {
          success: jest.fn(),
          fail: jest.fn(),
        };
      }),
    }));
  }

  export function auth(options?: {
    pluginId?: string;
    disableDefaultAuthPolicy?: boolean;
  }): AuthService {
    return new MockAuthService({
      pluginId: options?.pluginId ?? 'test',
      disableDefaultAuthPolicy: Boolean(options?.disableDefaultAuthPolicy),
    });
  }
  export namespace auth {
    export const factory = () =>
      createServiceFactory({
        service: coreServices.auth,
        deps: {
          plugin: coreServices.pluginMetadata,
          config: coreServices.rootConfig,
        },
        factory({ plugin, config }) {
          const disableDefaultAuthPolicy = Boolean(
            config.getOptionalBoolean(
              'backend.auth.dangerouslyDisableDefaultAuthPolicy',
            ),
          );
          return new MockAuthService({
            pluginId: plugin.getId(),
            disableDefaultAuthPolicy,
          });
        },
      });
    export const mock = createServiceMock(coreServices.auth, () => ({
      authenticate: jest.fn(),
      getNoneCredentials: jest.fn(),
      getOwnServiceCredentials: jest.fn(),
      isPrincipal: jest.fn() as any,
      getPluginRequestToken: jest.fn(),
      getLimitedUserToken: jest.fn(),
      listPublicServiceKeys: jest.fn(),
    }));
  }

  export function discovery(): DiscoveryService {
    return HostDiscovery.fromConfig(
      new ConfigReader({
        backend: {
          // Invalid port to make sure that requests are always mocked
          baseUrl: 'http://localhost:0',
          listen: { port: 0 },
        },
      }),
    );
  }
  export namespace discovery {
    export const factory = () =>
      createServiceFactory({
        service: coreServices.discovery,
        deps: {},
        factory: () => discovery(),
      });
    export const mock = createServiceMock(coreServices.discovery, () => ({
      getBaseUrl: jest.fn(),
      getExternalBaseUrl: jest.fn(),
    }));
  }

  /**
   * Creates a mock implementation of the `HttpAuthService`.
   *
   * By default all requests without credentials are treated as requests from
   * the default mock user principal. This behavior can be configured with the
   * `defaultCredentials` option.
   */
  export function httpAuth(options?: {
    pluginId?: string;
    /**
     * The default credentials to use if there are no credentials present in the
     * incoming request.
     *
     * By default all requests without credentials are treated as authenticated
     * as the default mock user as returned from `mockCredentials.user()`.
     */
    defaultCredentials?: BackstageCredentials;
  }): HttpAuthService {
    return new MockHttpAuthService(
      options?.pluginId ?? 'test',
      options?.defaultCredentials ?? mockCredentials.user(),
    );
  }
  export namespace httpAuth {
    /**
     * Creates a mock service factory for the `HttpAuthService`.
     *
     * By default all requests without credentials are treated as requests from
     * the default mock user principal. This behavior can be configured with the
     * `defaultCredentials` option.
     */
    export const factory = (options?: {
      defaultCredentials?: BackstageCredentials;
    }) =>
      createServiceFactory({
        service: coreServices.httpAuth,
        deps: { plugin: coreServices.pluginMetadata },
        factory: ({ plugin }) =>
          new MockHttpAuthService(
            plugin.getId(),
            options?.defaultCredentials ?? mockCredentials.user(),
          ),
      });
    export const mock = createServiceMock(coreServices.httpAuth, () => ({
      credentials: jest.fn(),
      issueUserCookie: jest.fn(),
    }));
  }

  /**
   * Creates a mock implementation of the `UserInfoService`.
   *
   * By default it extracts the user's entity ref from a user principal and
   * returns that as the only ownership entity ref, but this can be overridden
   * by passing in a custom set of user info.
   */
  export function userInfo(
    customInfo?: Partial<BackstageUserInfo>,
  ): UserInfoService {
    return new MockUserInfoService(customInfo);
  }
  export namespace userInfo {
    /**
     * Creates a mock service factory for the `UserInfoService`.
     *
     * By default it extracts the user's entity ref from a user principal and
     * returns that as the only ownership entity ref.
     */
    export const factory = () =>
      createServiceFactory({
        service: coreServices.userInfo,
        deps: {},
        factory() {
          return new MockUserInfoService();
        },
      });
    export const mock = createServiceMock(coreServices.userInfo, () => ({
      getUserInfo: jest.fn(),
    }));
  }

  // TODO(Rugvip): Not all core services have implementations available here yet.
  //               some may need a bit more refactoring for it to be simpler to
  //               re-implement functioning mock versions here.
  export namespace cache {
    export const factory = () => cacheServiceFactory;
    export const mock = createServiceMock(coreServices.cache, () => ({
      delete: jest.fn(),
      get: jest.fn(),
      set: jest.fn(),
      withOptions: jest.fn(),
    }));
  }

  /**
   * Creates a mock implementation of the
   * {@link @backstage/backend-plugin-api#coreServices.database}. Just returns
   * the given `knex` instance, which is useful in combination with the
   * {@link TestDatabases} facility.
   */
  export function database(options: {
    knex: Knex;
    migrations?: { skip?: boolean };
  }): DatabaseService {
    return {
      getClient: async () => options.knex,
      migrations: options.migrations,
    };
  }
  export namespace database {
    /**
     * Creates a mock factory for the
     * {@link @backstage/backend-plugin-api#coreServices.database}. Just returns
     * the given `knex` instance if you supply one, which is useful in
     * combination with the {@link TestDatabases} facility. Otherwise, it
     * returns the regular default database factory which reads config settings.
     */
    export const factory = (options?: {
      knex: Knex;
      migrations?: { skip?: boolean };
    }) =>
      options
        ? createServiceFactory({
            service: coreServices.database,
            deps: {},
            factory: () => database(options),
          })
        : databaseServiceFactory;
    /**
     * Creates a mock of the
     * {@link @backstage/backend-plugin-api#coreServices.database}, optionally
     * with some given method implementations.
     */
    export const mock = createServiceMock(coreServices.database, () => ({
      getClient: jest.fn(),
    }));
  }

  export namespace rootHealth {
    export const factory = () => rootHealthServiceFactory;
    export const mock = createServiceMock(coreServices.rootHealth, () => ({
      getLiveness: jest.fn(),
      getReadiness: jest.fn(),
    }));
  }

  export namespace httpRouter {
    export const factory = () => httpRouterServiceFactory;
    export const mock = createServiceMock(coreServices.httpRouter, () => ({
      use: jest.fn(),
      addAuthPolicy: jest.fn(),
      addWebSocketHandler: jest.fn(),
    }));
  }

  export namespace rootHttpRouter {
    export const factory = () => rootHttpRouterServiceFactory();
    export const mock = createServiceMock(coreServices.rootHttpRouter, () => ({
      use: jest.fn(),
      addWebSocketHandler: jest.fn(),
    }));
  }

  export namespace lifecycle {
    export const factory = () => lifecycleServiceFactory;
    export const mock = createServiceMock(coreServices.lifecycle, () => ({
      addShutdownHook: jest.fn(),
      addStartupHook: jest.fn(),
    }));
  }

  export namespace logger {
    export const factory = () => loggerServiceFactory;
    export const mock = createServiceMock(coreServices.logger, () =>
      createLoggerMock(),
    );
  }

  /**
   * Creates a functional mock implementation of the
   * {@link @backstage/backend-plugin-api#PermissionsService}.
   */
  export function permissions(options?: {
    result: AuthorizeResult.ALLOW | AuthorizeResult.DENY;
  }): PermissionsService {
    return new MockPermissionsService(options);
  }
  export namespace permissions {
    /**
     * Creates a mock factory for the
     * {@link @backstage/backend-plugin-api#coreServices.permissions}. Just
     * returns the given `result` if you supply one. Otherwise, it returns the
     * regular default permissions factory.
     */
    export const factory = (options?: {
      result: AuthorizeResult.ALLOW | AuthorizeResult.DENY;
    }) =>
      options?.result
        ? createServiceFactory({
            service: coreServices.permissions,
            deps: {},
            factory: () => new MockPermissionsService(options),
          })
        : permissionsServiceFactory;
    /**
     * Creates a mock of the
     * {@link @backstage/backend-plugin-api#coreServices.permissions},
     * optionally with some given method implementations.
     */
    export const mock = createServiceMock(coreServices.permissions, () => ({
      authorize: jest.fn(),
      authorizeConditional: jest.fn(),
    }));
  }

  export namespace permissionsRegistry {
    export const factory = () => permissionsRegistryServiceFactory;
    export const mock = createServiceMock(
      coreServices.permissionsRegistry,
      () => ({
        addPermissionRules: jest.fn(),
        addPermissions: jest.fn(),
        addResourceType: jest.fn(),
        getPermissionRuleset: jest.fn(),
      }),
    );
  }

  export namespace rootLifecycle {
    export const factory = () => rootLifecycleServiceFactory;
    export const mock = createServiceMock(coreServices.rootLifecycle, () => ({
      addShutdownHook: jest.fn(),
      addBeforeShutdownHook: jest.fn(),
      addStartupHook: jest.fn(),
    }));
  }

  export function scheduler(): SchedulerService {
    return new MockSchedulerService();
  }
  export namespace scheduler {
    export const factory = (options?: {
      skipTaskRunOnStartup?: boolean;
      includeManualTasksOnStartup?: boolean;
      includeInitialDelayedTasksOnStartup?: boolean;
    }) => new MockSchedulerService().factory(options);
    export const mock = createServiceMock(coreServices.scheduler, () => ({
      createScheduledTaskRunner: jest.fn(),
      getScheduledTasks: jest.fn(),
      scheduleTask: jest.fn(),
      triggerTask: jest.fn(),
      cancelTask: jest.fn(),
    }));
  }

  export namespace urlReader {
    export const factory = () => urlReaderServiceFactory;
    export const mock = createServiceMock(coreServices.urlReader, () => ({
      readTree: jest.fn(),
      readUrl: jest.fn(),
      search: jest.fn(),
    }));
  }

  /**
   * Creates a functional mock implementation of the
   * {@link @backstage/backend-events-node#eventsServiceRef}.
   */
  export function events(): EventsService {
    return new MockEventsService();
  }
  export namespace events {
    /**
     * Creates a functional mock factory for the
     * {@link @backstage/backend-events-node#eventsServiceRef}.
     */
    export const factory = simpleFactoryWithOptions(eventsServiceRef, events);
    /**
     * Creates a mock of the
     * {@link @backstage/backend-events-node#eventsServiceRef}, optionally
     * with some given method implementations.
     */
    export const mock = createServiceMock(eventsServiceRef, () => ({
      publish: jest.fn(),
      subscribe: jest.fn(),
    }));
  }

  export function rootInstanceMetadata(): RootInstanceMetadataService {
    return {
      getId: () => 'mock',
      getInstalledPlugins: () => Promise.resolve([]),
    };
  }
  export namespace rootInstanceMetadata {
    export const mock = createServiceMock(
      coreServices.rootInstanceMetadata,
      () => ({
        getId: jest.fn().mockReturnValue('mock'),
        getInstalledPlugins: jest.fn(),
      }),
    );
    export const factory = simpleFactoryWithOptions(
      coreServices.rootInstanceMetadata,
      rootInstanceMetadata,
    );
  }

  export function rootSystemMetadata(): RootSystemMetadataService {
    return {
      getInstalledPlugins: () => Promise.resolve([]),
    };
  }
  export namespace rootSystemMetadata {
    export const mock = createServiceMock(
      coreServices.rootSystemMetadata,
      () => ({
        getInstalledPlugins: jest.fn(),
      }),
    );
    export const factory = simpleFactoryWithOptions(
      coreServices.rootSystemMetadata,
      rootSystemMetadata,
    );
  }
}
