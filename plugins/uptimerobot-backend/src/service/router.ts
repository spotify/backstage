/*
 * Copyright 2021 Spotify AB
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

import { Groups, RouterOptions } from '../../types';
import { parseAnnotation } from '../utils';
import { parseEntityRef } from '@backstage/catalog-model';
import { UPTIMEROBOT_MONITORS_ANNOTATION } from './../../constants';
import { UptimerobotClient } from './UptimerobotClient';
import express from 'express';
import Router from 'express-promise-router';

export async function createRouter({
  catalogClient,
  config,
  logger,
}: RouterOptions): Promise<express.Router> {
  logger.info('Initializing UptimeRobot backend.');

  let uptimerobotClient: UptimerobotClient;
  try {
    uptimerobotClient = new UptimerobotClient(config);
  } catch (error) {
    logger.error(error.message);
    return Router();
  }

  const router = Router();
  router.use(express.json());

  router.get(
    '/monitors',
    async (req, res): Promise<any> => {
      let groups: Groups;

      if (req.query.entity) {
        const entityName = parseEntityRef(req.query.entity.toString());
        const entity = await catalogClient.getEntityByName(entityName);

        const annotation =
          entity?.metadata?.annotations?.[UPTIMEROBOT_MONITORS_ANNOTATION];
        if (!annotation) {
          return res
            .status(400)
            .send(
              `Couldn't find entity named "${req.query.entity.toString()}".`,
            );
        }

        groups = parseAnnotation(annotation);
      } else {
        groups = new Map();
        uptimerobotClient.apiKeys.forEach((_, name) => {
          groups.set(name, []);
        });
      }

      try {
        const monitors = await uptimerobotClient.getMonitors(groups);
        return res.send({ monitors });
      } catch (error) {
        console.log(error.message);
        return res.status(400).send(error.message);
      }
    },
  );

  return router;
}
