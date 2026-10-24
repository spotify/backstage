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

import { Backend, createSpecializedBackend } from '@backstage/backend-app-api';
import {
  createServiceFactory,
  BackendFeature,
  ExtensionPoint,
  coreServices,
  createBackendModule,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { mockServices } from '../services';
import { ConfigReader } from '@backstage/config';
import express from 'express';
import { isPromise, unwrapFeature } from '@internal/backend';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  InternalBackendFeature,
  InternalBackendRegistrations,
} from '../../../backend-plugin-api/src/wiring/types';
import {
  DefaultRootHttpRouter,
  ExtendedHttpServer,
  MiddlewareFactory,
  createHealthRouter,
  createHttpServer,
} from '@backstage/backend-defaults/rootHttpRouter';
import { HostDiscovery } from '@backstage/backend-defaults/discovery';
import { connectionsServiceFactory } from '@backstage/backend-defaults/alpha';
import {
  actionsRegistryServiceMock,
  actionsServiceMock,
  metricsServiceMock,
  tracingServiceMock,
} from '../alpha/services';

/** @public */
export interface TestBackendOptions<TExtensionPoints extends any[]> {
  extensionPoints?: readonly [
    ...{
      [index in keyof TExtensionPoints]: [
        ExtensionPoint<TExtensionPoints[index]>,
        Partial<TExtensionPoints[index]>,
      ];
    },
  ];
  features?: Array<BackendFeature | Promise<{ default: BackendFeature }>>;
}

/** @public */
export interface TestBackend extends Backend {
  /**
   * Provides access to the underling HTTP server for use with utilities
   * such as `supertest`.
   *
   * If the root http router service has been replaced, this will throw an error.
   */
  readonly server: ExtendedHttpServer;
}

export const defaultServiceFactories = [
  mockServices.auth.factory(),
  mockServices.auditor.factory(),
  mockServices.cache.factory(),
  mockServices.rootConfig.factory(),
  mockServices.database.factory(),
  mockServices.httpAuth.factory(),
  mockServices.httpRouter.factory(),
  mockServices.lifecycle.factory(),
  mockServices.logger.factory(),
  mockServices.permissions.factory(),
  mockServices.permissionsRegistry.factory(),
  mockServices.rootHealth.factory(),
  mockServices.rootLifecycle.factory(),
  mockServices.rootLogger.factory(),
  mockServices.scheduler.factory(),
  mockServices.userInfo.factory(),
  mockServices.urlReader.factory(),
  mockServices.events.factory(),

  // Alpha services
  connectionsServiceFactory,
  actionsRegistryServiceMock.factory(),
  actionsServiceMock.factory(),
  metricsServiceMock.factory(),
  tracingServiceMock.factory(),
];

/**
 * Given a set of features, return an array of plugins that ensures that each
 * module in the provided set of features has a corresponding plugin.
 * @internal
 */
function createPluginsForOrphanModules(features: Array<BackendFeature>) {
  const pluginIds = new Set<string>();
  const modulePluginIds = new Set<string>();

  for (const feature of features) {
    if (isInternalBackendRegistrations(feature)) {
      const registrations = feature.getRegistrations();
      for (const registration of registrations) {
        if (
          registration.type === 'plugin' ||
          registration.type === 'plugin-v1.1'
        ) {
          pluginIds.add(registration.pluginId);
        } else if (
          registration.type === 'module' ||
          registration.type === 'module-v1.1'
        ) {
          modulePluginIds.add(registration.pluginId);
        }
      }
    }
  }

  for (const pluginId of pluginIds) {
    modulePluginIds.delete(pluginId);
  }

  return Array.from(modulePluginIds).map(pluginId =>
    createBackendPlugin({
      pluginId,
      register(reg) {
        reg.registerInit({ deps: {}, async init() {} });
      },
    }),
  );
}

/**
 * Given a set of extension points and features, find the extension
 * points that we mock and tie them to the correct plugin ID.
 * @returns
 */
function createExtensionPointTestModules(
  features: Array<BackendFeature>,
  extensionPointTuples?: readonly [
    ref: ExtensionPoint<unknown>,
    impl: unknown,
  ][],
): Array<BackendFeature> {
  if (!extensionPointTuples) {
    return [];
  }

  const registrations = features.flatMap(feature => {
    if (isInternalBackendRegistrations(feature)) {
      return feature.getRegistrations();
    }
    return [];
  });

  const extensionPointMap = new Map(
    extensionPointTuples.map(ep => [ep[0].id, ep]),
  );
  const extensionPointsToSort = new Set(extensionPointMap.keys());
  const extensionPointsByPlugin = new Map<string, string[]>();

  for (const registration of registrations) {
    if (registration.type === 'module' || registration.type === 'module-v1.1') {
      const testDep = Object.values(registration.init.deps).filter(dep =>
        extensionPointsToSort.has(dep.id),
      );
      if (testDep.length > 0) {
        let points = extensionPointsByPlugin.get(registration.pluginId);
        if (!points) {
          points = [];
          extensionPointsByPlugin.set(registration.pluginId, points);
        }
        for (const { id } of testDep) {
          points.push(id);
          extensionPointsToSort.delete(id);
        }
      }
    }
  }

  if (extensionPointsToSort.size > 0) {
    const list = Array.from(extensionPointsToSort)
      .map(id => `'${id}'`)
      .join(', ');
    throw new Error(
      `Unable to determine the plugin ID of extension point(s) ${list}. ` +
        'Tested extension points must be depended on by one or more tested modules.',
    );
  }

  const modules = [];

  for (const [pluginId, pluginExtensionPointIds] of extensionPointsByPlugin) {
    modules.push(
      createBackendModule({
        pluginId,
        moduleId: 'test-extension-point-registration',
        register(reg) {
          for (const id of pluginExtensionPointIds) {
            const tuple = extensionPointMap.get(id)!;
            reg.registerExtensionPoint(...tuple);
          }

          reg.registerInit({ deps: {}, async init() {} });
        },
      }),
    );
  }

  return modules;
}

