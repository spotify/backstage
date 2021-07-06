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
  SpawnOptions,
  spawn,
  ChildProcess,
  execFile as execFileCb,
} from 'child_process';
import { ExitCodeError } from './errors';
import { promisify } from 'util';
import { LogFunc } from './logging';

const execFile = promisify(execFileCb);

type SpawnOptionsPartialEnv = Omit<SpawnOptions, 'env'> & {
  env?: Partial<NodeJS.ProcessEnv>;
  // Pipe stdout to this log function
  stdoutLogFunc?: LogFunc;
  // Pipe stderr to this log function
  stderrLogFunc?: LogFunc;
};

// Runs a child command, returning a promise that is only resolved if the child exits with code 0.
export async function run(
  name: string,
  args: string[] = [],
  options: SpawnOptionsPartialEnv = {},
) {
  const { stdoutLogFunc, stderrLogFunc } = options;
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    FORCE_COLOR: 'true',
    ...(options.env ?? {}),
  };

  const stdio = [
    'inherit',
    stdoutLogFunc ? 'pipe' : 'inherit',
    stderrLogFunc ? 'pipe' : 'inherit',
  ] as ('inherit' | 'pipe')[];

  const child = spawn(name, args, {
    stdio,
    shell: true,
    ...options,
    env,
  });

  if (stdoutLogFunc && child.stdout) {
    child.stdout.on('data', stdoutLogFunc);
  }
  if (stderrLogFunc && child.stderr) {
    child.stderr.on('data', stderrLogFunc);
  }

  await waitForExit(child, name);
}

export async function runPlain(cmd: string, ...args: string[]) {
  try {
    const { stdout } = await execFile(cmd, args, { shell: true });
    return stdout.trim();
  } catch (error) {
    if (error.stderr) {
      process.stderr.write(error.stderr);
    }
    throw new ExitCodeError(error.code, [cmd, ...args].join(' '));
  }
}

export async function runCheck(cmd: string, ...args: string[]) {
  try {
    await execFile(cmd, args, { shell: true });
    return true;
  } catch (error) {
    return false;
  }
}

export async function waitForExit(
  child: ChildProcess & { exitCode: number | null },
  name?: string,
): Promise<void> {
  if (typeof child.exitCode === 'number') {
    if (child.exitCode) {
      throw new ExitCodeError(child.exitCode, name);
    }
    return;
  }

  await new Promise<void>((resolve, reject) => {
    child.once('error', error => reject(error));
    child.once('exit', code => {
      if (code) {
        reject(new ExitCodeError(code, name));
      } else {
        resolve();
      }
    });
  });
}
