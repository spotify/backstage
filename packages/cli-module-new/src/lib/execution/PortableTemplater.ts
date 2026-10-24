/*
 * Copyright 2025 The Backstage Authors
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

import handlebars from 'handlebars';
import { PortableTemplateParams } from '../types';
import camelCase from 'lodash/camelCase';
import kebabCase from 'lodash/kebabCase';
import lowerCase from 'lodash/lowerCase';
import snakeCase from 'lodash/snakeCase';
import startCase from 'lodash/startCase';
import upperCase from 'lodash/upperCase';
import upperFirst from 'lodash/upperFirst';
import lowerFirst from 'lodash/lowerFirst';
import { YarnLockfile } from '@backstage/cli-node';
import { targetPaths } from '@backstage/cli-common';

import { createPackageVersionProvider } from '../version';
import { hasBackstageYarnPlugin } from '@backstage/cli-node';

const builtInHelpers = {
  camelCase,
  kebabCase,
  lowerCase,
  snakeCase,
  startCase,
  upperCase,
  upperFirst,
  lowerFirst,
};

type CreatePortableTemplaterOptions = {
  values?: PortableTemplateParams;
  templatedValues?: Record<string, string>;
};

export class PortableTemplater {
  static async create(options: CreatePortableTemplaterOptions = {}) {
    let lockfile: YarnLockfile | undefined;
    try {
      lockfile = await YarnLockfile.load(
        targetPaths.resolveWorkspaceRoot('yarn.lock'),
      );
    } catch {
      /* ignored */
    }

    const yarnPluginEnabled = await hasBackstageYarnPlugin();
    const versionProvider = createPackageVersionProvider(lockfile, {
      preferBackstageProtocol: yarnPluginEnabled,
    });

    const templater = new PortableTemplater(
      {
        versionQuery(name: string, versionHint: string | unknown) {
          const version = versionProvider(
            name,
            typeof versionHint === 'string' ? versionHint : undefined,
          );
          if (!version) {
            throw new Error(`No version available for package ${name}`);
          }
          return version;
        },
      },
      options.values ?? {},
      versionProvider,
    );

    if (options.templatedValues) {
      templater.appendTemplatedValues(options.templatedValues);
    }

    return templater;
  }

  readonly #templater: typeof handlebars;
  readonly #versionProvider: ReturnType<typeof createPackageVersionProvider>;
  #values: PortableTemplateParams;

  private constructor(
    helpers: handlebars.HelperDeclareSpec,
    values: PortableTemplateParams,
    versionProvider: ReturnType<typeof createPackageVersionProvider>,
  ) {
    this.#templater = handlebars.create();
    this.#versionProvider = versionProvider;

    this.#templater.registerHelper(builtInHelpers);

    if (helpers) {
      this.#templater.registerHelper(helpers);
    }

    this.#values = values;
  }

  template(content: string): string {
    return this.#templater.compile(content, {
      strict: true,
    })(this.#values);
  }

  getPackageVersion(name: string): string | undefined {
    return this.#versionProvider(name);
  }

  appendTemplatedValues(record: Record<string, string>): void {
    const newValues = Object.fromEntries(
      Object.entries(record).map(([key, value]) => [key, this.template(value)]),
    );
    this.#values = { ...this.#values, ...newValues };
  }
}
