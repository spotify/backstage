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

import * as winston from 'winston';
import { createRootLogger, getRootLogger, setRootLogger } from './rootLogger';

describe('rootLogger', () => {
  it('can replace the default logger', () => {
    const logger = winston.createLogger();
    jest.spyOn(logger, 'info').mockReturnValue(logger);

    setRootLogger(logger);
    getRootLogger().info('testing');

    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining('testing'),
    );
  });

  describe('createRootLoger', () => {
    it('creates a new logger', () => {
      const oldLogger = getRootLogger();
      const newLogger = createRootLogger();

      expect(oldLogger).not.toBe(newLogger);
    });

    it('replaces the existing root logger', () => {
      const oldLogger = getRootLogger();
      createRootLogger();
      const newLogger = getRootLogger();
      expect(oldLogger).not.toBe(newLogger);
    });

    it('can append additional default metadata', () => {
      const format = winston.format.json();
      const logger = createRootLogger({
        format,
        defaultMeta: {
          appName: 'backstage',
          appEnv: 'prod',
          containerId: 'abc',
        },
      });
      jest.spyOn(format, 'transform');

      logger.info('testing');

      expect(format.transform).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'testing',
          service: 'backstage',
          appName: 'backstage',
          appEnv: 'prod',
          containerId: 'abc',
        }),
        {},
      );
    });

    it('can add override existing transports', () => {
      const transport = new winston.transports.Console({ level: 'debug' });
      const logger = createRootLogger({ transports: [transport] });
      expect(logger.transports.length).toBe(1);
      expect(logger.transports[0]).toBe(transport);
    });

    it('can append an additional transport', () => {
      const logger = createRootLogger();
      const transport = new winston.transports.Console({ level: 'debug' });
      logger.add(transport);
      expect(logger.transports.length).toBe(2);
      expect(logger.transports[1]).toBe(transport);
      expect(logger.transports[1].level).toBe('debug');
    });

    it('can override default format', () => {
      const format = winston.format(() => false)();
      const logger = createRootLogger({ format });
      expect(
        logger.format.transform({ message: 'hello', level: 'info' }),
      ).toBeFalsy();
    });
  });
});
