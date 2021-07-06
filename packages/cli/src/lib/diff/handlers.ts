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

import chalk from 'chalk';
import { diffLines } from 'diff';
import { FileDiff, PromptFunc, FileHandler, WriteFileFunc } from './types';

function sortObjectKeys(obj: Record<string, unknown>) {
  const sortedKeys = Object.keys(obj).sort();
  for (const key of sortedKeys) {
    const value = obj[key];
    delete obj[key];
    obj[key] = value;
  }
}

class PackageJsonHandler {
  static async handler(
    { path, write, missing, targetContents, templateContents }: FileDiff,
    prompt: PromptFunc,
    variant?: string,
  ) {
    console.log('Checking package.json');

    if (missing) {
      throw new Error(`${path} doesn't exist`);
    }

    const pkg = JSON.parse(templateContents);
    const targetPkg = JSON.parse(targetContents);

    const handler = new PackageJsonHandler(
      write,
      prompt,
      pkg,
      targetPkg,
      variant,
    );
    await handler.handle();
  }

  static async appHandler(file: FileDiff, prompt: PromptFunc) {
    return PackageJsonHandler.handler(file, prompt, 'app');
  }

  constructor(
    private readonly writeFunc: WriteFileFunc,
    private readonly prompt: PromptFunc,
    private readonly pkg: any,
    private readonly targetPkg: any,
    private readonly variant?: string,
  ) {}

  async handle() {
    await this.syncField('main');
    if (this.variant !== 'app') {
      await this.syncField('main:src');
    }
    await this.syncField('types');
    await this.syncFiles();
    await this.syncScripts();
    await this.syncPublishConfig();
    await this.syncDependencies('dependencies');
    await this.syncDependencies('devDependencies');
  }

  // Make sure a field inside package.json is in sync. This mutates the targetObj and writes package.json on change.
  private async syncField(
    fieldName: string,
    obj: any = this.pkg,
    targetObj: any = this.targetPkg,
    prefix?: string,
    sort?: boolean,
  ) {
    const fullFieldName = chalk.cyan(
      prefix ? `${prefix}[${fieldName}]` : fieldName,
    );
    const newValue = obj[fieldName];
    const coloredNewValue = chalk.cyan(JSON.stringify(newValue));

    if (fieldName in targetObj) {
      const oldValue = targetObj[fieldName];
      if (JSON.stringify(oldValue) === JSON.stringify(newValue)) {
        return;
      }

      const coloredOldValue = chalk.cyan(JSON.stringify(oldValue));
      const msg = `package.json has mismatched field, ${fullFieldName}, change from ${coloredOldValue} to ${coloredNewValue}?`;
      if (await this.prompt(msg)) {
        targetObj[fieldName] = newValue;
        if (sort) {
          sortObjectKeys(targetObj);
        }
        await this.write();
      }
    } else if (fieldName in obj) {
      if (
        await this.prompt(
          `package.json is missing field ${fullFieldName}, set to ${coloredNewValue}?`,
        )
      ) {
        targetObj[fieldName] = newValue;
        if (sort) {
          sortObjectKeys(targetObj);
        }
        await this.write();
      }
    }
  }

  private async syncFiles() {
    if (typeof this.targetPkg.configSchema === 'string') {
      const files = [...this.pkg.files, this.targetPkg.configSchema];
      await this.syncField('files', { files });
    } else {
      await this.syncField('files');
    }
  }

  private async syncScripts() {
    const pkgScripts = this.pkg.scripts;
    const targetScripts = (this.targetPkg.scripts =
      this.targetPkg.scripts || {});

    if (!pkgScripts) {
      return;
    }

    for (const key of Object.keys(pkgScripts)) {
      await this.syncField(key, pkgScripts, targetScripts, 'scripts');
    }
  }

