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
import { Router, Request, json } from 'express';
import router from 'express-promise-router';
import { Logger } from 'winston';
import { TechDocsCache } from '.';
import { CacheInvalidationError } from './TechDocsCache';

type CacheClearRequestParams = {
  objects: string[];
};

type CacheClearRequest = Request<
  any,
  unknown,
  CacheClearRequestParams,
  unknown
>;

type CacheMiddlewareOptions = {
  cache: TechDocsCache;
  logger: Logger;
};

type ErrorCallback = (err?: Error) => void;

export const createCacheMiddleware = ({
  cache,
  logger,
}: CacheMiddlewareOptions): Router => {
  const cacheMiddleware = router();

  // And endpoint for handling cache invalidation external to the Backstage
  // Backend (e.g. from the TechDocs CLI).
  cacheMiddleware.use(json());
  cacheMiddleware.post(
    '/cache/invalidate',
    async (req: CacheClearRequest, res) => {
      if (req.body?.objects?.length) {
        logger.debug(
          `Clearing ${req.body.objects.length} cache entries: (eg: ${req.body.objects[0]})`,
        );

        try {
          const invalidated = await cache.invalidateMultiple(req.body.objects);
          logger.debug(
            `Successfully invalidated ${invalidated.length} cache entries`,
          );
          res.status(204).send();
        } catch (e) {
          if (e instanceof CacheInvalidationError) {
            const uniqueReasons = [
              ...new Set(e.rejections.map(r => r.reason.message)),
            ].join(', ');
            logger.warn(
              `Problem invalidating ${e.rejections.length} entries: ${uniqueReasons}`,
            );
          }
          res.status(500).send();
        }
      } else {
        res.status(400).send();
      }
    },
  );

  // Middleware that, through socket monkey patching, captures responses as
  // they're sent over /static/docs/* and caches them. Subsequent requests are
  // loaded from cache. Cache key is the object's path (after `/static/docs/`).
  cacheMiddleware.use(async (req, res, next) => {
    const socket = res.socket;
    const isCacheable = req.path.includes('/static/docs/');

    // Continue early if this is non-cacheable, or there's no socket.
    if (!isCacheable || !socket) {
      next();
      return;
    }

    // Make concrete references to these things.
    const reqPath = decodeURI(req.path.match(/\/static\/docs\/(.*)$/)![1]);
    const realEnd = socket.end.bind(socket);
    const realWrite = socket.write.bind(socket);
    let writeToCache = true;
    const chunks: Buffer[] = [];

    // Monkey-patch the response's socket to keep track of chunks as they are
    // written over the wire.
    socket.write = (
      data: string | Uint8Array,
      encoding?: BufferEncoding | ErrorCallback,
      callback?: ErrorCallback,
    ) => {
      chunks.push(Buffer.from(data));
      if (typeof encoding === 'function') {
        return realWrite(data, encoding);
      }
      return realWrite(data, encoding, callback);
    };

    // When a socket is closed, if there were no errors and the data written
    // over the socket should be cached, cache it as a base64-encoded string!
    socket.on('close', hadError => {
      if (writeToCache && !hadError) {
        cache.set(reqPath, Buffer.concat(chunks));
      }
    });

    // Attempt to retrieve data from the cache.
    const cached = await cache.get(reqPath);

    // If there is a cache hit, write it out on the socket, ensure we don't re-
    // cache the data, and prevent going back to canonical storage by never
    // calling next().
    if (cached) {
      writeToCache = false;
      realEnd(cached);
      return;
    }

    // No data retrieved from cache: allow retrieval from canonical storage.
    next();
  });

  return cacheMiddleware;
};
