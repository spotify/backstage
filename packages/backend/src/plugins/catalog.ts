/*
 * Copyright 2020 Spotify AB
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

import { useHotCleanup } from '@backstage/backend-common';
import {
  CatalogBuilder,
  createRouter,
  NextCatalogBuilder,
  runPeriodically,
  createNextRouter,
} from '@backstage/plugin-catalog-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  /*
   * ** WARNING **
   * DO NOT enable the experimental catalog, it will brick your database migrations.
   * This is solely for internal backstage development.
   */
  if (process.env.EXPERIMENTAL_CATALOG === '1') {
    const builder = new NextCatalogBuilder(env);
    const {
      entitiesCatalog,
      locationAnalyzer,
      processingEngine,
      locationService,
    } = await builder.build();

    // TODO(jhaals): run and manage in background.
    await processingEngine.start();

    return await createNextRouter({
      entitiesCatalog,
      locationAnalyzer,
      locationService,
      logger: env.logger,
      config: env.config,
    });
  }

  const builder = new CatalogBuilder(env);
  const {
    entitiesCatalog,
    locationsCatalog,
    higherOrderOperation,
    locationAnalyzer,
  } = await builder.build();

  useHotCleanup(
    module,
    runPeriodically(() => higherOrderOperation.refreshAllLocations(), 100000),
  );

  return await createRouter({
    entitiesCatalog,
    locationsCatalog,
    higherOrderOperation,
    locationAnalyzer,
    logger: env.logger,
    config: env.config,
  });
}