  private async syncPublishConfig() {
    const pkgPublishConf = this.pkg.publishConfig;
    const targetPublishConf = this.targetPkg.publishConfig;

    // If template doesn't have a publish config we're done
    if (!pkgPublishConf) {
      return;
    }

    // Publish config can be removed the the target, skip in that case
    if (!targetPublishConf) {
      if (await this.prompt('Missing publishConfig, do you want to add it?')) {
        this.targetPkg.publishConfig = pkgPublishConf;
        await this.write();
      }
      return;
    }

    for (const key of Object.keys(pkgPublishConf)) {
      // Don't want to mess with peoples internal setup
      if (!['access', 'registry'].includes(key)) {
        await this.syncField(
          key,
          pkgPublishConf,
          targetPublishConf,
          'publishConfig',
        );
      }
    }
  }

  private async syncDependencies(fieldName: string) {
    const pkgDeps = this.pkg[fieldName];
    const targetDeps = (this.targetPkg[fieldName] =
      this.targetPkg[fieldName] || {});

    if (!pkgDeps) {
      return;
    }

    // Hardcoded removal of these during migration
    await this.syncField('@backstage/core', {}, targetDeps, fieldName, true);
    await this.syncField(
      '@backstage/core-api',
      {},
      targetDeps,
      fieldName,
      true,
    );

    for (const key of Object.keys(pkgDeps)) {
      if (this.variant === 'app' && key.startsWith('plugin-')) {
        continue;
      }

      await this.syncField(key, pkgDeps, targetDeps, fieldName, true);
    }
  }

  private async write() {
    await this.writeFunc(`${JSON.stringify(this.targetPkg, null, 2)}\n`);
  }
}

// Make sure the file is an exact match of the template
async function exactMatchHandler(
  { path, write, missing, targetContents, templateContents }: FileDiff,
  prompt: PromptFunc,
) {
  console.log(`Checking ${path}`);
  const coloredPath = chalk.cyan(path);

  if (missing) {
    if (await prompt(`Missing ${coloredPath}, do you want to add it?`)) {
      await write(templateContents);
    }
    return;
  }
  if (targetContents === templateContents) {
    return;
  }

  const diffs = diffLines(targetContents, templateContents);
  for (const diff of diffs) {
    if (diff.added) {
      process.stdout.write(chalk.green(`+${diff.value}`));
    } else if (diff.removed) {
      process.stdout.write(chalk.red(`-${diff.value}`));
    } else {
      process.stdout.write(` ${diff.value}`);
    }
  }

  if (
    await prompt(
      `Outdated ${coloredPath}, do you want to apply the above patch?`,
    )
  ) {
    await write(templateContents);
  }
}

// Adds the file if it is missing, but doesn't check existing files
async function existsHandler(
  { path, write, missing, templateContents }: FileDiff,
  prompt: PromptFunc,
) {
  console.log(`Making sure ${path} exists`);

  const coloredPath = chalk.cyan(path);

  if (missing) {
    if (await prompt(`Missing ${coloredPath}, do you want to add it?`)) {
      await write(templateContents);
    }
    return;
  }
}

async function skipHandler({ path }: FileDiff) {
  console.log(`Skipping ${path}`);
}

export const handlers = {
  skip: skipHandler,
  exists: existsHandler,
  exactMatch: exactMatchHandler,
  packageJson: PackageJsonHandler.handler,
  appPackageJson: PackageJsonHandler.appHandler,
};

export async function handleAllFiles(
  fileHandlers: FileHandler[],
  files: FileDiff[],
  promptFunc: PromptFunc,
) {
  for (const file of files) {
    const { path } = file;
    const fileHandler = fileHandlers.find(handler =>
      handler.patterns.some(pattern =>
        typeof pattern === 'string' ? pattern === path : pattern.test(path),
      ),
    );
    if (fileHandler) {
      await fileHandler.handler(file, promptFunc);
    } else {
      throw new Error(`No template file handler found for ${path}`);
    }
  }
}
