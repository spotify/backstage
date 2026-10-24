/*
 * Copyright 2024 The Backstage Authors
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
  basename,
  resolve as resolvePath,
  relative as relativePath,
} from 'node:path';
import os from 'node:os';
import fs from 'fs-extra';
import pLimit from 'p-limit';
import { createBinRunner } from '../../util';
import { CliHelpPage, CliModel } from './types';
import { targetPaths } from '@backstage/cli-common';
import { generateCliReport } from './generateCliReport';
import { logApiReportInstructions, logReportDiff } from '../common';

export function parseHelpPage(helpPageContent: string) {
  let usage: string | undefined;

  // Commander format: "Usage: backstage-cli ..."
  const commanderUsage = helpPageContent.match(/^\s*Usage: (.*)$/im);
  if (commanderUsage) {
    usage = commanderUsage[1];
  }

  const lines = helpPageContent.split(/\r?\n/);

  let options = new Array<string>();
  const commands = new Array<string>();
  let commandArguments = new Array<string>();

  while (lines.length > 0) {
    while (lines.length > 0 && !lines[0].endsWith(':')) {
      lines.shift();
    }
    if (lines.length > 0) {
      // Start of a new section, e.g. "Options:" or "FLAGS:"
      const sectionName = lines.shift()?.toLowerCase();
      // Take lines until we hit the next section or the end
      const sectionEndIndex = lines.findIndex(
        line => line && !line.match(/^\s/),
      );
      const sectionLines = lines.slice(0, sectionEndIndex);
      lines.splice(0, sectionLines.length);

      // Trim away documentation
      const sectionItems = sectionLines
        .map(line => line.match(/^\s{1,8}(.*?)\s\s+/)?.[1])
        .filter(Boolean) as string[];

      if (sectionName === 'options:' || sectionName === 'flags:') {
        options = sectionItems;
      } else if (sectionName === 'commands:' || sectionName === 'groups:') {
        commands.push(...sectionItems);
      } else if (sectionName === 'arguments:') {
        commandArguments = sectionItems;
      } else if (sectionName === 'usage:') {
        // cleye format: usage line is inside the USAGE: section
        const usageLine = sectionLines.find(l => l.trim().length > 0)?.trim();
        if (usageLine) {
          usage = usageLine;
        }
      } else {
        throw new Error(`Unknown CLI section: ${sectionName}`);
      }
    }
  }

  options.sort();
  commands.sort();
  commandArguments.sort();

  return {
    usage,
    options,
    commands,
    commandArguments,
  };
}

async function exploreCliHelpPages(
  run: (...args: string[]) => Promise<string>,
  limit: ReturnType<typeof pLimit>,
): Promise<CliHelpPage[]> {
  const helpPages = new Array<CliHelpPage>();

  async function exploreHelpPage(...path: string[]) {
    const content = await limit(() => run(...path, '--help'));
    const parsed = parseHelpPage(content);
    helpPages.push({ path, ...parsed });

    await Promise.all(
      parsed.commands.map(async fullCommand => {
        const command = fullCommand.split(/[|\s]/)[0];
        if (command !== 'help') {
          await exploreHelpPage(...path, command);
        }
      }),
    );
  }

  await exploreHelpPage();

  helpPages.sort((a, b) => a.path.join(' ').localeCompare(b.path.join(' ')));

  return helpPages;
}

interface CliExtractionOptions {
  packageDirs: string[];
  isLocalBuild: boolean;
}

export async function runCliExtraction({
  packageDirs,
  isLocalBuild,
}: CliExtractionOptions) {
  // Share a single concurrency limiter across all packages so that we run
  // multiple help-page invocations in parallel without exhausting resources.
  const limit = pLimit(os.cpus().length);

  await Promise.all(
    packageDirs.map(async packageDir => {
      console.log(`## Processing ${packageDir}`);
      const fullDir = targetPaths.resolveWorkspaceRoot(packageDir);
      const pkgJson = await fs.readJson(resolvePath(fullDir, 'package.json'));

      if (!pkgJson.bin) {
        if (pkgJson.backstage?.role === 'cli') {
          throw new Error(
            `CLI package ${pkgJson.name} is missing a "bin" field in its package.json`,
          );
        }
        return;
      }

      const models = new Array<CliModel>();
      if (typeof pkgJson.bin === 'string') {
        const run = createBinRunner(fullDir, pkgJson.bin);
        const helpPages = await exploreCliHelpPages(run, limit);
        models.push({ name: basename(pkgJson.bin), helpPages });
      } else {
        for (const [name, path] of Object.entries<string>(pkgJson.bin)) {
          const run = createBinRunner(fullDir, path);
          const helpPages = await exploreCliHelpPages(run, limit);
          models.push({ name, helpPages });
        }
      }

      for (const model of models) {
        const report = generateCliReport({ packageName: pkgJson.name, model });

        const reportPath = resolvePath(
          fullDir,
          `cli-report.${models.length === 1 ? '' : `${model.name}.`}md`,
        );
        const existingReport = await fs
          .readFile(reportPath, 'utf8')
          .catch(error => {
            if (error.code === 'ENOENT') {
              return undefined;
            }
            throw error;
          });

        if (existingReport !== report) {
          if (isLocalBuild) {
            console.warn(`CLI report changed for ${packageDir}`);
            await fs.writeFile(reportPath, report);
          } else {
            logApiReportInstructions();

            logReportDiff(
              relativePath(targetPaths.workspaceRootDir, reportPath),
              existingReport,
              report,
            );

            logApiReportInstructions();
            throw new Error(`CLI report changed for ${packageDir}`);
          }
        }
      }
    }),
  );
}
