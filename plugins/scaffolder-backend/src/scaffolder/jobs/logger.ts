/*
 * Copyright 2020 The Backstage Authors
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
import { PassThrough } from 'stream';
import * as winston from 'winston';
import { JsonValue } from '@backstage/config';

export const makeLogStream = (meta: Record<string, JsonValue>) => {
  const log: string[] = [];

  // Create an empty stream to collect all the log lines into
  // one variable for the API.
  const stream = new PassThrough();
  stream.on('data', chunk => {
    const textValue = chunk.toString().trim();
    if (textValue?.length > 1) log.push(textValue);
  });

  const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.simple(),
    ),
    defaultMeta: meta,
  });

  logger.add(new winston.transports.Stream({ stream }));

  return {
    log,
    stream,
    logger,
  };
};
