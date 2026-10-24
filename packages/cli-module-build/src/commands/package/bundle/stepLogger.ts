/*
 * Copyright 2026 The Backstage Authors
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

import chalk from 'chalk';
import fs from 'fs-extra';

const ansiPattern =
  // eslint-disable-next-line no-control-regex
  /[\x1b\x9b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><~]|\x1b]8;;[^\x07\x1b]*(?:\x07|\x1b\\)/g;
function stripAnsi(str: string): string {
  return str.replace(ansiPattern, '');
}

export function createStepLogger(
  logFilePath: string,
  verbose: boolean,
  prefix?: string,
) {
  const logStream = fs.createWriteStream(logFilePath);

  const writeLine = (line: string, stream: 'out' | 'err') => {
    const prefixed = prefix ? `${prefix}${line}` : line;
    logStream.write(
      `${stream === 'err' ? '[WARN] ' : ''}${stripAnsi(prefixed)}\n`,
    );
    if (verbose) {
      const writer = stream === 'err' ? console.warn : console.log;
      writer(chalk.dim(prefixed));
    }
  };

  const logger = {
    log(msg: string) {
      writeLine(msg, 'out');
    },
    warn(msg: string) {
      writeLine(msg, 'err');
    },
  };

  const logRunOutput = (stream: 'out' | 'err') => (data: Buffer) => {
    if (prefix) {
      for (const line of data.toString('utf8').split(/\r?\n/)) {
        if (line) writeLine(line, stream);
      }
    } else {
      logStream.write(
        `${stream === 'err' ? '[WARN] ' : ''}${stripAnsi(
          data.toString('utf8'),
        )}`,
      );
      if (verbose) {
        const writer = stream === 'err' ? console.warn : console.log;
        writer(chalk.dim(data.toString('utf8')));
      }
    }
  };

  const close = () => new Promise<void>(r => logStream.end(r));

  return { logger, logRunOutput, close, path: logFilePath };
}

export async function showLogOnError(
  logFilePath: string,
  verbose: boolean,
): Promise<void> {
  console.error(
    chalk.red(`\nFull log available at: ${chalk.cyan(logFilePath)}`),
  );
  if (!verbose) {
    try {
      const content = await fs.readFile(logFilePath, 'utf8');
      const tail = content.split('\n').slice(-20).join('\n');
      if (tail) {
        console.error(chalk.dim('\n--- last 20 lines ---'));
        console.error(tail);
      }
    } catch {
      /* log file may not exist yet */
    }
  }
}
