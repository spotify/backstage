/*
 * Copyright 2022 The Backstage Authors
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

import { ForwardedError, toError } from '@backstage/errors';
import { targetPaths } from '@backstage/cli-common';
import { runOutput } from '@backstage/cli-common';

/**
 * Run a git command, trimming the output splitting it into lines.
 */
export async function runGit(...args: string[]) {
  try {
    const stdout = await runOutput(['git', ...args], {
      cwd: targetPaths.workspaceRootDir,
    });
    return stdout.trim().split(/\r\n|\r|\n/);
  } catch (error) {
    const err = toError(error);
    if ('code' in err && typeof (err as { code?: number }).code === 'number') {
      const code = (err as { code?: number }).code;
      const stderr = (err as { stderr?: string }).stderr;
      const msg = stderr?.trim() ?? `with exit code ${code}`;
      throw new Error(`git ${args[0]} failed, ${msg}`);
    }
    throw new ForwardedError('Unknown execution error', error);
  }
}

/**
 * Utilities for working with git.
 *
 * @public
 */
export class GitUtils {
  /**
   * Returns a sorted list of all files that have changed since the merge base
   * of the provided `ref` and HEAD, as well as all files that are not tracked by git.
   */
  static async listChangedFiles(ref: string) {
    if (!ref) {
      throw new Error('ref is required');
    }

    let diffRef = ref;
    try {
      const [base] = await runGit('merge-base', 'HEAD', ref);
      diffRef = base;
    } catch {
      // silently fall back to using the ref directly if merge base is not available
    }

    const tracked = await runGit('diff', '--name-only', diffRef);
    const untracked = await runGit(
      'ls-files',
      '--others',
      '--exclude-standard',
    );

    return Array.from(new Set([...tracked, ...untracked]));
  }

  /**
   * Returns the contents of a file at a specific ref.
   */
  static async readFileAtRef(path: string, ref: string) {
    let showRef = ref;
    try {
      const [base] = await runGit('merge-base', 'HEAD', ref);
      showRef = base;
    } catch {
      // silently fall back to using the ref directly if merge base is not available
    }

    const stdout = await runOutput(['git', 'show', `${showRef}:${path}`], {
      cwd: targetPaths.workspaceRootDir,
    });
    return stdout;
  }
}