const backendInstancesToCleanUp = new Array<Backend>();

/** @public */
export async function startTestBackend<TExtensionPoints extends any[]>(
  options: TestBackendOptions<TExtensionPoints>,
): Promise<TestBackend> {
  const { extensionPoints, ...otherOptions } = options;

  // Unpack input into awaited plain BackendFeatures
  const features: BackendFeature[] = await Promise.all(
    options.features?.map(async val => {
      if (isPromise(val)) {
        const { default: feature } = await val;
        return unwrapFeature(feature);
      }
      return unwrapFeature(val);
    }) ?? [],
  );

  let server: ExtendedHttpServer;

  const rootHttpRouterFactory = createServiceFactory({
    service: coreServices.rootHttpRouter,
    deps: {
      config: coreServices.rootConfig,
      lifecycle: coreServices.rootLifecycle,
      rootLogger: coreServices.rootLogger,
      health: coreServices.rootHealth,
    },
    async factory({ config, lifecycle, rootLogger, health }) {
      const router = DefaultRootHttpRouter.create();
      const logger = rootLogger.child({ service: 'rootHttpRouter' });

      const app = express();

      const middleware = MiddlewareFactory.create({ config, logger });
      const healthRouter = createHealthRouter({ config, health });

      app.use(healthRouter);
      app.use(router.handler());
      app.use(middleware.notFound());
      app.use(middleware.error());

      server = await createHttpServer(
        app,
        { listen: { host: '', port: 0 } },
        { logger },
      );

      router.attachWebSocketServer(server, logger);
      lifecycle.addShutdownHook(
        () => {
          router.closeWebSockets();
          return server.stop();
        },
        { logger },
      );

      await server.start();

      return router;
    },
  });

  const discoveryFactory = createServiceFactory({
    service: coreServices.discovery,
    deps: {
      rootHttpRouter: coreServices.rootHttpRouter,
    },
    async factory() {
      if (!server) {
        throw new Error('Test server not started yet');
      }
      const port = server.port();
      const discovery = HostDiscovery.fromConfig(
        new ConfigReader({
          backend: { baseUrl: `http://localhost:${port}`, listen: { port } },
        }),
      );
      return discovery;
    },
  });

  const backend = createSpecializedBackend({
    ...otherOptions,
    defaultServiceFactories: [
      ...defaultServiceFactories,
      rootHttpRouterFactory,
      discoveryFactory,
    ],
  });

  backendInstancesToCleanUp.push(backend);

  for (const m of createExtensionPointTestModules(features, extensionPoints)) {
    backend.add(m);
  }
  for (const p of createPluginsForOrphanModules(features)) {
    backend.add(p);
  }
  for (const feature of features) {
    backend.add(feature);
  }

  await backend.start();

  return Object.assign(backend, {
    get server() {
      if (!server) {
        throw new Error('TestBackend server is not available');
      }
      return server;
    },
  });
}

let registered = false;
function registerTestHooks() {
  if (typeof afterAll !== 'function') {
    return;
  }
  if (registered) {
    return;
  }
  registered = true;

  afterAll(async () => {
    await Promise.all(
      backendInstancesToCleanUp.map(async backend => {
        try {
          await backend.stop();
        } catch (error) {
          console.error(`Failed to stop backend after tests, ${error}`);
        }
      }),
    );
    backendInstancesToCleanUp.length = 0;
  });
}

registerTestHooks();

function toInternalBackendFeature(
  feature: BackendFeature,
): InternalBackendFeature {
  if (feature.$$type !== '@backstage/BackendFeature') {
    throw new Error(`Invalid BackendFeature, bad type '${feature.$$type}'`);
  }
  const internal = feature as InternalBackendFeature;
  if (internal.version !== 'v1') {
    throw new Error(
      `Invalid BackendFeature, bad version '${internal.version}'`,
    );
  }
  return internal;
}

function isInternalBackendRegistrations(
  feature: BackendFeature,
): feature is InternalBackendRegistrations {
  const internal = toInternalBackendFeature(feature);
  if (internal.featureType === 'registrations') {
    return true;
  }
  // Backwards compatibility for v1 registrations that use duck typing
  return 'getRegistrations' in internal;
}
