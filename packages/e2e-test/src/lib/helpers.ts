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

import {
  spawn,
  execFile as execFileCb,
  SpawnOptions,
  ChildProcess,
} from 'child_process';
import { promisify } from 'util';

const execFile = promisify(execFileCb);

const EXPECTED_LOAD_ERRORS = /ECONNREFUSED|ECONNRESET|did not get to load all resources/;

export function spawnPiped(cmd: string[], options?: SpawnOptions) {
  function pipeWithPrefix(stream: NodeJS.WriteStream, prefix = '') {
    return (data: Buffer) => {
      const prefixedMsg = data
        .toString('utf8')
        .trimRight()
        .replace(/^/gm, prefix);
      stream.write(`${prefixedMsg}\n`, 'utf8');
    };
  }

  const child = spawn(cmd[0], cmd.slice(1), {
    stdio: 'pipe',
    shell: true,
    ...options,
  });
  child.on('error', exitWithError);

  const logPrefix = cmd.map(s => s.replace(/.+\//, '')).join(' ');
  child.stdout?.on(
    'data',
    pipeWithPrefix(process.stdout, `[${logPrefix}].out: `),
  );
  child.stderr?.on(
    'data',
    pipeWithPrefix(process.stderr, `[${logPrefix}].err: `),
  );

  return child;
}

export async function runPlain(cmd: string[], options?: SpawnOptions) {
  try {
    const { stdout } = await execFile(cmd[0], cmd.slice(1), {
      ...options,
      shell: true,
    });
    return stdout.trim();
  } catch (error) {
    if (error.stdout) {
      process.stdout.write(error.stdout);
    }
    if (error.stderr) {
      process.stderr.write(error.stderr);
    }
    throw error;
  }
}

export function exitWithError(err: Error & { code?: unknown }) {
  process.stdout.write(`${err.name}: ${err.stack || err.message}\n`);

  if (typeof err.code === 'number') {
    process.exit(err.code);
  } else {
    process.exit(1);
  }
}

/**
 * Waits for fn() to be true
 * Checks every 100ms
 * .cancel() is available
 * @returns {Promise} Promise of resolution
 */
export function waitFor(fn: () => boolean, maxSeconds: number = 120) {
  let count = 0;
  return new Promise<void>((resolve, reject) => {
    const handle = setInterval(() => {
      if (count++ > maxSeconds * 10) {
        reject(new Error('Timed out while waiting for condition'));
        return;
      }
      if (fn()) {
        clearInterval(handle);
        resolve();
        return;
      }
    }, 100);
  });
}

export async function waitForExit(child: ChildProcess) {
  if (child.exitCode !== null) {
    throw new Error(`Child already exited with code ${child.exitCode}`);
  }
  await new Promise<void>((resolve, reject) =>
    child.once('exit', code => {
      if (code) {
        reject(new Error(`Child exited with code ${code}`));
      } else {
        print('Child finished');
        resolve();
      }
    }),
  );
}

export async function waitForPageWithText(
  browser: any,
  path: string,
  text: string,
  { intervalMs = 1000, maxLoadAttempts = 240, maxFindTextAttempts = 3 } = {},
) {
  let loadAttempts = 0;
  for (;;) {
    try {
      await new Promise(resolve => setTimeout(resolve, intervalMs));
      await browser.visit(path);
      break;
    } catch (error) {
      if (error.message.match(EXPECTED_LOAD_ERRORS)) {
        loadAttempts++;
        if (loadAttempts >= maxLoadAttempts) {
          throw new Error(
            `Failed to load page '${path}', max number of attempts reached`,
          );
        }
      } else {
        throw error;
      }
    }
  }

  // The page may not be fully loaded and hence we need to retry.
  let findTextAttempts = 0;
  const escapedText = text.replace(/"|\\/g, '\\$&');
  for (;;) {
    try {
      browser.assert.evaluate(
        `Array.from(document.querySelectorAll("*")).some(el => el.textContent === "${escapedText}")`,
        true,
        `expected to find text ${text}`,
      );
      break;
    } catch (error) {
      findTextAttempts++;
      if (findTextAttempts <= maxFindTextAttempts) {
        await browser.visit(path);
        await new Promise(resolve => setTimeout(resolve, intervalMs));
        continue;
      } else {
        throw error;
      }
    }
  }
}

export function print(msg: string) {
  return process.stdout.write(`${msg}\n`);
}
