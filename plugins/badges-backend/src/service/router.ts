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

import express from 'express';
import Router from 'express-promise-router';
import {
  errorHandler,
  PluginEndpointDiscovery,
} from '@backstage/backend-common';
import { CatalogApi, CatalogClient } from '@backstage/catalog-client';
import { Config } from '@backstage/config';
import { NotFoundError } from '@backstage/errors';
import { BadgeBuilder, DefaultBadgeBuilder } from '../lib/BadgeBuilder';
import { BadgeContext, BadgeFactories } from '../types';

export interface RouterOptions {
  badgeBuilder?: BadgeBuilder;
  badgeFactories?: BadgeFactories;
  catalog?: CatalogApi;
  config: Config;
  discovery: PluginEndpointDiscovery;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const catalog =
    options.catalog || new CatalogClient({ discoveryApi: options.discovery });
  const badgeBuilder =
    options.badgeBuilder ||
    new DefaultBadgeBuilder(options.badgeFactories || {});
  const router = Router();

  router.get('/entity/:namespace/:kind/:name/badge-specs', async (req, res) => {
    const { namespace, kind, name } = req.params;
    const entity = await catalog.getEntityByName(
      { namespace, kind, name },
      {
        token: getBearerToken(req.headers.authorization),
      },
    );
    if (!entity) {
      throw new NotFoundError(
        `No ${kind} entity in ${namespace} named "${name}"`,
      );
    }

    const specs = [];
    for (const badgeInfo of await badgeBuilder.getBadges()) {
      const context: BadgeContext = {
        badgeUrl: await getBadgeUrl(
          namespace,
          kind,
          name,
          badgeInfo.id,
          options,
        ),
        config: options.config,
        entity,
      };

      const badge = await badgeBuilder.createBadgeJson({ badgeInfo, context });
      specs.push(badge);
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(specs, null, 2));
  });

  router.get(
    '/entity/:namespace/:kind/:name/badge/:badgeId',
    async (req, res) => {
      const { namespace, kind, name, badgeId } = req.params;
      const entity = await catalog.getEntityByName(
        { namespace, kind, name },
        {
          token: getBearerToken(req.headers.authorization),
        },
      );
      if (!entity) {
        throw new NotFoundError(
          `No ${kind} entity in ${namespace} named "${name}"`,
        );
      }

      let format =
        req.accepts(['image/svg+xml', 'application/json']) || 'image/svg+xml';
      if (req.query.format === 'json') {
        format = 'application/json';
      }

      const badgeOptions = {
        badgeInfo: { id: badgeId },
        context: {
          badgeUrl: await getBadgeUrl(namespace, kind, name, badgeId, options),
          config: options.config,
          entity,
        },
      };

      let data: string;
      if (format === 'application/json') {
        data = JSON.stringify(
          await badgeBuilder.createBadgeJson(badgeOptions),
          null,
          2,
        );
      } else {
        data = await badgeBuilder.createBadgeSvg(badgeOptions);
      }

      res.setHeader('Content-Type', format);
      res.status(200).send(data);
    },
  );

  router.use(errorHandler());

  return router;
}

async function getBadgeUrl(
  namespace: string,
  kind: string,
  name: string,
  badgeId: string,
  options: RouterOptions,
): Promise<string> {
  const baseUrl = await options.discovery.getExternalBaseUrl('badges');
  return `${baseUrl}/entity/${namespace}/${kind}/${name}/badge/${badgeId}`;
}

function getBearerToken(header?: string): string | undefined {
  return header?.match(/Bearer\s+(\S+)/i)?.[1];
}
