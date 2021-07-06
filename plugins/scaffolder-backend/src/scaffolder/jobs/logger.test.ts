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
import { makeLogStream } from './logger';

describe('Logger', () => {
  const mockMeta = { test: 'blob' };

  it('should return empty log lines by default', async () => {
    const { log } = makeLogStream(mockMeta);

    expect(log).toEqual([]);
  });
  it('should add lines to the log when using the logger that is returned', async () => {
    const { logger, log } = makeLogStream(mockMeta);

    logger.info('TEST LINE');
    logger.warn('WARN LINE');

    const [first, second] = log;
    expect(log.length).toBe(2);

    expect(first).toContain('info');
    expect(first).toContain('TEST LINE');

    expect(second).toContain('warn');
    expect(second).toContain('WARN LINE');
  });

  it('should add lines from writing to the stream that is returned', async () => {
    const { stream, log } = makeLogStream(mockMeta);
    const textLine = 'SOMETHING';
    stream.write(textLine);

    expect(log).toContain(textLine);
  });
});
